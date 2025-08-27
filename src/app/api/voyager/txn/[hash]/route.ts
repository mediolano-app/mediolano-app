import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(_req: NextRequest, context: { params: { hash: string } }) {
  const { hash } = context.params
  if (!hash) {
    return NextResponse.json({ error: 'Missing tx hash' }, { status: 400 })
  }

  const base =
    process.env.VOYAGER_BASE_URL ||
    process.env.NEXT_PUBLIC_EXPLORER_URL ||
    'https://voyager.online'

  const url = `${base}/api/txn/${hash}`

  try {
    const res = await fetch(url, { cache: 'no-store' })
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      return NextResponse.json({ error: 'Upstream error', status: res.status, text }, { status: res.status })
    }
    const json = await res.json()
    return NextResponse.json(json, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ error: 'Proxy failed', message: err?.message || 'unknown' }, { status: 500 })
  }
}

