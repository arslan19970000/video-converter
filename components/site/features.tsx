import { Card, CardContent } from "@/components/ui/card"
import { ShieldCheck, Gauge, UserRoundCheck, Lock, Zap, Sparkles } from "lucide-react"

const items = [
  {
    icon: Gauge,
    title: "Lightning Fast",
    desc: "Browser-based conversion with optimized FFmpeg pipeline.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: UserRoundCheck,
    title: "No Signup Required",
    desc: "Start converting instantly without creating an account.",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: ShieldCheck,
    title: "100% Secure",
    desc: "Your files never leave your device. Complete privacy.",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: Zap,
    title: "Multiple Formats",
    desc: "Support for MP4, MOV, AVI, MKV, MP3, WAV, and AAC.",
    gradient: "from-orange-500 to-red-500",
  },
  {
    icon: Lock,
    title: "Client-Side Processing",
    desc: "All processing happens locally in your browser.",
    gradient: "from-indigo-500 to-purple-500",
  },
  {
    icon: Sparkles,
    title: "Modern Interface",
    desc: "Clean, intuitive, and responsive design for all devices.",
    gradient: "from-pink-500 to-rose-500",
  },
]

export function Features() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold">
          <span className="text-brand-gradient">Why Choose</span> VidConvert?
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Experience the most secure, fast, and user-friendly video converter built with modern web technologies.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(({ icon: Icon, title, desc, gradient }) => (
          <Card
            key={title}
            className="group card-glass shadow-brand-lg card-hover border-0 relative overflow-hidden"
          >
            {/* Gradient background on hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

            <CardContent className="p-6 relative">
              <div className="space-y-4">
                <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-br ${gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="size-6 text-white" aria-hidden="true" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg group-hover:text-brand-gradient transition-colors">
                    {title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              </div>

              {/* Decorative corner element */}
              <div className={`absolute -top-12 -right-12 w-24 h-24 bg-gradient-to-br ${gradient} rounded-full opacity-20 blur-2xl group-hover:opacity-40 transition-opacity`} />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
