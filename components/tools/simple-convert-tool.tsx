"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Upload, Download, RefreshCcw, Loader2, FileVideo } from "lucide-react"
import { cn } from "@/lib/utils"
import { ToolCard } from "./tool-card"
import { useFFmpegAdvanced } from "@/hooks/use-ffmpeg-advanced"
import { toast } from "sonner"
import type { ConversionOptions } from "@/lib/types"

const ALL_FORMATS = ["mp4", "mov", "avi", "mkv", "webm", "mp3", "wav", "aac"] as const

export function SimpleConvertTool() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [outputFormat, setOutputFormat] = useState<string>("mp4")
  const [progress, setProgress] = useState(0)
  const [converting, setConverting] = useState(false)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const { loaded, loading, convertVideo } = useFFmpegAdvanced()

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setProgress(0)
      setConverting(false)
      if (downloadUrl) {
        URL.revokeObjectURL(downloadUrl)
        setDownloadUrl(null)
      }
    }
  }

  const handleConvert = async () => {
    if (!file || !loaded) {
      toast.error("Please select a file and wait for the converter to load")
      return
    }

    setConverting(true)
    setProgress(0)

    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl)
      setDownloadUrl(null)
    }

    try {
      const options: ConversionOptions = {
        outputFormat,
        quality: "high",
        videoCodec: "h264",
        audioCodec: "aac",
      }

      const blob = await convertVideo(file, options, (p) => setProgress(p))
      const url = URL.createObjectURL(blob)
      setDownloadUrl(url)
      toast.success("Conversion completed!")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Conversion failed")
      setProgress(0)
    } finally {
      setConverting(false)
    }
  }

  return (
    <ToolCard
      icon={RefreshCcw}
      title="Simple Convert"
      description="Quick format conversion without complex settings"
      gradient="from-blue-500 to-cyan-500"
    >
      <div className="space-y-6">
        {/* Upload Area */}
        <div>
          <input
            ref={inputRef}
            type="file"
            accept="video/*,audio/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button
            onClick={() => inputRef.current?.click()}
            variant="outline"
            className="w-full h-32 border-2 border-dashed hover:border-brand-strong-start hover:bg-brand-strong-start/5"
          >
            <div className="flex flex-col items-center gap-2">
              <Upload className="size-8 text-muted-foreground" />
              <span className="font-medium">
                {file ? file.name : "Choose a video or audio file"}
              </span>
              {file && (
                <span className="text-xs text-muted-foreground">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </span>
              )}
            </div>
          </Button>
        </div>

        {/* Format Selection */}
        {file && (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium">Convert to:</label>
              <Select value={outputFormat} onValueChange={setOutputFormat}>
                <SelectTrigger className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mp4">MP4 (Video)</SelectItem>
                  <SelectItem value="mov">MOV (Video)</SelectItem>
                  <SelectItem value="avi">AVI (Video)</SelectItem>
                  <SelectItem value="mkv">MKV (Video)</SelectItem>
                  <SelectItem value="webm">WebM (Video)</SelectItem>
                  <SelectItem value="mp3">MP3 (Audio)</SelectItem>
                  <SelectItem value="wav">WAV (Audio)</SelectItem>
                  <SelectItem value="aac">AAC (Audio)</SelectItem>
                </SelectContent>
              </Select>
            </div>

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
                onClick={handleConvert}
                disabled={converting || !loaded}
                className="flex-1 btn-gradient hover-glow h-12"
              >
                {converting ? (
                  <>
                    <Loader2 className="size-5 animate-spin mr-2" />
                    Converting...
                  </>
                ) : (
                  <>
                    <RefreshCcw className="size-5 mr-2" />
                    Convert Now
                  </>
                )}
              </Button>

              {downloadUrl && !converting && (
                <Button
                  asChild
                  variant="outline"
                  className="flex-1 border-2 border-green-500 hover:bg-green-500/10 h-12"
                >
                  <a
                    href={downloadUrl}
                    download={`${file.name.split(".")[0]}.${outputFormat}`}
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
