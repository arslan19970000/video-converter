import { Hero } from "@/components/site/hero"
import { UploadPanel } from "@/components/site/upload-panel"
import { Features } from "@/components/site/features"
import { Testimonials } from "@/components/site/testimonials"

export default function HomePage() {
  return (
    <>
      <Hero />
      <section id="convert" className="container mx-auto px-4 py-8 md:py-12">
        <UploadPanel />
      </section>
      <section id="tools" className="container mx-auto px-4 py-12 md:py-16">
        <Features />
      </section>
      <section id="testimonials" className="container mx-auto px-4 py-12 md:py-16">
        <Testimonials />
      </section>
    </>
  )
}
