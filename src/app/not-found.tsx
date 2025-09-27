import Link from 'next/link'
import { Button } from '@/components/ui/button'
 
export default function NotFound() {
  return (
    <div className="grid items-center justify-items-center min-h-screen p-4 pb-20 gap-8 sm:p-10]">
    <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
    <h1 className="text-2xl tracking-tighter sm:text-2xl md:text-3xl lg:text-4xl/none">Not Found</h1>
      <p>It looks like the page you were trying to find doesn't exist or may have moved. Don't worry, we can help you find your way.</p>
      <Button >
        <Link href="/">Start Page</Link>
     </Button>
     <Button >
        <Link href="/collections">Explore Collections</Link>
     </Button>
     <Button >
        <Link href="https://mediolano.xyz/contact">Contact Suport</Link>
     </Button>
     
      </main>
      </div>
  )
}