import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"

export default function PricingPage() {
  return (
    <div className="container mx-auto px-4 py-10 md:py-16">
      <header className="text-center max-w-2xl mx-auto mb-10">
        <h1 className="text-3xl md:text-5xl font-semibold text-balance text-brand-gradient">Simple Pricing</h1>
        <p className="text-muted-foreground mt-3">Choose the plan that fits your conversion needs.</p>
      </header>

      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <Card className="backdrop-blur bg-card/80 rounded-2xl shadow-brand-lg">
          <CardHeader>
            <CardTitle>Free</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <ul className="list-disc pl-5 text-sm leading-relaxed">
              <li>Basic formats</li>
              <li>Max file size: 100MB</li>
              <li>Standard speed</li>
              <li>No signup required</li>
            </ul>
            <Button asChild className="mt-2">
              <Link href="/#convert">Get Started</Link>
            </Button>
          </CardContent>
        </Card>

        <div className="rounded-2xl p-[1px] bg-brand-strong">
          <Card className="rounded-2xl backdrop-blur bg-card/90 shadow-brand-lg">
            <CardHeader>
              <CardTitle>Premium</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <ul className="list-disc pl-5 text-sm leading-relaxed">
                <li>All formats unlocked</li>
                <li>Max file size: 5GB</li>
                <li>Priority speed</li>
                <li>Batch conversions</li>
                <li>Priority support</li>
              </ul>
              <Button variant="default" className="mt-2 btn-dark hover-brand-gradient hover-glow" asChild>
                <Link href="/contact">Contact Sales</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="backdrop-blur bg-card/80">
        <CardHeader>
          <CardTitle>Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Feature</TableHead>
                <TableHead>Free</TableHead>
                <TableHead>Premium</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Formats</TableCell>
                <TableCell>Popular only</TableCell>
                <TableCell>All</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Max File Size</TableCell>
                <TableCell>100MB</TableCell>
                <TableCell>5GB</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Speed</TableCell>
                <TableCell>Standard</TableCell>
                <TableCell>Priority</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Batch</TableCell>
                <TableCell>—</TableCell>
                <TableCell>✔</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Support</TableCell>
                <TableCell>Community</TableCell>
                <TableCell>Priority</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
