"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Upload, Trash2, MoveUp, MoveDown, Link2, ChevronDown, Scissors, Play } from "lucide-react"
import { cn } from "@/lib/utils"

export interface VideoSegment {
  file: File
  trim: { start: number; end: number }
  duration: number
  videoUrl: string | null
}

interface MergeVideosAdvancedProps {
  segments: VideoSegment[]
  onSegmentsChange: (segments: VideoSegment[]) => void
}

export function MergeVideosAdvanced({ segments, onSegmentsChange }: MergeVideosAdvancedProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || [])

    const newSegments = await Promise.all(
      newFiles.map(async (file) => {
        const videoUrl = URL.createObjectURL(file)
        const duration = await getVideoDuration(videoUrl)

        return {
          file,
          trim: { start: 0, end: duration },
          duration,
          videoUrl,
        }
      })
    )

    onSegmentsChange([...segments, ...newSegments])
  }

  const getVideoDuration = (url: string): Promise<number> => {
    return new Promise((resolve) => {
      const video = document.createElement("video")
      video.preload = "metadata"
      video.onloadedmetadata = () => {
        resolve(video.duration)
      }
      video.onerror = () => {
        resolve(0)
      }
      video.src = url
    })
  }

  const removeSegment = (index: number) => {
    const segment = segments[index]
    if (segment.videoUrl) {
      URL.revokeObjectURL(segment.videoUrl)
    }
    const newSegments = segments.filter((_, i) => i !== index)
    onSegmentsChange(newSegments)
  }

  const moveUp = (index: number) => {
    if (index === 0) return
    const newSegments = [...segments]
    ;[newSegments[index - 1], newSegments[index]] = [newSegments[index], newSegments[index - 1]]
    onSegmentsChange(newSegments)
  }

  const moveDown = (index: number) => {
    if (index === segments.length - 1) return
    const newSegments = [...segments]
    ;[newSegments[index], newSegments[index + 1]] = [newSegments[index + 1], newSegments[index]]
    onSegmentsChange(newSegments)
  }

  const updateTrim = (index: number, trim: { start: number; end: number }) => {
    const newSegments = [...segments]
    newSegments[index].trim = trim
    onSegmentsChange(newSegments)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const totalDuration = segments.reduce((acc, seg) => {
    return acc + (seg.trim.end - seg.trim.start)
  }, 0)

  // Cleanup URLs on unmount
  useEffect(() => {
    return () => {
      segments.forEach((seg) => {
        if (seg.videoUrl) {
          URL.revokeObjectURL(seg.videoUrl)
        }
      })
    }
  }, [])

  return (
    <Card className="card-glass border-0">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link2 className="size-5 text-brand-strong-start" />
            <h3 className="font-semibold text-lg">Merge Video Segments</h3>
          </div>
          <Button variant="outline" size="sm" asChild>
            <label className="cursor-pointer">
              <Upload className="size-4 mr-2" />
              Add Videos
              <input
                type="file"
                multiple
                accept="video/*"
                className="sr-only"
                onChange={handleFileSelect}
              />
            </label>
          </Button>
        </div>

        {segments.length === 0 ? (
          <div className="border-2 border-dashed border-border/50 rounded-xl p-8 text-center">
            <Link2 className="size-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground mb-2">
              No videos added yet. Click "Add Videos" to start.
            </p>
            <p className="text-xs text-muted-foreground">
              You can trim each video individually before merging!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {segments.map((segment, index) => (
              <Card
                key={index}
                className={cn(
                  "border-2 transition-all duration-200",
                  expandedIndex === index
                    ? "border-brand-strong-start bg-gradient-to-br from-brand-strong-start/5 to-brand-strong-end/5"
                    : "border-border/50"
                )}
              >
                <Collapsible open={expandedIndex === index} onOpenChange={(open) => setExpandedIndex(open ? index : null)}>
                  <CollapsibleTrigger asChild>
                    <div className="group flex items-center gap-3 p-4 cursor-pointer hover:bg-muted/30 transition-colors">
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-brand-strong-start to-brand-strong-end text-white font-bold">
                        {index + 1}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{segment.file.name}</p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                          <span>{(segment.file.size / (1024 * 1024)).toFixed(2)} MB</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Scissors className="size-3" />
                            {formatTime(segment.trim.start)} → {formatTime(segment.trim.end)}
                          </span>
                          <span>•</span>
                          <span className="text-brand-gradient font-medium">
                            {formatTime(segment.trim.end - segment.trim.start)} clip
                          </span>
                        </div>
                      </div>

                      <ChevronDown
                        className={cn(
                          "size-5 text-muted-foreground transition-transform",
                          expandedIndex === index && "rotate-180"
                        )}
                      />

                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            moveUp(index)
                          }}
                          disabled={index === 0}
                          className="h-8 w-8 p-0"
                        >
                          <MoveUp className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            moveDown(index)
                          }}
                          disabled={index === segments.length - 1}
                          className="h-8 w-8 p-0"
                        >
                          <MoveDown className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            removeSegment(index)
                          }}
                          className="h-8 w-8 p-0 hover:text-destructive"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </div>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <div className="px-4 pb-4 pt-2 space-y-4 border-t border-border/50">
                      {/* Video Preview */}
                      {segment.videoUrl && (
                        <div className="relative rounded-lg overflow-hidden bg-black">
                          <video
                            src={segment.videoUrl}
                            className="w-full aspect-video object-contain"
                            controls
                          />
                        </div>
                      )}

                      {/* Trim Controls */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Scissors className="size-4 text-brand-strong-start" />
                          <span className="text-sm font-medium">Trim This Segment</span>
                        </div>

                        {/* Range Slider */}
                        <div className="space-y-2">
                          <Slider
                            value={[segment.trim.start, segment.trim.end]}
                            min={0}
                            max={segment.duration}
                            step={0.1}
                            minStepsBetweenThumbs={1}
                            onValueChange={(values) => {
                              updateTrim(index, { start: values[0], end: values[1] })
                            }}
                            className="cursor-pointer"
                          />

                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{formatTime(segment.trim.start)}</span>
                            <span className="text-brand-gradient font-semibold">
                              Selected: {formatTime(segment.trim.end - segment.trim.start)}
                            </span>
                            <span>{formatTime(segment.trim.end)}</span>
                          </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateTrim(index, { start: 0, end: segment.duration })}
                            className="text-xs"
                          >
                            Use Full Video
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              updateTrim(index, {
                                start: 0,
                                end: Math.min(30, segment.duration),
                              })
                            }
                            className="text-xs"
                          >
                            First 30s
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              updateTrim(index, {
                                start: Math.max(0, segment.duration - 30),
                                end: segment.duration,
                              })
                            }
                            className="text-xs"
                          >
                            Last 30s
                          </Button>
                        </div>

                        <div className="bg-muted/30 rounded-lg p-3 text-xs text-muted-foreground">
                          <p>
                            💡 <strong>Tip:</strong> Drag the slider handles to select exactly which part of this
                            video you want to include in the final merged video.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            ))}
          </div>
        )}

        {segments.length > 0 && (
          <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg p-4 border border-brand-strong-start/20">
            <p className="text-sm font-medium mb-2">📊 Merge Summary</p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Total segments: {segments.length}</li>
              <li>
                • Original size:{" "}
                {(segments.reduce((acc, s) => acc + s.file.size, 0) / (1024 * 1024)).toFixed(2)} MB
              </li>
              <li>• Final duration: ~{formatTime(totalDuration)}</li>
              <li>• Segments will be merged in the order shown</li>
              <li>• Only selected portions will be included</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
