export type VideoQuality = "low" | "medium" | "high" | "ultra" | "custom"
export type VideoResolution = "480p" | "720p" | "1080p" | "1440p" | "4k" | "original"
export type VideoCodec = "h264" | "h265" | "vp9" | "av1"
export type AudioCodec = "aac" | "mp3" | "opus" | "vorbis"
export type Preset = "ultrafast" | "fast" | "medium" | "slow" | "veryslow"

export interface ConversionOptions {
  // Basic
  outputFormat: string

  // Video Settings
  quality?: VideoQuality
  resolution?: VideoResolution
  videoBitrate?: number // kbps
  videoCodec?: VideoCodec
  fps?: number

  // Audio Settings
  audioBitrate?: number // kbps
  audioCodec?: AudioCodec
  sampleRate?: number
  audioChannels?: 1 | 2

  // Compression
  compressionLevel?: number // 0-100
  targetFileSize?: number // MB

  // Editing
  trim?: {
    start: number // seconds
    end: number // seconds
  }
  speed?: number // 0.25 to 4
  rotate?: 0 | 90 | 180 | 270
  flip?: "horizontal" | "vertical" | "both" | null
  crop?: {
    x: number
    y: number
    width: number
    height: number
  }

  // Preset
  preset?: Preset
  formatPreset?: FormatPreset
}

export interface FormatPreset {
  id: string
  name: string
  description: string
  icon: string
  category: "social" | "device" | "web"
  options: Partial<ConversionOptions>
}

export interface VideoFile {
  file: File
  preview?: string
  duration?: number
  width?: number
  height?: number
  size: number
}

export const QUALITY_PRESETS: Record<VideoQuality, { crf: number; bitrate: string }> = {
  low: { crf: 28, bitrate: "500k" },
  medium: { crf: 23, bitrate: "1000k" },
  high: { crf: 18, bitrate: "2500k" },
  ultra: { crf: 15, bitrate: "5000k" },
  custom: { crf: 23, bitrate: "2000k" },
}

export const RESOLUTION_SETTINGS: Record<VideoResolution, { width: number; height: number } | null> = {
  "480p": { width: 854, height: 480 },
  "720p": { width: 1280, height: 720 },
  "1080p": { width: 1920, height: 1080 },
  "1440p": { width: 2560, height: 1440 },
  "4k": { width: 3840, height: 2160 },
  original: null,
}

export const FORMAT_PRESETS: FormatPreset[] = [
  // Social Media Presets
  {
    id: "instagram-story",
    name: "Instagram Story",
    description: "9:16 vertical, optimized for stories",
    icon: "📱",
    category: "social",
    options: {
      outputFormat: "mp4",
      resolution: "1080p",
      quality: "high",
      videoCodec: "h264",
      audioBitrate: 128,
    },
  },
  {
    id: "youtube-hd",
    name: "YouTube HD",
    description: "1080p, high quality for YouTube",
    icon: "🎥",
    category: "social",
    options: {
      outputFormat: "mp4",
      resolution: "1080p",
      quality: "high",
      videoCodec: "h264",
      audioBitrate: 192,
      fps: 30,
    },
  },
  {
    id: "tiktok",
    name: "TikTok",
    description: "9:16 vertical, optimized for TikTok",
    icon: "🎵",
    category: "social",
    options: {
      outputFormat: "mp4",
      resolution: "1080p",
      quality: "high",
      videoCodec: "h264",
      audioBitrate: 128,
    },
  },
  {
    id: "twitter",
    name: "Twitter/X",
    description: "Optimized for Twitter video",
    icon: "🐦",
    category: "social",
    options: {
      outputFormat: "mp4",
      resolution: "720p",
      quality: "medium",
      videoCodec: "h264",
      audioBitrate: 128,
    },
  },
  // Device Presets
  {
    id: "iphone",
    name: "iPhone",
    description: "H.264, compatible with all iPhones",
    icon: "📱",
    category: "device",
    options: {
      outputFormat: "mp4",
      videoCodec: "h264",
      quality: "high",
      audioCodec: "aac",
    },
  },
  {
    id: "android",
    name: "Android",
    description: "H.264, compatible with Android devices",
    icon: "🤖",
    category: "device",
    options: {
      outputFormat: "mp4",
      videoCodec: "h264",
      quality: "high",
      audioCodec: "aac",
    },
  },
  // Web Presets
  {
    id: "web-optimized",
    name: "Web Optimized",
    description: "Small file size, fast loading",
    icon: "🌐",
    category: "web",
    options: {
      outputFormat: "mp4",
      resolution: "720p",
      quality: "medium",
      videoCodec: "h264",
      compressionLevel: 70,
    },
  },
  {
    id: "webm-vp9",
    name: "WebM (VP9)",
    description: "Modern web format, great compression",
    icon: "🌐",
    category: "web",
    options: {
      outputFormat: "webm",
      videoCodec: "vp9",
      quality: "medium",
      audioCodec: "opus",
    },
  },
]
