import { SimpleConvertTool } from "@/components/tools/simple-convert-tool"
import { TrimVideoTool } from "@/components/tools/trim-video-tool"
import { MergeVideosTool } from "@/components/tools/merge-videos-tool"
import { VideoEditingTool } from "@/components/tools/video-editing-tool"
import { CompressTool } from "@/components/tools/compress-tool"

export function ToolsGrid() {
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

      <div className="grid gap-8 lg:grid-cols-2">
        <SimpleConvertTool />
        <TrimVideoTool />
        <MergeVideosTool />
        <VideoEditingTool />
        <CompressTool />
      </div>
    </div>
  )
}
