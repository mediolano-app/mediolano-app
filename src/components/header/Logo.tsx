import { Copyright } from 'lucide-react'
import Link from 'next/link'
import Image from "next/image";

export function Logo() {
  return (
    <div className="flex items-center space-x-2 ml-10">
    <Link href="/" className="">
      
        <Image
          className="hidden dark:block"
          src="/mediolano-logo-dark.png"
          alt="dark-mode-image"
          width={140}
          height={33}
        />
        <Image
          className="block dark:hidden"
          src="/mediolano-logo-light.svg"
          alt="light-mode-image"
          width={140}
          height={33}
        />
         
    </Link>
    </div>
  )
}