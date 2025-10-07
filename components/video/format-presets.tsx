"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles } from "lucide-react"
import { FORMAT_PRESETS, type FormatPreset } from "@/lib/types"
import { cn } from "@/lib/utils"

interface FormatPresetsProps {
  selectedPreset?: string
  onSelect: (preset: FormatPreset) => void
}

export function FormatPresets({ selectedPreset, onSelect }: FormatPresetsProps) {
  const categories = {
    social: "Social Media",
    device: "Devices",
    web: "Web",
  }

  const presetsByCategory = FORMAT_PRESETS.reduce(
    (acc, preset) => {
      if (!acc[preset.category]) {
        acc[preset.category] = []
      }
      acc[preset.category].push(preset)
      return acc
    },
    {} as Record<string, FormatPreset[]>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Sparkles className="size-5 text-brand-strong-start" />
        <h3 className="font-semibold text-lg">Quick Presets</h3>
      </div>

      {Object.entries(presetsByCategory).map(([category, presets]) => (
        <div key={category} className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            {categories[category as keyof typeof categories]}
          </h4>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {presets.map((preset) => (
              <Card
                key={preset.id}
                className={cn(
                  "cursor-pointer transition-all duration-200 hover:scale-105 border-2",
                  selectedPreset === preset.id
                    ? "border-brand-strong-start bg-gradient-to-br from-brand-strong-start/10 to-brand-strong-end/10 shadow-brand-lg"
                    : "border-border/50 hover:border-brand-strong-start/50 card-glass"
                )}
                onClick={() => onSelect(preset)}
              >
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <span className="text-2xl">{preset.icon}</span>
                      {selectedPreset === preset.id && (
                        <Badge className="bg-gradient-to-r from-brand-strong-start to-brand-strong-end text-white border-0">
                          Active
                        </Badge>
                      )}
                    </div>

                    <div>
                      <h5 className="font-semibold text-sm">{preset.name}</h5>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {preset.description}
                      </p>
                    </div>

                    {/* Preset Details */}
                    <div className="flex flex-wrap gap-1">
                      {preset.options.resolution && (
                        <Badge variant="outline" className="text-xs">
                          {preset.options.resolution}
                        </Badge>
                      )}
                      {preset.options.quality && (
                        <Badge variant="outline" className="text-xs">
                          {preset.options.quality}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
