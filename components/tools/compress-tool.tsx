"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, Download, PackageOpen, Loader2 } from "lucide-react"
import { ToolCard } from "./tool-card"
import { useFFmpegAdvanced } from "@/hooks/use-ffmpeg-advanced"
import { VideoPreview } from "@/components/video/video-preview"
import { toast } from "sonner"
import type { ConversionOptions, VideoQuality, VideoResolution } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"

export function CompressTool() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [quality, setQuality] = useState<VideoQuality>("medium")
  const [resolution, setResolution] = useState<VideoResolution>("original")
  const [progress, setProgress] = useState(0)
  const [compressing, setCompressing] = useState(false)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [compressedSize, setCompressedSize] = useState<number | null>(null)
  const { loaded, loading, convertVideo } = useFFmpegAdvanced()

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setProgress(0)
      setCompressing(false)
      setCompressedSize(null)
      if (downloadUrl) {
        URL.revokeObjectURL(downloadUrl)
        setDownloadUrl(null)
      }
    }
  }

  const handleCompress = async () => {
    if (!file || !loaded) {
      toast.error("Please select a file and wait for the converter to load")
      return
    }

    setCompressing(true)
    setProgress(0)
    setCompressedSize(null)

    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl)
      setDownloadUrl(null)
    }

    try {
      const fileExt = file.name.split(".").pop() || "mp4"
      const options: ConversionOptions = {
        outputFormat: fileExt,
        quality,
        resolution,
        videoCodec: "h264",
        audioCodec: "aac",
      }

      const blob = await convertVideo(file, options, (p) => setProgress(p))
      const url = URL.createObjectURL(blob)
      setDownloadUrl(url)
      setCompressedSize(blob.size)

      const compressionRatio = ((1 - blob.size / file.size) * 100).toFixed(1)
      toast.success(`Video compressed! Size reduced by ${compressionRatio}%`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Compression failed")
      setProgress(0)
    } finally {
      setCompressing(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }

  const getQualityDescription = (q: VideoQuality) => {
    switch (q) {
      case "low":
        return "Smallest file size, lower quality"
      case "medium":
        return "Balanced size and quality"
      case "high":
        return "Good quality, larger file size"
      case "ultra":
        return "Best quality, largest file size"
      default:
        return ""
    }
  }

  return (
    <ToolCard
      icon={PackageOpen}
      title="Compress Video"
      description="Reduce video file size while maintaining quality"
      gradient="from-cyan-500 to-blue-500"
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
            className="w-full h-32 border-2 border-dashed hover:border-cyan-500 hover:bg-cyan-500/5"
          >
            <div className="flex flex-col items-center gap-2">
              <Upload className="size-8 text-muted-foreground" />
              <span className="font-medium">
                {file ? file.name : "Choose a video file"}
              </span>
              {file && (
                <span className="text-xs text-muted-foreground">
                  Original size: {formatFileSize(file.size)}
                </span>
              )}
            </div>
          </Button>
        </div>

        {/* Video Preview */}
        {file && (
          <>
            <VideoPreview file={file} />

            {/* Compression Settings */}
            <Card className="card-glass border-0 shadow-lg">
              <CardContent className="p-4 space-y-4">
                <h3 className="font-medium text-sm">Compression Settings</h3>

                {/* Quality */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Quality Level</label>
                  <Select
                    value={quality}
                    onValueChange={(val) => setQuality(val as VideoQuality)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low Quality</SelectItem>
                      <SelectItem value="medium">Medium Quality</SelectItem>
                      <SelectItem value="high">High Quality</SelectItem>
                      <SelectItem value="ultra">Ultra Quality</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    {getQualityDescription(quality)}
                  </p>
                </div>

                {/* Resolution */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Resolution</label>
                  <Select
                    value={resolution}
                    onValueChange={(val) => setResolution(val as VideoResolution)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="original">Original (No resize)</SelectItem>
                      <SelectItem value="480p">480p (SD)</SelectItem>
                      <SelectItem value="720p">720p (HD)</SelectItem>
                      <SelectItem value="1080p">1080p (Full HD)</SelectItem>
                      <SelectItem value="1440p">1440p (2K)</SelectItem>
                      <SelectItem value="4k">4K (Ultra HD)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Lower resolution = smaller file size
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Size Comparison */}
            {compressedSize && (
              <Card className="card-glass border-0 shadow-lg bg-gradient-to-br from-cyan-500/10 to-blue-500/10">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <h3 className="font-medium text-sm">File Size Comparison</h3>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-xs text-muted-foreground">Original</p>
                        <p className="font-semibold">{formatFileSize(file.size)}</p>
                      </div>
                      <div className="text-2xl">→</div>
                      <div>
                        <p className="text-xs text-muted-foreground">Compressed</p>
                        <p className="font-semibold text-cyan-600 dark:text-cyan-400">
                          {formatFileSize(compressedSize)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Saved</p>
                        <p className="font-semibold text-green-600 dark:text-green-400">
                          {((1 - compressedSize / file.size) * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
                onClick={handleCompress}
                disabled={compressing || !loaded}
                className="flex-1 btn-gradient hover-glow h-12"
              >
                {compressing ? (
                  <>
                    <Loader2 className="size-5 animate-spin mr-2" />
                    Compressing...
                  </>
                ) : (
                  <>
                    <PackageOpen className="size-5 mr-2" />
                    Compress Video
                  </>
                )}
              </Button>

              {downloadUrl && !compressing && (
                <Button
                  asChild
                  variant="outline"
                  className="flex-1 border-2 border-cyan-500 hover:bg-cyan-500/10 h-12"
                >
                  <a
                    href={downloadUrl}
                    download={`${file.name.split(".")[0]}_compressed.${file.name.split(".").pop()}`}
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
