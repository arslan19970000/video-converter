import { Hero } from "@/components/site/hero"
import { ToolsGrid } from "@/components/site/tools-grid"
import { Features } from "@/components/site/features"
import { Testimonials } from "@/components/site/testimonials"

export default function HomePage() {
  return (
    <div className="space-y-20 md:space-y-32">
      <Hero />

      <section id="tools" className="container mx-auto px-4">
        <ToolsGrid />
      </section>

      <section id="features" className="container mx-auto px-4">
        <Features />
      </section>

      <section id="testimonials" className="container mx-auto px-4 pb-20">
        <Testimonials />
      </section>
    </div>
  )
}
