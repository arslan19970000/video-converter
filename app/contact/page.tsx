"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Send } from "lucide-react"

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false)

  return (
    <div className="container mx-auto px-4 py-10 md:py-16">
      <header className="text-center max-w-2xl mx-auto mb-10">
        <h1 className="text-3xl md:text-5xl font-semibold text-balance">Contact Us</h1>
        <p className="text-muted-foreground mt-3">
          Questions about features, pricing, or enterprise? We’d love to help.
        </p>
      </header>

      <Card className="max-w-2xl mx-auto backdrop-blur bg-card/80">
        <CardHeader>
          <CardTitle>Send a Message</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="grid gap-4"
            onSubmit={(e) => {
              e.preventDefault()
              setSubmitting(true)
              setTimeout(() => setSubmitting(false), 1200)
            }}
          >
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" placeholder="Jane Doe" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="jane@example.com" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" name="message" placeholder="How can we help?" rows={5} required />
            </div>
            <Button type="submit" disabled={submitting} className="inline-flex items-center gap-2">
              <Send className="size-4" aria-hidden="true" />
              {submitting ? "Sending…" : "Send Message"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
