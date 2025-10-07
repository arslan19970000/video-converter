"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Settings2, Video, AudioLines, Zap } from "lucide-react"
import type { ConversionOptions } from "@/lib/types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface AdvancedOptionsProps {
  options: ConversionOptions
  onChange: (options: Partial<ConversionOptions>) => void
}

export function AdvancedOptions({ options, onChange }: AdvancedOptionsProps) {
  return (
    <Card className="card-glass border-0">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Settings2 className="size-5 text-brand-strong-start" />
          <h3 className="font-semibold text-lg">Advanced Options</h3>
        </div>

        <Tabs defaultValue="video" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="video" className="flex items-center gap-2">
              <Video className="size-4" />
              Video
            </TabsTrigger>
            <TabsTrigger value="audio" className="flex items-center gap-2">
              <AudioLines className="size-4" />
              Audio
            </TabsTrigger>
            <TabsTrigger value="compression" className="flex items-center gap-2">
              <Zap className="size-4" />
              Compression
            </TabsTrigger>
          </TabsList>

          {/* Video Settings */}
          <TabsContent value="video" className="space-y-4 mt-4">
            {/* Quality */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Quality</Label>
              <Select
                value={options.quality || "high"}
                onValueChange={(value) => onChange({ quality: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low (Fast, Small File)</SelectItem>
                  <SelectItem value="medium">Medium (Balanced)</SelectItem>
                  <SelectItem value="high">High (Recommended)</SelectItem>
                  <SelectItem value="ultra">Ultra (Slow, Large File)</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Resolution */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Resolution</Label>
              <Select
                value={options.resolution || "original"}
                onValueChange={(value) => onChange({ resolution: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="original">Original</SelectItem>
                  <SelectItem value="480p">480p (SD)</SelectItem>
                  <SelectItem value="720p">720p (HD)</SelectItem>
                  <SelectItem value="1080p">1080p (Full HD)</SelectItem>
                  <SelectItem value="1440p">1440p (2K)</SelectItem>
                  <SelectItem value="4k">4K (Ultra HD)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Video Codec */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Video Codec</Label>
              <Select
                value={options.videoCodec || "h264"}
                onValueChange={(value) => onChange({ videoCodec: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="h264">H.264 (Most Compatible)</SelectItem>
                  <SelectItem value="h265">H.265 (Better Compression)</SelectItem>
                  <SelectItem value="vp9">VP9 (Web Optimized)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Video Bitrate */}
            {options.quality === "custom" && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Video Bitrate: {options.videoBitrate || 2000} kbps
                </Label>
                <Slider
                  value={[options.videoBitrate || 2000]}
                  min={500}
                  max={10000}
                  step={100}
                  onValueChange={(v) => onChange({ videoBitrate: v[0] })}
                />
              </div>
            )}

            {/* FPS */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Frame Rate (FPS)</Label>
              <Select
                value={options.fps?.toString() || "auto"}
                onValueChange={(value) =>
                  onChange({ fps: value === "auto" ? undefined : parseInt(value) })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto (Original)</SelectItem>
                  <SelectItem value="24">24 fps (Cinema)</SelectItem>
                  <SelectItem value="30">30 fps (Standard)</SelectItem>
                  <SelectItem value="60">60 fps (Smooth)</SelectItem>
                  <SelectItem value="120">120 fps (High Motion)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Encoding Speed Preset */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Encoding Speed</Label>
              <Select
                value={options.preset || "medium"}
                onValueChange={(value) => onChange({ preset: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ultrafast">Ultra Fast (Lower Quality)</SelectItem>
                  <SelectItem value="fast">Fast</SelectItem>
                  <SelectItem value="medium">Medium (Balanced)</SelectItem>
                  <SelectItem value="slow">Slow (Better Quality)</SelectItem>
                  <SelectItem value="veryslow">Very Slow (Best Quality)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          {/* Audio Settings */}
          <TabsContent value="audio" className="space-y-4 mt-4">
            {/* Audio Codec */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Audio Codec</Label>
              <Select
                value={options.audioCodec || "aac"}
                onValueChange={(value) => onChange({ audioCodec: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aac">AAC (Recommended)</SelectItem>
                  <SelectItem value="mp3">MP3</SelectItem>
                  <SelectItem value="opus">Opus (Best Quality)</SelectItem>
                  <SelectItem value="vorbis">Vorbis</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Audio Bitrate */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Audio Bitrate: {options.audioBitrate || 192} kbps
              </Label>
              <Slider
                value={[options.audioBitrate || 192]}
                min={64}
                max={320}
                step={32}
                onValueChange={(v) => onChange({ audioBitrate: v[0] })}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>64 kbps</span>
                <span>192 kbps</span>
                <span>320 kbps</span>
              </div>
            </div>

            {/* Sample Rate */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Sample Rate</Label>
              <Select
                value={options.sampleRate?.toString() || "44100"}
                onValueChange={(value) => onChange({ sampleRate: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="22050">22050 Hz (Low)</SelectItem>
                  <SelectItem value="44100">44100 Hz (CD Quality)</SelectItem>
                  <SelectItem value="48000">48000 Hz (Professional)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Audio Channels */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Channels</Label>
              <Select
                value={options.audioChannels?.toString() || "2"}
                onValueChange={(value) => onChange({ audioChannels: parseInt(value) as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Mono</SelectItem>
                  <SelectItem value="2">Stereo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          {/* Compression Settings */}
          <TabsContent value="compression" className="space-y-4 mt-4">
            {/* Compression Level */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Compression Level: {options.compressionLevel || 50}%
              </Label>
              <Slider
                value={[options.compressionLevel || 50]}
                min={0}
                max={100}
                step={5}
                onValueChange={(v) => onChange({ compressionLevel: v[0] })}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>No Compression</span>
                <span>Balanced</span>
                <span>Max Compression</span>
              </div>
            </div>

            {/* Target File Size */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Target File Size (MB)</Label>
              <Input
                type="number"
                min={1}
                max={1000}
                value={options.targetFileSize || ""}
                onChange={(e) =>
                  onChange({ targetFileSize: e.target.value ? parseInt(e.target.value) : undefined })
                }
                placeholder="Leave empty for auto"
              />
              <p className="text-xs text-muted-foreground">
                Optional: Set a target file size. Quality will be adjusted automatically.
              </p>
            </div>

            {/* Info Box */}
            <div className="bg-muted/30 rounded-lg p-4 space-y-2">
              <p className="text-sm font-medium">💡 Compression Tips</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Higher compression = smaller file size, lower quality</li>
                <li>• Use H.265 codec for better compression than H.264</li>
                <li>• Reducing resolution significantly reduces file size</li>
                <li>• Lower audio bitrate for even smaller files</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
