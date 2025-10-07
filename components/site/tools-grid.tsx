"use client"

import { SimpleConvertTool } from "@/components/tools/simple-convert-tool"
import { TrimVideoTool } from "@/components/tools/trim-video-tool"
import { MergeVideosTool } from "@/components/tools/merge-videos-tool"
import { VideoEditingTool } from "@/components/tools/video-editing-tool"
import { CompressTool } from "@/components/tools/compress-tool"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export function ToolsGrid() {
  const tools = [
    { component: SimpleConvertTool, key: "convert" },
    { component: TrimVideoTool, key: "trim" },
    { component: MergeVideosTool, key: "merge" },
    { component: VideoEditingTool, key: "edit" },
    { component: CompressTool, key: "compress" },
  ]

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold">
          <span className="text-brand-gradient">Video Conversion Tools</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Choose from our collection of professional video tools. Each tool is designed to handle a specific task with simplicity and precision.
        </p>
      </div>

      <div className="px-12">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {tools.map(({ component: ToolComponent, key }) => (
              <CarouselItem key={key} className="md:basis-1/2 lg:basis-1/2">
                <div className="p-1">
                  <ToolComponent />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hover:bg-gradient-to-br hover:from-blue-500 hover:to-purple-500 hover:text-white" />
          <CarouselNext className="hover:bg-gradient-to-br hover:from-blue-500 hover:to-purple-500 hover:text-white" />
        </Carousel>
      </div>
    </div>
  )
}
