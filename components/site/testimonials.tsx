import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Alex Johnson",
    role: "Content Creator",
    quote: "VidConvert saved me hours. It’s fast, simple, and reliable.",
  },
  {
    name: "Priya Shah",
    role: "Marketing Lead",
    quote: "The clean UI and instant conversions are a game-changer.",
  },
  {
    name: "Marco Silva",
    role: "Editor",
    quote: "I love the no-signup flow and the quality of conversions.",
  },
]

export function Testimonials() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {testimonials.map((t) => (
        <Card key={t.name} className="card-glass shadow-brand-lg hover:scale-[1.02] transition-transform">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <Image
                src="/placeholder-user.jpg"
                alt={`${t.name} avatar`}
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
              <div>
                <p className="font-medium leading-tight">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </div>
            <div className="mt-2 flex items-center gap-1 text-brand-strong">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} className="size-4" aria-hidden="true" />
              ))}
              <span className="sr-only">5 out of 5 stars</span>
            </div>
            <p className="text-sm mt-3 text-pretty">“{t.quote}”</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
