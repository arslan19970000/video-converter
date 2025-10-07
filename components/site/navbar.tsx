"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2" aria-label="VidConvert Home">
          <Image src="/placeholder-logo.svg" alt="VidConvert logo" width={28} height={28} className="rounded" />
          <span className="font-semibold tracking-tight">VidConvert</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>
          <a href="/#tools" className="hover:text-primary">
            Tools
          </a>
          <Link href="/pricing" className="hover:text-primary">
            Pricing
          </Link>
          <Link href="/contact" className="hover:text-primary">
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="hidden md:inline-flex btn-dark hover-brand-gradient hover-glow">
            <Link href="/#convert">Convert Now</Link>
          </Button>
          <button
            className="md:hidden inline-flex p-2 rounded-md hover:bg-muted"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label="Toggle Menu"
          >
            <Menu className="size-5" />
          </button>
        </div>
      </div>

      <div className="h-px bg-brand-gradient" aria-hidden="true" />

      <div id="mobile-nav" className={cn("md:hidden border-t bg-background/95", open ? "block" : "hidden")}>
        <nav className="container mx-auto px-4 py-3 grid gap-2 text-sm">
          <Link href="/" onClick={() => setOpen(false)} className="py-2 hover:text-primary">
            Home
          </Link>
          <a href="/#tools" onClick={() => setOpen(false)} className="py-2 hover:text-primary">
            Tools
          </a>
          <Link href="/pricing" onClick={() => setOpen(false)} className="py-2 hover:text-primary">
            Pricing
          </Link>
          <Link href="/contact" onClick={() => setOpen(false)} className="py-2 hover:text-primary">
            Contact
          </Link>
          <Button asChild size="sm" className="mt-2 btn-dark hover-brand-gradient hover-glow">
            <Link href="/#convert">Convert Now</Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}
