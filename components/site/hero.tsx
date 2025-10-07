import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Film, Rocket, Sparkles, Zap } from "lucide-react"

export function Hero() {
  return (
    <section className="relative container mx-auto px-4 py-16 md:py-24 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-brand-strong-start/20 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-brand-strong-end/20 rounded-full blur-3xl animate-pulse-glow animation-delay-2000" />
      </div>

      <div className="grid gap-12 md:grid-cols-2 items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 backdrop-blur-sm">
            <Sparkles className="size-4 text-brand-strong-start" />
            <span className="text-sm font-medium text-brand-gradient">Powered by FFmpeg.js</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-balance leading-tight">
            <span className="text-brand-gradient animate-gradient bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600">
              Convert Videos
            </span>
            <br />
            <span className="text-foreground">Instantly & Free</span>
          </h1>

          <div className="h-1 w-32 rounded-full bg-gradient-to-r from-brand-strong-start to-brand-strong-end animate-pulse-glow" />

          <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
            Upload any video and convert to your desired format in seconds. 100% browser-based processing means your files never leave your device.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Button asChild size="lg" className="btn-gradient hover-glow group">
              <Link href="#convert" className="inline-flex items-center gap-2">
                <Rocket className="size-5 group-hover:rotate-12 transition-transform" aria-hidden="true" />
                Start Converting Now
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-2 hover:border-brand-strong-start hover:bg-brand-strong-start/5">
              <Link href="#tools" className="inline-flex items-center gap-2">
                <Zap className="size-4" />
                Explore Features
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-8 pt-4">
            <div>
              <div className="text-3xl font-bold text-brand-gradient">7+</div>
              <div className="text-sm text-muted-foreground">Formats Supported</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-brand-gradient">100%</div>
              <div className="text-sm text-muted-foreground">Privacy Secured</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-brand-gradient">0$</div>
              <div className="text-sm text-muted-foreground">Always Free</div>
            </div>
          </div>
        </div>

        {/* Feature Card */}
        <div className="relative">
          <div className="card-glass shadow-brand-xl p-8 space-y-6 animate-float">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-brand-strong-start to-brand-strong-end shadow-lg">
                <Film className="size-6 text-white" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Popular Conversions</h3>
                <p className="text-sm text-muted-foreground">Fast & Reliable</p>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { from: "MP4", to: "MP3", icon: "🎵" },
                { from: "MOV", to: "MP4", icon: "🎬" },
                { from: "AVI", to: "MKV", icon: "📹" },
              ].map((conv, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-muted/50 to-transparent border border-border/50 hover:border-brand-strong-start/50 transition-all hover:scale-105"
                >
                  <span className="text-2xl">{conv.icon}</span>
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <span className="px-3 py-1 rounded-lg bg-background border">{conv.from}</span>
                    <span className="text-brand-gradient">→</span>
                    <span className="px-3 py-1 rounded-lg bg-gradient-to-r from-brand-strong-start to-brand-strong-end text-white border-0">
                      {conv.to}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-border/50">
              <p className="text-xs text-muted-foreground text-center">
                ⚡ Instant conversion • 🔒 Secure & Private • 📱 Works on all devices
              </p>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-brand-strong-start/20 rounded-full blur-2xl -z-10" />
          <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-brand-strong-end/20 rounded-full blur-2xl -z-10" />
        </div>
      </div>
    </section>
  )
}
