"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { RotateCw, FlipHorizontal, FlipVertical, Gauge } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import type { ConversionOptions } from "@/lib/types"
import { cn } from "@/lib/utils"

interface EditingToolsProps {
  options: ConversionOptions
  onChange: (options: Partial<ConversionOptions>) => void
}

export function EditingTools({ options, onChange }: EditingToolsProps) {
  const rotationAngles = [
    { value: 0, label: "0°", icon: "↑" },
    { value: 90, label: "90°", icon: "→" },
    { value: 180, label: "180°", icon: "↓" },
    { value: 270, label: "270°", icon: "←" },
  ]

  const speedPresets = [
    { value: 0.25, label: "0.25x", desc: "1/4 Speed" },
    { value: 0.5, label: "0.5x", desc: "Half Speed" },
    { value: 0.75, label: "0.75x", desc: "3/4 Speed" },
    { value: 1, label: "1x", desc: "Normal" },
    { value: 1.25, label: "1.25x", desc: "Fast" },
    { value: 1.5, label: "1.5x", desc: "Faster" },
    { value: 2, label: "2x", desc: "Double Speed" },
    { value: 3, label: "3x", desc: "Triple Speed" },
    { value: 4, label: "4x", desc: "4x Speed" },
  ]

  return (
    <Card className="card-glass border-0">
      <CardContent className="p-6 space-y-6">
        <div className="flex items-center gap-2">
          <svg className="size-5 text-brand-strong-start" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <h3 className="font-semibold text-lg">Video Editing</h3>
        </div>

        {/* Rotation */}
        <div className="space-y-3">
          <Label className="text-sm font-medium flex items-center gap-2">
            <RotateCw className="size-4" />
            Rotate
          </Label>
          <div className="grid grid-cols-4 gap-2">
            {rotationAngles.map((angle) => (
              <Button
                key={angle.value}
                variant={options.rotate === angle.value ? "default" : "outline"}
                className={cn(
                  "flex flex-col gap-1 h-auto py-3",
                  options.rotate === angle.value &&
                    "bg-gradient-to-br from-brand-strong-start to-brand-strong-end border-0"
                )}
                onClick={() => onChange({ rotate: angle.value as any })}
              >
                <span className="text-xl">{angle.icon}</span>
                <span className="text-xs">{angle.label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Flip */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Flip</Label>
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant={!options.flip ? "default" : "outline"}
              className={cn(
                !options.flip && "bg-gradient-to-br from-brand-strong-start to-brand-strong-end border-0"
              )}
              onClick={() => onChange({ flip: null })}
            >
              None
            </Button>
            <Button
              variant={options.flip === "horizontal" ? "default" : "outline"}
              className={cn(
                "flex items-center gap-2",
                options.flip === "horizontal" &&
                  "bg-gradient-to-br from-brand-strong-start to-brand-strong-end border-0"
              )}
              onClick={() => onChange({ flip: "horizontal" })}
            >
              <FlipHorizontal className="size-4" />
              Horizontal
            </Button>
            <Button
              variant={options.flip === "vertical" ? "default" : "outline"}
              className={cn(
                "flex items-center gap-2",
                options.flip === "vertical" &&
                  "bg-gradient-to-br from-brand-strong-start to-brand-strong-end border-0"
              )}
              onClick={() => onChange({ flip: "vertical" })}
            >
              <FlipVertical className="size-4" />
              Vertical
            </Button>
          </div>
        </div>

        {/* Speed Control */}
        <div className="space-y-3">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Gauge className="size-4" />
            Playback Speed: {options.speed || 1}x
          </Label>

          {/* Speed Slider */}
          <Slider
            value={[options.speed || 1]}
            min={0.25}
            max={4}
            step={0.25}
            onValueChange={(v) => onChange({ speed: v[0] })}
            className="cursor-pointer"
          />

          {/* Speed Presets */}
          <div className="grid grid-cols-5 gap-2">
            {speedPresets.map((preset) => (
              <Button
                key={preset.value}
                variant="outline"
                size="sm"
                className={cn(
                  "flex flex-col gap-0.5 h-auto py-2 text-xs",
                  options.speed === preset.value &&
                    "bg-gradient-to-br from-brand-strong-start/10 to-brand-strong-end/10 border-brand-strong-start"
                )}
                onClick={() => onChange({ speed: preset.value })}
              >
                <span className="font-semibold">{preset.label}</span>
                <span className="text-[10px] text-muted-foreground">{preset.desc}</span>
              </Button>
            ))}
          </div>

          <div className="bg-muted/30 rounded-lg p-3 text-xs text-muted-foreground">
            <p>
              <strong>Slow Motion:</strong> &lt; 1x | <strong>Normal:</strong> 1x |{" "}
              <strong>Fast Forward:</strong> &gt; 1x
            </p>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg p-4 border border-brand-strong-start/20">
          <p className="text-sm font-medium mb-2">✨ Editing Features</p>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• <strong>Rotate:</strong> Change video orientation</li>
            <li>• <strong>Flip:</strong> Mirror horizontally or vertically</li>
            <li>• <strong>Speed:</strong> Create slow-motion or time-lapse effects</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
