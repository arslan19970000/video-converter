"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Upload, Download, Scissors, Loader2 } from "lucide-react"
import { ToolCard } from "./tool-card"
import { useFFmpegAdvanced } from "@/hooks/use-ffmpeg-advanced"
import { VideoPreview } from "@/components/video/video-preview"
import { TrimTimeline } from "@/components/video/trim-timeline"
import { toast } from "sonner"
import type { ConversionOptions } from "@/lib/types"

export function TrimVideoTool() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [duration, setDuration] = useState(0)
  const [trimRange, setTrimRange] = useState<{ start: number; end: number }>({ start: 0, end: 0 })
  const [progress, setProgress] = useState(0)
  const [trimming, setTrimming] = useState(false)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const { loaded, loading, convertVideo } = useFFmpegAdvanced()

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setProgress(0)
      setTrimming(false)
      if (downloadUrl) {
        URL.revokeObjectURL(downloadUrl)
        setDownloadUrl(null)
      }
    }
  }

  const handleDurationLoad = (dur: number) => {
    setDuration(dur)
    setTrimRange({ start: 0, end: dur })
  }

  const handleTrim = async () => {
    if (!file || !loaded) {
      toast.error("Please select a file and wait for the converter to load")
      return
    }

    setTrimming(true)
    setProgress(0)

    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl)
      setDownloadUrl(null)
    }

    try {
      const fileExt = file.name.split(".").pop() || "mp4"
      const options: ConversionOptions = {
        outputFormat: fileExt,
        trim: trimRange,
        quality: "high",
        videoCodec: "h264",
        audioCodec: "aac",
      }

      const blob = await convertVideo(file, options, (p) => setProgress(p))
      const url = URL.createObjectURL(blob)
      setDownloadUrl(url)
      toast.success("Video trimmed successfully!")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Trimming failed")
      setProgress(0)
    } finally {
      setTrimming(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <ToolCard
      icon={Scissors}
      title="Trim Video"
      description="Cut your video to the exact length you need"
      gradient="from-green-500 to-emerald-500"
    >
      <div className="space-y-6">
        {/* Upload Area */}
        <div>
          <input
            ref={inputRef}
            type="file"
            accept="video/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button
            onClick={() => inputRef.current?.click()}
            variant="outline"
            className="w-full h-32 border-2 border-dashed hover:border-green-500 hover:bg-green-500/5"
          >
            <div className="flex flex-col items-center gap-2">
              <Upload className="size-8 text-muted-foreground" />
              <span className="font-medium">
                {file ? file.name : "Choose a video file"}
              </span>
              {file && (
                <span className="text-xs text-muted-foreground">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </span>
              )}
            </div>
          </Button>
        </div>

        {/* Video Preview & Trim Controls */}
        {file && (
          <>
            <VideoPreview
              file={file}
              onDurationLoad={handleDurationLoad}
              trim={trimRange}
            />

            {duration > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Trim Range</span>
                  <span className="text-muted-foreground">
                    {formatTime(trimRange.start)} - {formatTime(trimRange.end)}
                  </span>
                </div>
                <TrimTimeline
                  duration={duration}
                  trimRange={trimRange}
                  onTrimChange={setTrimRange}
                />
                <p className="text-xs text-muted-foreground">
                  Output duration: {formatTime(trimRange.end - trimRange.start)}
                </p>
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
            <div className="flex gap-3">
              <Button
                onClick={handleTrim}
                disabled={trimming || !loaded || duration === 0}
                className="flex-1 btn-gradient hover-glow h-12"
              >
                {trimming ? (
                  <>
                    <Loader2 className="size-5 animate-spin mr-2" />
                    Trimming...
                  </>
                ) : (
                  <>
                    <Scissors className="size-5 mr-2" />
                    Trim Video
                  </>
                )}
              </Button>

              {downloadUrl && !trimming && (
                <Button
                  asChild
                  variant="outline"
                  className="flex-1 border-2 border-green-500 hover:bg-green-500/10 h-12"
                >
                  <a
                    href={downloadUrl}
                    download={`${file.name.split(".")[0]}_trimmed.${file.name.split(".").pop()}`}
                  >
                    <Download className="size-5 mr-2" />
                    Download
                  </a>
                </Button>
              )}
            </div>
          </>
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
