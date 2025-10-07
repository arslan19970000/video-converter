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
      // Set up progress tracking with proper cleanup
      const progressHandler = ({ progress }: { progress: number }) => {
        const progressPercent = Math.min(100, Math.round(progress * 100))
        onProgress?.(progressPercent)
      }

      if (onProgress) {
        ffmpeg.on("progress", progressHandler)
      }

      // Write input file to FFmpeg filesystem
      await ffmpeg.writeFile(inputFileName, await fetchFile(file))

      // Build FFmpeg arguments with advanced options
      const args = buildFFmpegArgs(inputFileName, outputFileName, options)

      // Execute conversion
      await ffmpeg.exec(args)

      // Remove progress listener immediately after execution
      if (onProgress) {
        ffmpeg.off("progress", progressHandler)
      }

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
      // Set up progress tracking with proper cleanup
      const progressHandler = ({ progress }: { progress: number }) => {
        const progressPercent = Math.min(100, Math.round(progress * 100))
        onProgress?.(progressPercent)
      }

      if (onProgress) {
        ffmpeg.on("progress", progressHandler)
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

      // Remove progress listener
      if (onProgress) {
        ffmpeg.off("progress", progressHandler)
      }

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

  const mergeVideoSegments = async (
    segments: Array<{
      file: File
      trim: { start: number; end: number }
    }>,
    outputFormat: string,
    onProgress?: (progress: number) => void
  ): Promise<Blob> => {
    if (!ffmpegRef.current || !loaded) {
      throw new Error("FFmpeg is not loaded yet")
    }

    const ffmpeg = ffmpegRef.current

    try {
      // Set up progress tracking with proper cleanup
      const progressHandler = ({ progress }: { progress: number }) => {
        const progressPercent = Math.min(100, Math.round(progress * 100))
        onProgress?.(progressPercent)
      }

      if (onProgress) {
        ffmpeg.on("progress", progressHandler)
      }

      // Process each segment with trimming
      const processedFiles: string[] = []

      for (let i = 0; i < segments.length; i++) {
        const segment = segments[i]
        const inputFileName = `input${i}.${segment.file.name.split(".").pop()}`
        const trimmedFileName = `trimmed${i}.${outputFormat}`

        // Write input file
        await ffmpeg.writeFile(inputFileName, await fetchFile(segment.file))

        // Trim the segment
        const trimArgs = [
          "-i",
          inputFileName,
          "-ss",
          segment.trim.start.toString(),
          "-to",
          segment.trim.end.toString(),
          "-c",
          "copy",
          trimmedFileName,
        ]

        await ffmpeg.exec(trimArgs)

        processedFiles.push(trimmedFileName)

        // Clean up input file
        await ffmpeg.deleteFile(inputFileName)
      }

      // Create concat file list with processed files
      const concatList = processedFiles.map((f) => `file '${f}'`).join("\n")
      await ffmpeg.writeFile("concat_list.txt", concatList)

      const outputFileName = `output.${outputFormat}`

      // Merge all trimmed segments
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

      // Remove progress listener
      if (onProgress) {
        ffmpeg.off("progress", progressHandler)
      }

      // Read the output file
      const data = await ffmpeg.readFile(outputFileName)

      // Clean up all files
      for (const file of processedFiles) {
        await ffmpeg.deleteFile(file)
      }
      await ffmpeg.deleteFile("concat_list.txt")
      await ffmpeg.deleteFile(outputFileName)

      const mimeType = getMimeType(outputFormat)
      return new Blob([data], { type: mimeType })
    } catch (err) {
      console.error("Merge segments error:", err)
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
    mergeVideoSegments,
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

  // Rotation (must come before flip)
  if (options.rotate && options.rotate !== 0) {
    const rotations: Record<number, string> = {
      90: "transpose=1",     // 90 degrees clockwise
      180: "transpose=1,transpose=1",  // 180 degrees (90+90)
      270: "transpose=2",    // 90 degrees counter-clockwise (same as 270 clockwise)
    }
    if (rotations[options.rotate]) {
      filters.push(rotations[options.rotate])
    }
  }

  // Flip
  if (options.flip) {
    if (options.flip === "horizontal") filters.push("hflip")
    else if (options.flip === "vertical") filters.push("vflip")
    else if (options.flip === "both") {
      filters.push("hflip")
      filters.push("vflip")
    }
  }

  // Speed adjustment for video
  if (options.speed && options.speed !== 1) {
    const videoSpeed = 1 / options.speed
    filters.push(`setpts=${videoSpeed}*PTS`)
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

  // Apply video filters if any
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

  // Audio filters array
  const audioFilters: string[] = []

  // Speed adjustment for audio
  if (options.speed && options.speed !== 1) {
    // atempo filter has limitations: must be between 0.5 and 2.0
    // For speeds outside this range, we need to chain multiple atempo filters
    let speed = options.speed
    while (speed > 2.0) {
      audioFilters.push("atempo=2.0")
      speed = speed / 2.0
    }
    while (speed < 0.5) {
      audioFilters.push("atempo=0.5")
      speed = speed / 0.5
    }
    if (speed !== 1.0) {
      audioFilters.push(`atempo=${speed.toFixed(2)}`)
    }
  }

  // Apply audio filters if any
  if (audioFilters.length > 0) {
    args.push("-af", audioFilters.join(","))
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
