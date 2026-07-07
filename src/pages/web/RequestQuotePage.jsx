import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import { Button, Card } from "@/components/ui";
import { containerSizes } from "@/data/siteData";
import { PublicLayout } from "./PublicLayout";

export function RequestQuotePage() {
  const selectedContainer = new URLSearchParams(window.location.search).get("container") || "20 ft";

  return (
    <PublicLayout>
      <section className="container py-16">
        <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">Request Quote</p>
            <h1 className="mt-2 text-4xl font-bold">Get container pricing for your site</h1>
            <p className="mt-4 text-muted-foreground">
              Tell Lassen Rents what size container you need, where it is going, and when you want it delivered. The office can confirm availability, delivery, pickup, and rental pricing.
            </p>
            <Card className="mt-6 p-5">
              <h2 className="font-semibold">Contact Lassen Rents</h2>
              <div className="mt-4 grid gap-3 text-sm text-muted-foreground">
                <a className="flex items-center gap-2 hover:text-foreground" href="tel:15302573865">
                  <Phone className="h-4 w-4 text-primary" />
                  530.257.3865
                </a>
                <a className="flex items-center gap-2 hover:text-foreground" href="mailto:lassenrents@gmail.com">
                  <Mail className="h-4 w-4 text-primary" />
                  lassenrents@gmail.com
                </a>
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  Serving Lassen, Plumas, and Modoc Counties
                </p>
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <div className="grid gap-5">
              <label className="grid gap-2 text-sm font-medium">
                Container type
                <select className="h-11 rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring" defaultValue={selectedContainer}>
                  {containerSizes.map((container) => (
                    <option key={container.label} value={container.label}>
                      {container.label} - ${container.rate}/mo stub
                    </option>
                  ))}
                </select>
              </label>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2 text-sm font-medium">
                  Name
                  <input className="h-11 rounded-md border border-input px-3 text-sm outline-none focus:ring-2 focus:ring-ring" placeholder="Your name" />
                </label>
                <label className="grid gap-2 text-sm font-medium">
                  Company
                  <input className="h-11 rounded-md border border-input px-3 text-sm outline-none focus:ring-2 focus:ring-ring" placeholder="Optional" />
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2 text-sm font-medium">
                  Phone
                  <input className="h-11 rounded-md border border-input px-3 text-sm outline-none focus:ring-2 focus:ring-ring" placeholder="530.257.3865" />
                </label>
                <label className="grid gap-2 text-sm font-medium">
                  Email
                  <input className="h-11 rounded-md border border-input px-3 text-sm outline-none focus:ring-2 focus:ring-ring" placeholder="you@example.com" type="email" />
                </label>
              </div>

              <label className="grid gap-2 text-sm font-medium">
                Delivery address
                <input className="h-11 rounded-md border border-input px-3 text-sm outline-none focus:ring-2 focus:ring-ring" placeholder="Street, city, county" />
              </label>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2 text-sm font-medium">
                  Desired delivery date
                  <input className="h-11 rounded-md border border-input px-3 text-sm outline-none focus:ring-2 focus:ring-ring" type="date" />
                </label>
                <label className="grid gap-2 text-sm font-medium">
                  Rental duration
                  <select className="h-11 rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring" defaultValue="month-to-month">
                    <option value="month-to-month">Month-to-month</option>
                    <option value="1-month">About 1 month</option>
                    <option value="3-months">About 3 months</option>
                    <option value="6-months">6+ months</option>
                    <option value="purchase">Interested in purchase</option>
                  </select>
                </label>
              </div>

              <label className="grid gap-2 text-sm font-medium">
                Notes
                <textarea className="min-h-28 rounded-md border border-input px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" placeholder="Gate access, tight placement, surface type, delivery details, or questions." />
              </label>

              <Button className="h-11 justify-self-start">
                Submit quote request
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        </div>
      </section>
    </PublicLayout>
  );
}
