"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Upload, Download, Link2, Loader2, X, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { ToolCard } from "./tool-card"
import { useFFmpegAdvanced } from "@/hooks/use-ffmpeg-advanced"
import { VideoPreview } from "@/components/video/video-preview"
import { TrimTimeline } from "@/components/video/trim-timeline"
import { toast } from "sonner"
import { Card, CardContent } from "@/components/ui/card"

interface VideoSegment {
  file: File
  trim: { start: number; end: number }
  duration: number
  videoUrl: string | null
  expanded: boolean
}

export function MergeVideosTool() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [segments, setSegments] = useState<VideoSegment[]>([])
  const [progress, setProgress] = useState(0)
  const [merging, setMerging] = useState(false)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const { loaded, loading, mergeVideoSegments } = useFFmpegAdvanced()

  const getVideoDuration = (videoUrl: string): Promise<number> => {
    return new Promise((resolve) => {
      const video = document.createElement("video")
      video.src = videoUrl
      video.onloadedmetadata = () => {
        resolve(video.duration)
      }
    })
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    const newSegments = await Promise.all(
      files.map(async (file) => {
        const videoUrl = URL.createObjectURL(file)
        const duration = await getVideoDuration(videoUrl)
        return {
          file,
          trim: { start: 0, end: duration },
          duration,
          videoUrl,
          expanded: false,
        }
      })
    )

    setSegments([...segments, ...newSegments])
    setProgress(0)
    setMerging(false)

    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl)
      setDownloadUrl(null)
    }
  }

  const handleRemoveSegment = (index: number) => {
    const segment = segments[index]
    if (segment.videoUrl) {
      URL.revokeObjectURL(segment.videoUrl)
    }
    setSegments(segments.filter((_, i) => i !== index))
  }

  const handleToggleExpand = (index: number) => {
    setSegments(
      segments.map((seg, i) =>
        i === index ? { ...seg, expanded: !seg.expanded } : seg
      )
    )
  }

  const handleTrimChange = (index: number, trim: { start: number; end: number }) => {
    setSegments(
      segments.map((seg, i) => (i === index ? { ...seg, trim } : seg))
    )
  }

  const handleQuickTrim = (index: number, preset: "full" | "first30" | "last30") => {
    const segment = segments[index]
    let newTrim = { start: 0, end: segment.duration }

    switch (preset) {
      case "full":
        newTrim = { start: 0, end: segment.duration }
        break
      case "first30":
        newTrim = { start: 0, end: Math.min(30, segment.duration) }
        break
      case "last30":
        newTrim = {
          start: Math.max(0, segment.duration - 30),
          end: segment.duration,
        }
        break
    }

    handleTrimChange(index, newTrim)
  }

  const handleMerge = async () => {
    if (segments.length < 2 || !loaded) {
      toast.error("Please add at least 2 videos and wait for the converter to load")
      return
    }

    setMerging(true)
    setProgress(0)

    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl)
      setDownloadUrl(null)
    }

    try {
      const segmentsData = segments.map((seg) => ({
        file: seg.file,
        trim: seg.trim,
      }))

      const blob = await mergeVideoSegments(
        segmentsData,
        "mp4",
        (p) => setProgress(p)
      )

      const url = URL.createObjectURL(blob)
      setDownloadUrl(url)
      toast.success("Videos merged successfully!")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Merge failed")
      setProgress(0)
    } finally {
      setMerging(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const totalDuration = segments.reduce(
    (acc, seg) => acc + (seg.trim.end - seg.trim.start),
    0
  )

  return (
    <ToolCard
      icon={Link2}
      title="Merge Videos"
      description="Combine multiple videos into one, with optional trimming"
      gradient="from-purple-500 to-pink-500"
    >
      <div className="space-y-6">
        {/* Upload Area */}
        <div>
          <input
            ref={inputRef}
            type="file"
            accept="video/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button
            onClick={() => inputRef.current?.click()}
            variant="outline"
            className="w-full h-32 border-2 border-dashed hover:border-purple-500 hover:bg-purple-500/5"
          >
            <div className="flex flex-col items-center gap-2">
              <Upload className="size-8 text-muted-foreground" />
              <span className="font-medium">Add videos to merge</span>
              <span className="text-xs text-muted-foreground">
                {segments.length > 0
                  ? `${segments.length} video${segments.length > 1 ? "s" : ""} added`
                  : "Select multiple videos"}
              </span>
            </div>
          </Button>
        </div>

        {/* Video Segments List */}
        {segments.length > 0 && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-sm">
                Videos ({segments.length}) - Total: {formatTime(totalDuration)}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  segments.forEach((seg) => {
                    if (seg.videoUrl) URL.revokeObjectURL(seg.videoUrl)
                  })
                  setSegments([])
                }}
              >
                Clear All
              </Button>
            </div>

            {segments.map((segment, index) => (
              <Card
                key={index}
                className="card-glass border-0 shadow-lg"
              >
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* Segment Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white text-sm font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {segment.file.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatTime(segment.trim.start)} - {formatTime(segment.trim.end)} ({formatTime(segment.trim.end - segment.trim.start)})
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleExpand(index)}
                        >
                          {segment.expanded ? (
                            <ChevronUp className="size-4" />
                          ) : (
                            <ChevronDown className="size-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveSegment(index)}
                        >
                          <X className="size-4 text-destructive" />
                        </Button>
                      </div>
                    </div>

                    {/* Expanded Content */}
                    {segment.expanded && segment.videoUrl && (
                      <div className="space-y-3 pt-3 border-t border-border/50">
                        <VideoPreview
                          file={segment.file}
                          trim={segment.trim}
                          className="mb-2"
                        />

                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleQuickTrim(index, "full")}
                              className="flex-1 text-xs"
                            >
                              Use Full Video
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleQuickTrim(index, "first30")}
                              className="flex-1 text-xs"
                            >
                              First 30s
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleQuickTrim(index, "last30")}
                              className="flex-1 text-xs"
                            >
                              Last 30s
                            </Button>
                          </div>

                          <TrimTimeline
                            duration={segment.duration}
                            trimRange={segment.trim}
                            onTrimChange={(trim) => handleTrimChange(index, trim)}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Progress */}
        {progress > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span className="text-brand-gradient font-semibold">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {/* Action Buttons */}
        {segments.length > 0 && (
          <div className="flex gap-3">
            <Button
              onClick={handleMerge}
              disabled={merging || !loaded || segments.length < 2}
              className="flex-1 btn-gradient hover-glow h-12"
            >
              {merging ? (
                <>
                  <Loader2 className="size-5 animate-spin mr-2" />
                  Merging...
                </>
              ) : (
                <>
                  <Link2 className="size-5 mr-2" />
                  Merge All Videos
                </>
              )}
            </Button>

            {downloadUrl && !merging && (
              <Button
                asChild
                variant="outline"
                className="flex-1 border-2 border-purple-500 hover:bg-purple-500/10 h-12"
              >
                <a href={downloadUrl} download="merged_video.mp4">
                  <Download className="size-5 mr-2" />
                  Download
                </a>
              </Button>
            )}
          </div>
        )}

        {loading && (
          <div className="text-center text-sm text-muted-foreground py-4">
            <Loader2 className="size-5 animate-spin mx-auto mb-2" />
            Loading converter...
          </div>
        )}
      </div>
    </ToolCard>
  )
}
