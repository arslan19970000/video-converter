"use client"

import type React from "react"

import { useCallback, useMemo, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, Download, FileVideo, RefreshCcw, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useFFmpeg } from "@/hooks/use-ffmpeg"
import { toast } from "sonner"

const VIDEO_FORMATS = ["mp4", "mov", "avi", "mkv"] as const
const AUDIO_FORMATS = ["mp3", "wav", "aac"] as const
const ALL_FORMATS = [...VIDEO_FORMATS, ...AUDIO_FORMATS] as const

export function UploadPanel() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [toFormat, setToFormat] = useState<string>("mp3")
  const [progress, setProgress] = useState(0)
  const [converting, setConverting] = useState(false)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const { loaded, loading, error, convertVideo } = useFFmpeg()

  const fromFormat = useMemo(() => {
    if (!file) return "auto"
    const ext = file.name.split(".").pop()?.toLowerCase()
    return ext || "auto"
  }, [file])

  const onFiles = (files?: FileList | null) => {
    if (!files || files.length === 0) return
    setFile(files[0])
    setProgress(0)
    setConverting(false)
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl)
      setDownloadUrl(null)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    onFiles(e.dataTransfer.files)
  }

  const startConversion = useCallback(async () => {
    if (!file || !loaded) {
      toast.error("Video converter is still loading. Please wait...")
      return
    }

    setConverting(true)
    setProgress(0)

    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl)
      setDownloadUrl(null)
    }

    try {
      // Real FFmpeg conversion
      const outputBlob = await convertVideo(file, toFormat, (progressValue) => {
        setProgress(progressValue)
      })

      // Create download URL
      const url = URL.createObjectURL(outputBlob)
      setDownloadUrl(url)
      toast.success("Conversion completed successfully!")
    } catch (err) {
      console.error("Conversion failed:", err)
      toast.error(err instanceof Error ? err.message : "Conversion failed. Please try again.")
      setProgress(0)
    } finally {
      setConverting(false)
    }
  }, [file, toFormat, loaded, convertVideo, downloadUrl])

  return (
    <Card className="max-w-4xl mx-auto card-glass shadow-brand-xl relative overflow-hidden">
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-strong-start via-brand-strong-end to-brand-strong-start animate-gradient" />

      <CardContent className="p-8">
        {/* Loading/Error States */}
        {loading && (
          <div className="flex items-center justify-center gap-3 py-8 text-sm">
            <Loader2 className="size-5 animate-spin text-brand-strong-start" />
            <span className="font-medium">Loading video converter...</span>
          </div>
        )}
        {error && (
          <div className="rounded-xl border border-destructive/50 bg-destructive/10 px-6 py-4 text-sm text-destructive mb-6 backdrop-blur-sm">
            <strong className="font-semibold">Error:</strong> {error}
          </div>
        )}

        <div className="grid gap-6">
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="grid gap-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">From</span>
              <div className="flex items-center gap-3 rounded-xl border-2 border-border bg-background/50 backdrop-blur-sm px-4 py-3 text-sm font-medium shadow-sm">
                <FileVideo className="size-5 shrink-0 text-brand-strong-start" aria-hidden="true" />
                <span className="truncate uppercase">{fromFormat}</span>
              </div>
            </div>
            <div className="grid gap-2 sm:col-span-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Convert To</span>
              <Select value={toFormat} onValueChange={setToFormat}>
                <SelectTrigger className="h-auto py-3 px-4 rounded-xl border-2 bg-background/50 backdrop-blur-sm font-medium text-base shadow-sm hover:border-brand-strong-start/50 transition-colors">
                  <SelectValue placeholder="Choose format" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {ALL_FORMATS.map((fmt) => (
                    <SelectItem value={fmt} key={fmt} className="rounded-lg">
                      {fmt.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <label
            htmlFor="file"
            onDragEnter={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setDragActive(true)
            }}
            onDragOver={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }}
            onDragLeave={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setDragActive(false)
            }}
            onDrop={handleDrop}
            className={cn(
              "group relative rounded-2xl border-2 border-dashed px-8 py-12 text-center cursor-pointer transition-all duration-300",
              dragActive
                ? "border-brand-strong-start bg-gradient-to-br from-brand-strong-start/10 to-brand-strong-end/10 scale-105 shadow-brand-lg"
                : "border-border/50 hover:border-brand-strong-start/50 hover:bg-gradient-to-br hover:from-brand-strong-start/5 hover:to-brand-strong-end/5 hover:scale-102 hover:shadow-lg",
            )}
          >
            {/* Decorative background */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand-strong-start/5 to-brand-strong-end/5 opacity-0 group-hover:opacity-100 transition-opacity -z-10" />

            <div className="flex flex-col items-center gap-4">
              <div className={cn(
                "p-4 rounded-2xl bg-gradient-to-br transition-all duration-300",
                dragActive
                  ? "from-brand-strong-start to-brand-strong-end shadow-lg scale-110"
                  : "from-muted/50 to-muted group-hover:from-brand-strong-start/20 group-hover:to-brand-strong-end/20"
              )}>
                <Upload className={cn(
                  "size-8 transition-all duration-300",
                  dragActive ? "text-white" : "text-muted-foreground group-hover:text-brand-strong-start"
                )} aria-hidden="true" />
              </div>
              <div className="space-y-2">
                <p className="text-base font-medium">
                  Drag and drop your file here, or{" "}
                  <span className="text-brand-gradient font-semibold">click to browse</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Supported formats: <span className="font-medium">MP4, MOV, AVI, MKV, MP3, WAV, AAC</span>
                </p>
              </div>
            </div>
            <input
              ref={inputRef}
              id="file"
              type="file"
              className="sr-only"
              onChange={(e) => onFiles(e.target.files)}
              aria-label="Choose file"
            />
          </label>

          {file && (
            <div className="grid gap-4 p-6 rounded-2xl bg-gradient-to-br from-muted/30 to-muted/10 border border-border/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-brand-strong-start to-brand-strong-end">
                    <FileVideo className="size-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{file.name}</p>
                    <p className="text-sm text-muted-foreground">{Math.round(file.size / 1024)} KB</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Progress</span>
                  <span className="text-brand-gradient font-semibold">{progress}%</span>
                </div>
                <Progress value={progress} className="h-3 bg-muted" />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button
                  onClick={startConversion}
                  disabled={converting || !loaded}
                  size="lg"
                  className="btn-gradient hover-glow flex-1 sm:flex-none"
                >
                  {converting ? (
                    <>
                      <Loader2 className="size-5 animate-spin" aria-hidden="true" />
                      Converting…
                    </>
                  ) : (
                    <>
                      <RefreshCcw className="size-5" aria-hidden="true" />
                      Convert Now
                    </>
                  )}
                </Button>
                {downloadUrl && !converting && (
                  <Button asChild variant="outline" size="lg" className="flex-1 sm:flex-none border-2 hover:border-green-500 hover:bg-green-500/10">
                    <a
                      download={`${file.name.split(".")[0]}.${toFormat}`}
                      href={downloadUrl}
                      className="inline-flex items-center gap-2"
                    >
                      <Download className="size-5" aria-hidden="true" />
                      Download Result
                    </a>
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
