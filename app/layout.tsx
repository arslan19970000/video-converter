import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Navbar } from "@/components/site/navbar"
import { Footer } from "@/components/site/footer"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "VidConvert",
  description: "Convert your videos instantly — free & fast",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <div
          className="min-h-dvh flex flex-col"
          style={{
            backgroundImage: "linear-gradient(180deg, var(--color-brand-start), var(--color-brand-end))",
          }}
        >
          <Suspense fallback={<div>Loading...</div>}>
            <Navbar />
          </Suspense>
          <main className="flex-1">{children}</main>
          <Suspense fallback={<div>Loading...</div>}>
            <Footer />
          </Suspense>
        </div>
        <Analytics />
      </body>
    </html>
  )
}
