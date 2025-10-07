import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Film, Rocket } from "lucide-react"

export function Hero() {
  return (
    <section className="container mx-auto px-4 py-10 md:py-16">
      <div className="grid gap-6 md:grid-cols-2 items-center">
        <div>
          <h1 className="text-3xl md:text-6xl font-semibold text-balance text-brand-gradient">
            Convert Your Videos Instantly — Free & Fast
          </h1>
          <div className="mt-3 h-1.5 w-24 rounded-full bg-brand-strong" aria-hidden="true" />
          <p className="text-muted-foreground mt-4 text-pretty">
            Upload any video and convert to your desired format in seconds. No signup required. Secure and private by
            default.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button asChild className="btn-dark hover-brand-gradient hover-glow">
              <Link href="#convert" className="inline-flex items-center gap-2">
                <Rocket className="size-4" aria-hidden="true" />
                Start Converting
              </Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="#tools">Explore Tools</Link>
            </Button>
          </div>
        </div>
        <div className="rounded-2xl border bg-card/70 backdrop-blur-md p-6 shadow-brand-lg">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Film className="size-5" aria-hidden="true" />
            <span>Popular: MP4 → MP3, MOV → MP4, AVI → MKV</span>
          </div>
          <div className="mt-4 h-40 rounded-lg bg-secondary" aria-hidden="true" />
        </div>
      </div>
    </section>
  )
}
