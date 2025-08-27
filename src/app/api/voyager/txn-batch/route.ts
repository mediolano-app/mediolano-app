import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

type BatchResult = Record<string, { timestampIso: string; sender?: string }>

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const hashes: string[] = Array.isArray(body?.hashes) ? body.hashes : []
    if (!hashes.length) {
      return NextResponse.json({ error: 'hashes array required' }, { status: 400 })
    }

    const base =
      process.env.VOYAGER_BASE_URL ||
      process.env.NEXT_PUBLIC_EXPLORER_URL ||
      'https://voyager.online'

    // Concurrency limit
    const limit = 4
    const queue = [...new Set(hashes)]
    const results: BatchResult = {}

    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
    const worker = async () => {
      while (queue.length) {
        const h = queue.shift()!
        const url = `${base}/api/txn/${h}`
        try {
          // Exponential backoff with jitter for 429/5xx
          let attempt = 0
          let res: Response | undefined
          while (attempt < 5) {
            res = await fetch(url, { cache: 'no-store' })
            if (res.ok) break
            const retryable = res.status === 429 || (res.status >= 500 && res.status < 600)
            if (!retryable) break
            const baseDelay = 300 * Math.pow(2, attempt)
            const jitter = Math.floor(Math.random() * 150)
            await sleep(baseDelay + jitter)
            attempt += 1
          }
          if (!res || !res.ok) throw new Error(String(res?.status || 'fetch_failed'))
          const json = await res.json()
          const ts = json?.header?.timestamp
          const iso = ts ? new Date(ts * 1000).toISOString() : new Date().toISOString()
          const senderCandidate =
            json?.header?.sender_address ??
            json?.sender_address ??
            json?.senderAddress ??
            json?.meta?.sender_address ??
            json?.data?.sender_address
          const sender = senderCandidate ? String(senderCandidate) : undefined
          results[h] = { timestampIso: iso, sender }
        } catch {
          // Soft-fail per item
          results[h] = { timestampIso: new Date().toISOString(), sender: undefined }
        }
      }
    }

    const workers = Array.from({ length: Math.max(1, Math.min(limit, hashes.length)) }, worker)
    await Promise.all(workers)
    return NextResponse.json(results, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ error: 'Batch proxy failed', message: err?.message || 'unknown' }, { status: 500 })
  }
}

