"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, Trash2, MoveUp, MoveDown, Link2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface MergeVideosProps {
  files: File[]
  onFilesChange: (files: File[]) => void
}

export function MergeVideos({ files, onFilesChange }: MergeVideosProps) {
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || [])
    onFilesChange([...files, ...newFiles])
  }

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index)
    onFilesChange(newFiles)
  }

  const moveUp = (index: number) => {
    if (index === 0) return
    const newFiles = [...files]
    ;[newFiles[index - 1], newFiles[index]] = [newFiles[index], newFiles[index - 1]]
    onFilesChange(newFiles)
  }

  const moveDown = (index: number) => {
    if (index === files.length - 1) return
    const newFiles = [...files]
    ;[newFiles[index], newFiles[index + 1]] = [newFiles[index + 1], newFiles[index]]
    onFilesChange(newFiles)
  }

  return (
    <Card className="card-glass border-0">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link2 className="size-5 text-brand-strong-start" />
            <h3 className="font-semibold text-lg">Merge Videos</h3>
          </div>
          <Button variant="outline" size="sm" asChild>
            <label className="cursor-pointer">
              <Upload className="size-4 mr-2" />
              Add Videos
              <input
                type="file"
                multiple
                accept="video/*"
                className="sr-only"
                onChange={handleFileSelect}
              />
            </label>
          </Button>
        </div>

        {files.length === 0 ? (
          <div className="border-2 border-dashed border-border/50 rounded-xl p-8 text-center">
            <Link2 className="size-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">
              No videos added yet. Click "Add Videos" to start.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="group flex items-center gap-3 p-3 rounded-xl bg-gradient-to-br from-muted/30 to-muted/10 border border-border/50 hover:border-brand-strong-start/50 transition-colors"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-brand-strong-start to-brand-strong-end text-white font-bold text-sm">
                  {index + 1}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate text-sm">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => moveUp(index)}
                    disabled={index === 0}
                    className="h-8 w-8 p-0"
                  >
                    <MoveUp className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => moveDown(index)}
                    disabled={index === files.length - 1}
                    className="h-8 w-8 p-0"
                  >
                    <MoveDown className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    className="h-8 w-8 p-0 hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {files.length > 0 && (
          <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg p-4 border border-brand-strong-start/20">
            <p className="text-sm font-medium mb-2">📝 Merge Info</p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Total videos: {files.length}</li>
              <li>
                • Total size: {(files.reduce((acc, f) => acc + f.size, 0) / (1024 * 1024)).toFixed(2)}{" "}
                MB
              </li>
              <li>• Videos will be merged in the order shown above</li>
              <li>• Use arrow buttons to reorder</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
