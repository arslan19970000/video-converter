"use client"

import type React from "react"

import { useCallback, useMemo, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, Download, FileVideo, RefreshCcw } from "lucide-react"
import { cn } from "@/lib/utils"

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

  const startConversion = useCallback(() => {
    if (!file) return
    setConverting(true)
    setProgress(0)
    // Simulate conversion progress; ready to swap with a real backend.
    const total = 1600
    const step = 32
    let elapsed = 0
    const timer = setInterval(() => {
      elapsed += step
      const next = Math.min(100, Math.round((elapsed / total) * 100))
      setProgress(next)
      if (next >= 100) {
        clearInterval(timer)
        // Fake output result as a blob to enable download
        const blob = new Blob([`Converted: ${file.name} -> ${toFormat}`], {
          type: "text/plain",
        })
        const url = URL.createObjectURL(blob)
        setDownloadUrl(url)
        setConverting(false)
      }
    }, step)
  }, [file, toFormat])

  return (
    <Card className="max-w-3xl mx-auto card-glass shadow-brand-lg">
      <CardContent className="p-6">
        <div className="grid gap-4">
          <div className="grid sm:grid-cols-3 gap-3">
            <div className="grid gap-2">
              <span className="text-xs text-muted-foreground">From</span>
              <div className="flex items-center gap-2 rounded-md border bg-muted/40 px-3 py-2 text-sm">
                <FileVideo className="size-4 shrink-0" aria-hidden="true" />
                <span className="truncate">{fromFormat}</span>
              </div>
            </div>
            <div className="grid gap-2 sm:col-span-2">
              <span className="text-xs text-muted-foreground">To</span>
              <Select value={toFormat} onValueChange={setToFormat}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose format" />
                </SelectTrigger>
                <SelectContent>
                  {ALL_FORMATS.map((fmt) => (
                    <SelectItem value={fmt} key={fmt}>
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
              "rounded-lg border-2 border-dashed px-6 py-10 text-center cursor-pointer transition-transform",
              dragActive
                ? "border-primary bg-primary/5 scale-[1.01]"
                : "border-border hover:bg-muted/40 hover:scale-[1.01]",
            )}
          >
            <div className="flex flex-col items-center gap-2">
              <Upload className="size-6" aria-hidden="true" />
              <p className="text-sm">
                Drag and drop your file here, or
                <span className="font-medium"> click to choose</span>
              </p>
              <p className="text-xs text-muted-foreground">Supported: MP4, MOV, AVI, MKV, MP3, WAV, AAC</p>
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
            <div className="grid gap-2">
              <div className="flex items-center justify-between text-sm">
                <span className="truncate">{file.name}</span>
                <span className="text-muted-foreground">{Math.round(file.size / 1024)} KB</span>
              </div>
              <Progress value={progress} className="h-2" />
              <div className="flex items-center gap-3">
                <Button
                  onClick={startConversion}
                  disabled={converting}
                  className="inline-flex items-center gap-2 btn-dark hover-brand-gradient hover-glow"
                >
                  <RefreshCcw className="size-4" aria-hidden="true" />
                  {converting ? "Converting…" : "Convert Now"}
                </Button>
                {downloadUrl && !converting && (
                  <a
                    download={`${file.name.split(".")[0]}.${toFormat}`}
                    href={downloadUrl}
                    className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                  >
                    <Download className="size-4" aria-hidden="true" />
                    Download result
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
