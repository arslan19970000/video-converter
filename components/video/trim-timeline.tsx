"use client"

import { useState } from "react"
import { Scissors } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

interface TrimTimelineProps {
  duration: number
  trim: { start: number; end: number }
  onChange: (trim: { start: number; end: number }) => void
  onReset: () => void
}

export function TrimTimeline({ duration, trim, onChange, onReset }: TrimTimelineProps) {
  const [startTime, setStartTime] = useState(trim.start)
  const [endTime, setEndTime] = useState(trim.end)

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const parseTime = (timeStr: string): number => {
    const parts = timeStr.split(":")
    if (parts.length === 2) {
      return parseInt(parts[0]) * 60 + parseInt(parts[1])
    }
    return 0
  }

  const handleRangeChange = (values: number[]) => {
    const [start, end] = values
    setStartTime(start)
    setEndTime(end)
    onChange({ start, end })
  }

  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseTime(e.target.value)
    if (value < endTime && value >= 0) {
      setStartTime(value)
      onChange({ start: value, end: endTime })
    }
  }

  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseTime(e.target.value)
    if (value > startTime && value <= duration) {
      setEndTime(value)
      onChange({ start: startTime, end: value })
    }
  }

  const trimDuration = endTime - startTime

  return (
    <Card className="card-glass border-0">
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scissors className="size-4 text-brand-strong-start" />
            <Label className="font-semibold">Trim Video</Label>
          </div>
          <Button variant="ghost" size="sm" onClick={onReset}>
            Reset
          </Button>
        </div>

        {/* Range Slider */}
        <div className="space-y-2">
          <Slider
            value={[startTime, endTime]}
            min={0}
            max={duration}
            step={0.1}
            minStepsBetweenThumbs={1}
            onValueChange={handleRangeChange}
            className="cursor-pointer"
          />

          {/* Time Display */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{formatTime(startTime)}</span>
            <span className="text-brand-gradient font-semibold">
              Duration: {formatTime(trimDuration)}
            </span>
            <span>{formatTime(endTime)}</span>
          </div>
        </div>

        {/* Manual Time Inputs */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Start Time</Label>
            <Input
              type="text"
              value={formatTime(startTime)}
              onChange={handleStartChange}
              placeholder="0:00"
              className="h-9 text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">End Time</Label>
            <Input
              type="text"
              value={formatTime(endTime)}
              onChange={handleEndChange}
              placeholder="0:00"
              className="h-9 text-sm"
            />
          </div>
        </div>

        {/* Info */}
        <div className="text-xs text-muted-foreground bg-muted/30 rounded-lg p-3">
          <p>
            💡 <strong>Tip:</strong> Drag the slider handles to trim your video, or enter exact times above.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
