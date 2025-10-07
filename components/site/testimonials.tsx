import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    name: "Alex Johnson",
    role: "Content Creator",
    quote: "VidConvert saved me hours. It's fast, simple, and reliable. The browser-based conversion is genius!",
    avatar: "AJ",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    name: "Priya Shah",
    role: "Marketing Lead",
    quote: "The clean UI and instant conversions are a game-changer. No more uploading files to sketchy websites.",
    avatar: "PS",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    name: "Marco Silva",
    role: "Video Editor",
    quote: "I love the no-signup flow and the quality of conversions. This tool is now part of my daily workflow.",
    avatar: "MS",
    gradient: "from-orange-500 to-red-500",
  },
]

export function Testimonials() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold">
          Loved by <span className="text-brand-gradient">Creators</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Join thousands of content creators, marketers, and video editors who trust VidConvert.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {testimonials.map((t) => (
          <Card
            key={t.name}
            className="group card-glass shadow-brand-lg card-hover border-0 relative overflow-hidden"
          >
            {/* Quote icon background */}
            <Quote className="absolute -top-2 -right-2 size-24 text-muted/10 group-hover:text-brand-strong-start/20 transition-colors" />

            <CardContent className="p-6 relative">
              <div className="space-y-4">
                {/* Rating */}
                <div className="flex items-center gap-1">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star
                      key={i}
                      className="size-4 fill-yellow-400 text-yellow-400"
                      aria-hidden="true"
                    />
                  ))}
                  <span className="sr-only">5 out of 5 stars</span>
                </div>

                {/* Quote */}
                <p className="text-sm leading-relaxed italic">"{t.quote}"</p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br ${t.gradient} text-white font-bold shadow-lg`}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
