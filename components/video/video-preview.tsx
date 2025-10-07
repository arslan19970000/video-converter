"use client"

import { useEffect, useRef, useState } from "react"
import { Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"

interface VideoPreviewProps {
  file: File
  onDurationLoad?: (duration: number) => void
  onVideoLoad?: (width: number, height: number) => void
  trim?: { start: number; end: number }
  className?: string
}

export function VideoPreview({
  file,
  onDurationLoad,
  onVideoLoad,
  trim,
  className,
}: VideoPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [muted, setMuted] = useState(false)
  const [videoUrl, setVideoUrl] = useState<string>("")

  useEffect(() => {
    const url = URL.createObjectURL(file)
    setVideoUrl(url)

    return () => {
      URL.revokeObjectURL(url)
    }
  }, [file])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleLoadedMetadata = () => {
      const dur = video.duration
      setDuration(dur)
      onDurationLoad?.(dur)
      onVideoLoad?.(video.videoWidth, video.videoHeight)
    }

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime)

      // Auto-pause at trim end
      if (trim && video.currentTime >= trim.end) {
        video.pause()
        setPlaying(false)
      }
    }

    const handleEnded = () => {
      setPlaying(false)
    }

    video.addEventListener("loadedmetadata", handleLoadedMetadata)
    video.addEventListener("timeupdate", handleTimeUpdate)
    video.addEventListener("ended", handleEnded)

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata)
      video.removeEventListener("timeupdate", handleTimeUpdate)
      video.removeEventListener("ended", handleEnded)
    }
  }, [trim, onDurationLoad, onVideoLoad])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (playing) {
      video.pause()
    } else {
      // If trimming, start from trim start
      if (trim && video.currentTime < trim.start) {
        video.currentTime = trim.start
      }
      video.play()
    }
    setPlaying(!playing)
  }

  const handleSeek = (value: number[]) => {
    const video = videoRef.current
    if (!video) return

    let newTime = value[0]

    // Constrain to trim range if trimming
    if (trim) {
      newTime = Math.max(trim.start, Math.min(trim.end, newTime))
    }

    video.currentTime = newTime
    setCurrentTime(newTime)
  }

  const handleVolumeChange = (value: number[]) => {
    const video = videoRef.current
    if (!video) return

    const newVolume = value[0]
    video.volume = newVolume
    setVolume(newVolume)
    setMuted(newVolume === 0)
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return

    video.muted = !muted
    setMuted(!muted)
  }

  const toggleFullscreen = () => {
    const video = videoRef.current
    if (!video) return

    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      video.requestFullscreen()
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className={cn("space-y-3", className)}>
      {/* Video Player */}
      <div className="relative rounded-xl overflow-hidden bg-black group">
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full aspect-video object-contain"
          onClick={togglePlay}
        />

        {/* Play/Pause Overlay */}
        {!playing && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
            <Button
              size="lg"
              onClick={togglePlay}
              className="btn-gradient h-16 w-16 rounded-full p-0 hover-glow"
            >
              <Play className="size-8 fill-white" />
            </Button>
          </div>
        )}

        {/* Trim Indicators */}
        {trim && (
          <div className="absolute bottom-0 left-0 right-0 px-4 pb-2 bg-gradient-to-t from-black/60 to-transparent">
            <div className="text-xs text-white/80">
              Trim: {formatTime(trim.start)} - {formatTime(trim.end)}
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="space-y-2">
        {/* Timeline */}
        <div className="space-y-1">
          <Slider
            value={[currentTime]}
            min={trim?.start || 0}
            max={trim?.end || duration}
            step={0.1}
            onValueChange={handleSeek}
            className="cursor-pointer"
          />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(trim?.end || duration)}</span>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={togglePlay}>
              {playing ? (
                <Pause className="size-4" />
              ) : (
                <Play className="size-4" />
              )}
            </Button>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={toggleMute}>
                {muted || volume === 0 ? (
                  <VolumeX className="size-4" />
                ) : (
                  <Volume2 className="size-4" />
                )}
              </Button>
              <Slider
                value={[muted ? 0 : volume]}
                min={0}
                max={1}
                step={0.1}
                onValueChange={handleVolumeChange}
                className="w-20"
              />
            </div>
          </div>

          <Button variant="ghost" size="sm" onClick={toggleFullscreen}>
            <Maximize className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
