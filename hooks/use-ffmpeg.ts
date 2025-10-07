"use client"

import { FFmpeg } from "@ffmpeg/ffmpeg"
import { toBlobURL, fetchFile } from "@ffmpeg/util"
import { useEffect, useRef, useState } from "react"

export function useFFmpeg() {
  const ffmpegRef = useRef<FFmpeg | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadFFmpeg()
  }, [])

  const loadFFmpeg = async () => {
    if (loaded || loading) return

    try {
      setLoading(true)
      setError(null)

      const ffmpeg = new FFmpeg()
      ffmpegRef.current = ffmpeg

      // Load FFmpeg core
      const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd"
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
      })

      setLoaded(true)
    } catch (err) {
      console.error("Failed to load FFmpeg:", err)
      setError("Failed to load video converter. Please refresh the page.")
    } finally {
      setLoading(false)
    }
  }

  const convertVideo = async (
    file: File,
    outputFormat: string,
    onProgress?: (progress: number) => void
  ): Promise<Blob> => {
    if (!ffmpegRef.current || !loaded) {
      throw new Error("FFmpeg is not loaded yet")
    }

    const ffmpeg = ffmpegRef.current
    const inputFileName = "input." + file.name.split(".").pop()
    const outputFileName = `output.${outputFormat}`

    try {
      // Set up progress tracking
      if (onProgress) {
        ffmpeg.on("progress", ({ progress }) => {
          onProgress(Math.round(progress * 100))
        })
      }

      // Write input file to FFmpeg filesystem
      await ffmpeg.writeFile(inputFileName, await fetchFile(file))

      // Determine conversion parameters based on format
      const args = getFFmpegArgs(inputFileName, outputFileName, outputFormat)

      // Execute conversion
      await ffmpeg.exec(args)

      // Read the output file
      const data = await ffmpeg.readFile(outputFileName)

      // Clean up
      await ffmpeg.deleteFile(inputFileName)
      await ffmpeg.deleteFile(outputFileName)

      // Convert to Blob
      const mimeType = getMimeType(outputFormat)
      return new Blob([data], { type: mimeType })
    } catch (err) {
      console.error("Conversion error:", err)
      throw new Error("Video conversion failed. Please try again.")
    }
  }

  return {
    loaded,
    loading,
    error,
    convertVideo,
  }
}

function getFFmpegArgs(input: string, output: string, format: string): string[] {
  const baseArgs = ["-i", input]

  switch (format.toLowerCase()) {
    case "mp4":
      return [...baseArgs, "-c:v", "libx264", "-c:a", "aac", "-strict", "experimental", output]
    case "webm":
      return [...baseArgs, "-c:v", "libvpx", "-c:a", "libvorbis", output]
    case "mp3":
      return [...baseArgs, "-vn", "-ar", "44100", "-ac", "2", "-b:a", "192k", output]
    case "wav":
      return [...baseArgs, "-vn", "-acodec", "pcm_s16le", "-ar", "44100", "-ac", "2", output]
    case "aac":
      return [...baseArgs, "-vn", "-c:a", "aac", "-b:a", "192k", output]
    case "mov":
      return [...baseArgs, "-c:v", "libx264", "-c:a", "aac", "-f", "mov", output]
    case "avi":
      return [...baseArgs, "-c:v", "mpeg4", "-c:a", "libmp3lame", "-f", "avi", output]
    case "mkv":
      return [...baseArgs, "-c:v", "libx264", "-c:a", "aac", "-f", "matroska", output]
    default:
      return [...baseArgs, output]
  }
}

function getMimeType(format: string): string {
  const mimeTypes: Record<string, string> = {
    mp4: "video/mp4",
    webm: "video/webm",
    mov: "video/quicktime",
    avi: "video/x-msvideo",
    mkv: "video/x-matroska",
    mp3: "audio/mpeg",
    wav: "audio/wav",
    aac: "audio/aac",
  }
  return mimeTypes[format.toLowerCase()] || "application/octet-stream"
}
