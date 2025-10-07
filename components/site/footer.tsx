import Link from "next/link"
import { Github, Twitter, Linkedin } from "lucide-react"

export function Footer() {
  return (
    <footer>
      <div className="h-px bg-brand-gradient" aria-hidden="true" />
      <div className="footer-dark">
        <div className="container mx-auto px-4 py-10 grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="font-semibold">VidConvert</h3>
            <p className="text-sm opacity-80 mt-2">
              Fast, secure, and reliable video conversion. Ready for your workflow.
            </p>
          </div>
          <nav aria-label="Quick Links" className="grid gap-2 text-sm">
            <Link href="/" className="opacity-80 hover:opacity-100">
              Home
            </Link>
            <a href="/#tools" className="opacity-80 hover:opacity-100">
              Tools
            </a>
            <Link href="/pricing" className="opacity-80 hover:opacity-100">
              Pricing
            </Link>
            <Link href="/contact" className="opacity-80 hover:opacity-100">
              Contact
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <a
              href="https://twitter.com"
              aria-label="Twitter"
              className="opacity-80 hover:opacity-100 hover-glow p-2 rounded"
            >
              <Twitter className="size-5" />
            </a>
            <a
              href="https://github.com"
              aria-label="GitHub"
              className="opacity-80 hover:opacity-100 hover-glow p-2 rounded"
            >
              <Github className="size-5" />
            </a>
            <a
              href="https://linkedin.com"
              aria-label="LinkedIn"
              className="opacity-80 hover:opacity-100 hover-glow p-2 rounded"
            >
              <Linkedin className="size-5" />
            </a>
          </div>
        </div>
        <div className="border-t border-white/10">
          <p className="container mx-auto px-4 py-4 text-xs opacity-70">
            © {new Date().getFullYear()} VidConvert. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
