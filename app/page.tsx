import { Hero } from "@/components/site/hero"
import { UploadPanelAdvanced } from "@/components/site/upload-panel-advanced"
import { Features } from "@/components/site/features"
import { Testimonials } from "@/components/site/testimonials"

export default function HomePage() {
  return (
    <div className="space-y-20 md:space-y-32">
      <Hero />

      <section id="convert" className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">
            <span className="text-brand-gradient">Ready to Convert?</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Upload your file and start converting with advanced options including trimming, presets, editing tools, and more.
          </p>
        </div>
        <UploadPanelAdvanced />
      </section>

      <section id="tools" className="container mx-auto px-4">
        <Features />
      </section>

      <section id="testimonials" className="container mx-auto px-4 pb-20">
        <Testimonials />
      </section>
    </div>
  )
}
