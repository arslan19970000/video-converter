"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface ToolCardProps {
  icon: LucideIcon
  title: string
  description: string
  gradient?: string
  children: React.ReactNode
  className?: string
}

export function ToolCard({
  icon: Icon,
  title,
  description,
  gradient = "from-blue-500 to-purple-500",
  children,
  className,
}: ToolCardProps) {
  return (
    <Card className={cn("group card-glass shadow-brand-xl border-0 relative overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-1", className)}>
      {/* Animated gradient background on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

      {/* Gradient accent bar - animated on hover */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient} transition-all duration-500 group-hover:h-2`} />

      {/* Decorative corner glow */}
      <div className={`absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br ${gradient} rounded-full opacity-0 blur-3xl group-hover:opacity-20 transition-opacity duration-500`} />

      <CardHeader className="relative z-10">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-2xl bg-gradient-to-br ${gradient} shadow-lg group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300`}>
            <Icon className="size-6 text-white" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-xl mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-purple-500 transition-all duration-300">
              {title}
            </CardTitle>
            <CardDescription className="text-base">{description}</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 relative z-10">{children}</CardContent>

      {/* Bottom decorative glow */}
      <div className={`absolute -bottom-24 -left-24 w-48 h-48 bg-gradient-to-br ${gradient} rounded-full opacity-0 blur-3xl group-hover:opacity-20 transition-opacity duration-500`} />
    </Card>
  )
}
