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
    <Card className={cn("card-glass shadow-brand-xl border-0 relative overflow-hidden", className)}>
      {/* Gradient accent bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient}`} />

      <CardHeader>
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-2xl bg-gradient-to-br ${gradient} shadow-lg`}>
            <Icon className="size-6 text-white" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-xl mb-2">{title}</CardTitle>
            <CardDescription className="text-base">{description}</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">{children}</CardContent>
    </Card>
  )
}
