"use client"

import { FFmpeg } from "@ffmpeg/ffmpeg"
import { toBlobURL, fetchFile } from "@ffmpeg/util"
import { useEffect, useRef, useState } from "react"
import type { ConversionOptions, VideoFile } from "@/lib/types"
import { QUALITY_PRESETS, RESOLUTION_SETTINGS } from "@/lib/types"

export function useFFmpegAdvanced() {
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
    options: ConversionOptions,
    onProgress?: (progress: number) => void
  ): Promise<Blob> => {
    if (!ffmpegRef.current || !loaded) {
      throw new Error("FFmpeg is not loaded yet")
    }

    const ffmpeg = ffmpegRef.current
    const inputFileName = "input." + file.name.split(".").pop()
    const outputFileName = `output.${options.outputFormat}`

    try {
      // Set up progress tracking
      if (onProgress) {
        ffmpeg.on("progress", ({ progress }) => {
          onProgress(Math.round(progress * 100))
        })
      }

      // Write input file to FFmpeg filesystem
      await ffmpeg.writeFile(inputFileName, await fetchFile(file))

      // Build FFmpeg arguments with advanced options
      const args = buildFFmpegArgs(inputFileName, outputFileName, options)

      // Execute conversion
      await ffmpeg.exec(args)

      // Read the output file
      const data = await ffmpeg.readFile(outputFileName)

      // Clean up
      await ffmpeg.deleteFile(inputFileName)
      await ffmpeg.deleteFile(outputFileName)

      // Convert to Blob
      const mimeType = getMimeType(options.outputFormat)
      return new Blob([data], { type: mimeType })
    } catch (err) {
      console.error("Conversion error:", err)
      throw new Error("Video conversion failed. Please try again.")
    }
  }

  const mergeVideos = async (
    files: File[],
    outputFormat: string,
    onProgress?: (progress: number) => void
  ): Promise<Blob> => {
    if (!ffmpegRef.current || !loaded) {
      throw new Error("FFmpeg is not loaded yet")
    }

    const ffmpeg = ffmpegRef.current

    try {
      // Set up progress tracking
      if (onProgress) {
        ffmpeg.on("progress", ({ progress }) => {
          onProgress(Math.round(progress * 100))
        })
      }

      // Write all input files
      const inputFiles: string[] = []
      for (let i = 0; i < files.length; i++) {
        const fileName = `input${i}.${files[i].name.split(".").pop()}`
        await ffmpeg.writeFile(fileName, await fetchFile(files[i]))
        inputFiles.push(fileName)
      }

      // Create concat file list
      const concatList = inputFiles.map((f) => `file '${f}'`).join("\n")
      await ffmpeg.writeFile("concat_list.txt", concatList)

      const outputFileName = `output.${outputFormat}`

      // Execute merge with concat demuxer
      await ffmpeg.exec([
        "-f",
        "concat",
        "-safe",
        "0",
        "-i",
        "concat_list.txt",
        "-c",
        "copy",
        outputFileName,
      ])

      // Read the output file
      const data = await ffmpeg.readFile(outputFileName)

      // Clean up
      for (const file of inputFiles) {
        await ffmpeg.deleteFile(file)
      }
      await ffmpeg.deleteFile("concat_list.txt")
      await ffmpeg.deleteFile(outputFileName)

      const mimeType = getMimeType(outputFormat)
      return new Blob([data], { type: mimeType })
    } catch (err) {
      console.error("Merge error:", err)
      throw new Error("Video merge failed. Please try again.")
    }
  }

  const getVideoInfo = async (file: File): Promise<VideoFile> => {
    // This would require parsing FFmpeg probe output
    // For now, return basic info
    return {
      file,
      size: file.size,
    }
  }

  return {
    loaded,
    loading,
    error,
    convertVideo,
    mergeVideos,
    getVideoInfo,
  }
}

function buildFFmpegArgs(input: string, output: string, options: ConversionOptions): string[] {
  const args: string[] = ["-i", input]

  // Apply trim if specified
  if (options.trim) {
    args.push("-ss", options.trim.start.toString())
    args.push("-to", options.trim.end.toString())
  }

  // Video filters array
  const filters: string[] = []

  // Speed adjustment
  if (options.speed && options.speed !== 1) {
    const videoSpeed = 1 / options.speed
    filters.push(`setpts=${videoSpeed}*PTS`)
  }

  // Rotation
  if (options.rotate) {
    const rotations: Record<number, string> = {
      90: "transpose=1",
      180: "transpose=2,transpose=2",
      270: "transpose=2",
    }
    if (rotations[options.rotate]) {
      filters.push(rotations[options.rotate])
    }
  }

  // Flip
  if (options.flip) {
    if (options.flip === "horizontal") filters.push("hflip")
    if (options.flip === "vertical") filters.push("vflip")
    if (options.flip === "both") filters.push("hflip,vflip")
  }

  // Resolution/Scale
  if (options.resolution && options.resolution !== "original") {
    const res = RESOLUTION_SETTINGS[options.resolution]
    if (res) {
      filters.push(`scale=${res.width}:${res.height}`)
    }
  }

  // Crop
  if (options.crop) {
    filters.push(
      `crop=${options.crop.width}:${options.crop.height}:${options.crop.x}:${options.crop.y}`
    )
  }

  // FPS
  if (options.fps) {
    filters.push(`fps=${options.fps}`)
  }

  // Apply filters if any
  if (filters.length > 0) {
    args.push("-vf", filters.join(","))
  }

  // Video codec and quality
  const format = options.outputFormat.toLowerCase()
  const isAudioOnly = ["mp3", "wav", "aac", "opus"].includes(format)

  if (!isAudioOnly) {
    // Video codec
    const codec = options.videoCodec || getDefaultVideoCodec(format)
    args.push("-c:v", codec)

    // Quality settings
    if (options.quality && options.quality !== "custom") {
      const preset = QUALITY_PRESETS[options.quality]
      args.push("-crf", preset.crf.toString())
      if (options.videoBitrate) {
        args.push("-b:v", `${options.videoBitrate}k`)
      } else {
        args.push("-b:v", preset.bitrate)
      }
    } else if (options.videoBitrate) {
      args.push("-b:v", `${options.videoBitrate}k`)
    }

    // Preset (encoding speed)
    if (options.preset) {
      args.push("-preset", options.preset)
    }
  } else {
    // Audio only - remove video stream
    args.push("-vn")
  }

  // Audio codec and settings
  if (format !== "wav") {
    const audioCodec = options.audioCodec || getDefaultAudioCodec(format)
    args.push("-c:a", audioCodec)
  }

  if (options.audioBitrate) {
    args.push("-b:a", `${options.audioBitrate}k`)
  }

  if (options.sampleRate) {
    args.push("-ar", options.sampleRate.toString())
  }

  if (options.audioChannels) {
    args.push("-ac", options.audioChannels.toString())
  }

  // Speed adjustment for audio
  if (options.speed && options.speed !== 1) {
    const audioSpeed = 1 / options.speed
    args.push("-af", `atempo=${audioSpeed}`)
  }

  // Output file
  args.push(output)

  return args
}

function getDefaultVideoCodec(format: string): string {
  const codecs: Record<string, string> = {
    mp4: "libx264",
    webm: "libvpx",
    mov: "libx264",
    avi: "mpeg4",
    mkv: "libx264",
  }
  return codecs[format] || "libx264"
}

function getDefaultAudioCodec(format: string): string {
  const codecs: Record<string, string> = {
    mp4: "aac",
    webm: "libvorbis",
    mov: "aac",
    avi: "libmp3lame",
    mkv: "aac",
    mp3: "libmp3lame",
    aac: "aac",
    opus: "libopus",
  }
  return codecs[format] || "aac"
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
    opus: "audio/opus",
  }
  return mimeTypes[format.toLowerCase()] || "application/octet-stream"
}
