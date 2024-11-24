'use client'

import Link from 'next/link'
import Image from "next/image";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ArrowLeftRight, Book, BookIcon, BookMarked, Coins, FileCheck, FileCode, FileIcon, FileLock, Film, Globe, Globe2, LayoutGrid, ListChecks, Palette, ScrollText, ShieldCheck, ShieldQuestion, UserRoundCheck, Wallet2, Zap } from 'lucide-react'
import DappInfo from './DappInfo';



export  function Footer() {
  return (
    <>
    <DappInfo/>
    <footer className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/50 text-foreground">
      
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Mediolano.app</h2>
            <p className="text-muted-foreground">Revolutionizing intellectual property management with blockchain technology. Powered by Starknet.</p>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Dapp Services</h3>
            <ul className="space-y-2">
              <li><Link href="/register" className="flex items-center hover:underline"><FileCheck className="w-4 h-4 mr-2" /> Register</Link></li>
              <li><Link href="/monetize" className="flex items-center hover:underline"><Coins className="w-4 h-4 mr-2" /> Monetize</Link></li>
              <li><Link href="/listing" className="flex items-center hover:underline"><Globe className="w-4 h-4 mr-2" /> Listing</Link></li>
              <li><Link href="/licensing" className="flex items-center hover:underline"><ShieldCheck className="w-4 h-4 mr-2" /> License</Link></li>
              <li><Link href="/portfolio" className="flex items-center hover:underline"><Book className="w-4 h-4 mr-2" /> Portfolio</Link></li>
              <li><Link href="/sell" className="flex items-center hover:underline"><Zap className="w-4 h-4 mr-2" /> Sell</Link></li>
              <li><Link href="/marketplace" className="flex items-center hover:underline"><LayoutGrid className="w-4 h-4 mr-2" /> Marketplace</Link></li>

            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">IP Templates</h3>
            <ul className="space-y-2">
              <li><Link href="/register/templates/art" className="flex items-center hover:underline"><Palette className="w-4 h-4 mr-2" /> Art</Link></li>
              <li><Link href="/register/templates/document" className="flex items-center hover:underline"><FileIcon className="w-4 h-4 mr-2" /> Document</Link></li>
              <li><Link href="/register/templates/movies" className="flex items-center hover:underline"><Film className="w-4 h-4 mr-2" /> Movies</Link></li>
              <li><Link href="/register/templates/nft" className="flex items-center hover:underline"><FileLock className="w-4 h-4 mr-2" /> NFT</Link></li>
              <li><Link href="/register/templates/patent" className="flex items-center hover:underline"><ScrollText className="w-4 h-4 mr-2" /> Patent</Link></li>
              <li><Link href="/register/templates/publication" className="flex items-center hover:underline"><BookIcon className="w-4 h-4 mr-2" /> Publication</Link></li>
              <li><Link href="/register/templates/rwa" className="flex items-center hover:underline"><Globe2 className="w-4 h-4 mr-2" /> Real World Assets</Link></li> 
              <li><Link href="/software" className="flex items-center hover:underline"><FileCode className="w-4 h-4 mr-2" /> Software</Link></li>           </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Resources</h3>
            <ul className="space-y-2">
              <li><Link href="/support" className="flex items-center hover:underline"><UserRoundCheck className="w-4 h-4 mr-2" /> Support</Link></li>
              <li><Link href="/" className="flex items-center hover:underline"><BookMarked className="w-4 h-4 mr-2" /> Documentation</Link></li>
              <li><Link href="/faq" className="flex items-center hover:underline"><ShieldQuestion className="w-4 h-4 mr-2" /> FAQs</Link></li>
            </ul>
          </div>
        </div>
        <Separator className="my-8" />
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex space-x-4">
            <Button variant="ghost" size="icon">
            <Link href="https://x.com/mediolanoapp" title='Mediolano X Profile' target='_blank'>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              <span className="sr-only">X</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon">
            <Link href="https://www.youtube.com/@Mediolano-app/videos" title='Mediolano Youtube Videos' target='_blank'>
<svg width="800" height="800" viewBox="0 -17 180 180" fill="none" xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#a)" fill="#000"><path d="M178.624 73.933q-.192-3.75-.373-7.501-.323-6.877-.63-13.756c-.397-8.775-.808-17.848-1.263-26.77a24.03 24.03 0 0 0-6.911-16.092c-5.168-5.261-11.908-7.869-20.61-7.972-19.114-.228-41.742-.49-64.652-.722-4.049-.042-8.165-.028-12.143-.016q-3.356.01-6.716.012-4.817-.005-9.633-.04c-7.22-.041-14.68-.085-22.02.055-6.513.124-11.911 1.44-16.5 4.025C7.72 10.479 2.689 18.246 2.22 28.243c-.255 5.447-.343 10.992-.427 16.353l-.028 1.772q-.155 9.536-.28 19.073c-.16 11.441-.325 23.272-.576 34.905-.154 7.119.205 15.476 4.031 23.479 3.277 6.854 7.571 11.305 13.514 14.005a68.6 68.6 0 0 0 16.505 4.973c9.99 1.787 20.239 1.99 30.15 2.186l.811.016c1.663.033 3.361.165 5.003.292.774.059 1.547.119 2.32.17h67.433l.075-.005c1.219-.138 2.44-.257 3.661-.377 2.64-.259 5.371-.525 8.035-.985 14.228-2.449 23.735-11.794 25.433-24.997a198.4 198.4 0 0 0 1.292-33.576c-.154-3.866-.354-7.794-.549-11.594m-10.667 11.289c-.108 10.901-.739 21.881-1.433 33.107-.621 10.06-9.34 14.394-16.618 15.049-2.914.262-5.837.399-8.687.409l-12.653.046c-20.584.076-41.87.157-62.801.109-11.862-.027-23.436-.288-34.617-3.16a46 46 0 0 1-9.867-3.693c-3.523-1.843-6.058-5.102-7.745-9.962a65 65 0 0 1-3.4-21.187c-.066-9.189.1-18.537.257-27.577l.105-6.185c.163-10.035.333-20.412.667-30.606.384-11.693 6.988-19.119 18.594-20.91a120 120 0 0 1 18.304-1.366h.668c10.867.056 21.917.329 32.604.591q6.59.162 13.18.312a.69.69 0 0 0 .557-.272q6.933.173 13.866.343c13.042.322 26.527.657 39.789 1.035 3.93.112 8.049.617 11.553 3.527 3.462 2.88 5.166 5.979 5.358 9.755l.131 2.578c.469 9.145.952 18.603 1.321 27.907q.122 3.106.262 6.213c.333 7.853.684 15.97.605 23.938z"/><path d="M114.992 63.349c-2.739-2.24-5.543-4.426-7.923-6.269l-2.828-2.19c-7.433-5.756-15.12-11.71-22.73-17.501a16.7 16.7 0 0 0-4.339-2.2c-2.736-1-5.448-.13-6.754 2.166-1.823 3.206-2.775 5.942-2.912 8.363-.354 6.28-.425 12.675-.493 18.858-.025 2.22-.05 4.444-.088 6.664a.67.67 0 0 0-.405.596l-.21 6.162q-.299 8.817-.613 17.635c-.091 2.52.737 4.214 2.532 5.181a5 5 0 0 0 2.404.627 6.3 6.3 0 0 0 3.369-1.099q5.559-3.536 11.124-7.067c9.648-6.125 19.625-12.458 29.404-18.747 2.327-1.497 3.616-3.325 3.727-5.286.113-2.017-1.016-4.054-3.265-5.893m-10.879 5.676L75.465 87.718l.734-39.75c5.814 3.927 11.258 8.185 17 12.678 3.529 2.757 7.167 5.603 10.914 8.379"/></g><defs><clipPath id="a"><path fill="#fff" d="M.599.892h179.18v145.051H.599z"/></clipPath></defs></svg>              <span className="sr-only">LinkedIn</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon">
            <Link href="https://github.com/mediolano-app" title='Open-Source Repositories' target='_blank'>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-github"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
              <span className="sr-only">GitHub</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon">
            <Link href="https://mediolano-app" title='Discover Mediolano.app' target='_blank'>
            <svg width="800" height="800" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M3.512 15h4.66A26 26 0 0 1 8 12c0-1.044.06-2.052.172-3h-4.66A9 9 0 0 0 3 12c0 1.052.18 2.062.512 3m.424 1a9.02 9.02 0 0 0 6.092 4.783c-.78-1.06-1.376-2.746-1.714-4.783zm16.552-1A9 9 0 0 0 21 12c0-1.052-.18-2.062-.512-3h-4.66c.113.948.172 1.956.172 3s-.06 2.052-.172 3zm-.424 1h-4.378c-.338 2.037-.935 3.723-1.714 4.783A9.02 9.02 0 0 0 20.064 16m-10.88-1h5.632c.118-.938.184-1.947.184-3s-.066-2.062-.184-3H9.184A24 24 0 0 0 9 12c0 1.053.066 2.062.184 3m.151 1c.522 2.968 1.583 5 2.665 5s2.143-2.032 2.665-5zm-5.4-8h4.379c.338-2.037.935-3.723 1.714-4.783A9.02 9.02 0 0 0 3.936 8m16.13 0a9.02 9.02 0 0 0-6.093-4.783c.78 1.06 1.376 2.746 1.714 4.783zM9.334 8h5.33C14.143 5.032 13.082 3 12 3S9.857 5.032 9.335 8M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10"/></svg>
            <span className="sr-only">Website Mediolano.app</span>
              </Link>
            </Button>
          </div>
          <div className="flex items-center space-x-2">
          
          <Link href="/" className="flex items-center space-x-2">
            <div>
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
              </div>
              
                <span className="hidden font-bold sm:inline-block">
                </span>
          </Link>

          <Link href="/" className="flex items-center space-x-2">
            <div>
              <Image
                className="hidden dark:block"
                src="/Starknet-Dark.svg"
                alt="dark-mode-image"
                width={140}
                height={33}
              />
              <Image
                className="block dark:hidden"
                src="/Starknet-Light.svg"
                alt="light-mode-image"
                width={140}
                height={33}
              />
              </div>
              
                <span className="hidden font-bold sm:inline-block">
                </span>
          </Link>


          </div>
        </div>
        <Separator className="my-8" />
        <div className="text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Mediolano. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <Link href="#" className="hover:underline">Privacy Policy</Link>
            <Link href="#" className="hover:underline">Terms of Service</Link>
            <Link href="#" className="hover:underline">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
    </>
  )
}