import { Card, CardContent } from "@/components/ui/card"
import { ShieldCheck, Gauge, UserRoundCheck, Lock, Zap, Sparkles } from "lucide-react"

const items = [
  { icon: Gauge, title: "Fast Conversion", desc: "Optimized pipeline for quick results." },
  { icon: UserRoundCheck, title: "No Signup", desc: "Convert files without creating an account." },
  { icon: ShieldCheck, title: "Secure & Private", desc: "Your files are processed safely." },
  { icon: Zap, title: "Multiple Formats", desc: "MP4, MOV, AVI, MKV, MP3, and more." },
  { icon: Lock, title: "Encrypted", desc: "Built to keep your content protected." },
  { icon: Sparkles, title: "Polished UI", desc: "Clean, modern, and responsive design." },
]

export function Features() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map(({ icon: Icon, title, desc }) => (
        <Card key={title} className="card-glass shadow-brand-lg hover:scale-[1.02] transition-transform">
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <div className="rounded-md p-2 bg-brand-strong text-white shadow-sm">
                <Icon className="size-5" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-medium">{title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{desc}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
