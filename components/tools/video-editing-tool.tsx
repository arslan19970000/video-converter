"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, Download, Wand2, Loader2, RotateCw, FlipHorizontal, FlipVertical, Gauge } from "lucide-react"
import { ToolCard } from "./tool-card"
import { useFFmpegAdvanced } from "@/hooks/use-ffmpeg-advanced"
import { VideoPreview } from "@/components/video/video-preview"
import { toast } from "sonner"
import type { ConversionOptions } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"

export function VideoEditingTool() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [rotate, setRotate] = useState<0 | 90 | 180 | 270>(0)
  const [flip, setFlip] = useState<"horizontal" | "vertical" | "both" | null>(null)
  const [speed, setSpeed] = useState<number>(1)
  const [progress, setProgress] = useState(0)
  const [processing, setProcessing] = useState(false)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const { loaded, loading, convertVideo } = useFFmpegAdvanced()

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setProgress(0)
      setProcessing(false)
      setRotate(0)
      setFlip(null)
      setSpeed(1)
      if (downloadUrl) {
        URL.revokeObjectURL(downloadUrl)
        setDownloadUrl(null)
      }
    }
  }

  const handleRotate = () => {
    setRotate((prev) => ((prev + 90) % 360) as 0 | 90 | 180 | 270)
  }

  const handleFlipHorizontal = () => {
    setFlip((prev) => {
      if (prev === "horizontal") return null
      if (prev === "vertical") return "both"
      if (prev === "both") return "vertical"
      return "horizontal"
    })
  }

  const handleFlipVertical = () => {
    setFlip((prev) => {
      if (prev === "vertical") return null
      if (prev === "horizontal") return "both"
      if (prev === "both") return "horizontal"
      return "vertical"
    })
  }

  const handleApplyEdits = async () => {
    if (!file || !loaded) {
      toast.error("Please select a file and wait for the converter to load")
      return
    }

    if (rotate === 0 && !flip && speed === 1) {
      toast.error("No edits applied. Please rotate, flip, or change speed.")
      return
    }

    setProcessing(true)
    setProgress(0)

    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl)
      setDownloadUrl(null)
    }

    try {
      const fileExt = file.name.split(".").pop() || "mp4"
      const options: ConversionOptions = {
        outputFormat: fileExt,
        rotate: rotate,
        flip: flip,
        speed: speed,
        quality: "high",
        videoCodec: "h264",
        audioCodec: "aac",
      }

      const blob = await convertVideo(file, options, (p) => setProgress(p))
      const url = URL.createObjectURL(blob)
      setDownloadUrl(url)
      toast.success("Video edited successfully!")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Editing failed")
      setProgress(0)
    } finally {
      setProcessing(false)
    }
  }

  const hasEdits = rotate !== 0 || flip !== null || speed !== 1

  return (
    <ToolCard
      icon={Wand2}
      title="Edit Video"
      description="Rotate, flip, or change playback speed of your video"
      gradient="from-orange-500 to-red-500"
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
            className="w-full h-32 border-2 border-dashed hover:border-orange-500 hover:bg-orange-500/5"
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

        {/* Video Preview */}
        {file && (
          <>
            <VideoPreview
              file={file}
              rotate={rotate}
              flip={flip}
              speed={speed}
            />

            {/* Editing Controls */}
            <Card className="card-glass border-0 shadow-lg">
              <CardContent className="p-4 space-y-4">
                <h3 className="font-medium text-sm">Editing Options</h3>

                {/* Rotation */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <RotateCw className="size-4" />
                    Rotation
                  </label>
                  <div className="flex gap-2">
                    <Button
                      variant={rotate === 0 ? "default" : "outline"}
                      size="sm"
                      onClick={() => setRotate(0)}
                      className="flex-1"
                    >
                      0°
                    </Button>
                    <Button
                      variant={rotate === 90 ? "default" : "outline"}
                      size="sm"
                      onClick={() => setRotate(90)}
                      className="flex-1"
                    >
                      90°
                    </Button>
                    <Button
                      variant={rotate === 180 ? "default" : "outline"}
                      size="sm"
                      onClick={() => setRotate(180)}
                      className="flex-1"
                    >
                      180°
                    </Button>
                    <Button
                      variant={rotate === 270 ? "default" : "outline"}
                      size="sm"
                      onClick={() => setRotate(270)}
                      className="flex-1"
                    >
                      270°
                    </Button>
                  </div>
                </div>

                {/* Flip */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Flip</label>
                  <div className="flex gap-2">
                    <Button
                      variant={flip === "horizontal" || flip === "both" ? "default" : "outline"}
                      size="sm"
                      onClick={handleFlipHorizontal}
                      className="flex-1"
                    >
                      <FlipHorizontal className="size-4 mr-2" />
                      Horizontal
                    </Button>
                    <Button
                      variant={flip === "vertical" || flip === "both" ? "default" : "outline"}
                      size="sm"
                      onClick={handleFlipVertical}
                      className="flex-1"
                    >
                      <FlipVertical className="size-4 mr-2" />
                      Vertical
                    </Button>
                  </div>
                </div>

                {/* Speed */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Gauge className="size-4" />
                    Playback Speed
                  </label>
                  <Select
                    value={speed.toString()}
                    onValueChange={(val) => setSpeed(parseFloat(val))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0.25">0.25x (Slow Motion)</SelectItem>
                      <SelectItem value="0.5">0.5x (Half Speed)</SelectItem>
                      <SelectItem value="0.75">0.75x</SelectItem>
                      <SelectItem value="1">1x (Normal)</SelectItem>
                      <SelectItem value="1.25">1.25x</SelectItem>
                      <SelectItem value="1.5">1.5x (Fast)</SelectItem>
                      <SelectItem value="2">2x (Double Speed)</SelectItem>
                      <SelectItem value="3">3x (Triple Speed)</SelectItem>
                      <SelectItem value="4">4x (Very Fast)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Current Settings Summary */}
                {hasEdits && (
                  <div className="pt-3 border-t border-border/50">
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium">Applied edits:</span>{" "}
                      {rotate !== 0 && `Rotate ${rotate}°`}
                      {rotate !== 0 && (flip || speed !== 1) && ", "}
                      {flip && `Flip ${flip}`}
                      {flip && speed !== 1 && ", "}
                      {speed !== 1 && `Speed ${speed}x`}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

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
                onClick={handleApplyEdits}
                disabled={processing || !loaded || !hasEdits}
                className="flex-1 btn-gradient hover-glow h-12"
              >
                {processing ? (
                  <>
                    <Loader2 className="size-5 animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Wand2 className="size-5 mr-2" />
                    Apply Edits
                  </>
                )}
              </Button>

              {downloadUrl && !processing && (
                <Button
                  asChild
                  variant="outline"
                  className="flex-1 border-2 border-orange-500 hover:bg-orange-500/10 h-12"
                >
                  <a
                    href={downloadUrl}
                    download={`${file.name.split(".")[0]}_edited.${file.name.split(".").pop()}`}
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
