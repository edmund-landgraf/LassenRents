import { ArrowRight, Check, CreditCard, ShieldCheck } from "lucide-react";
import { Badge, Card } from "@/components/ui";
import { legacyAssets } from "@/data/siteData";
import { saveContactIntent } from "@/lib/contactIntent";
import { PublicLayout } from "./PublicLayout";

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-hero">
      <div className="pointer-events-none absolute right-0 top-14 hidden h-24 w-52 border-y-4 border-primary/15 opacity-80 lg:block" />
      <div className="pointer-events-none absolute bottom-10 left-0 hidden h-16 w-40 border-y-4 border-primary/15 bg-primary/5 lg:block" />
      <div className="container grid min-h-[620px] items-center gap-10 py-12 lg:grid-cols-[1.02fr_.98fr]">
        <div className="max-w-2xl">
          <Badge tone="success">Serving Lassen, Plumas, and Modoc Counties</Badge>
          <h1 className="mt-5 max-w-xl text-4xl font-black leading-tight text-foreground sm:text-5xl lg:text-6xl">Lassen Rents</h1>
          <p className="mt-5 text-xl leading-8 text-muted-foreground">
            Onsite storage container rental, sales, pinpoint delivery, modifications, and trucking from a locally owned Susanville operator.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="/request-quote"
              onClick={() => saveContactIntent("Containers")}
              className="bolt-strip inline-flex h-12 items-center justify-center gap-2 rounded-md border border-primary/20 bg-primary px-5 text-sm font-bold text-primary-foreground shadow-sm transition hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Request a container
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="/portal/login"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-border bg-background px-5 text-sm font-semibold text-foreground transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <CreditCard className="h-4 w-4" />
              Client payment portal
            </a>
          </div>
          <div className="mt-8 grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
            {["20' and 40' specialists", "Tilt trailer delivery", "No hidden costs"].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-700" />
                {item}
              </div>
            ))}
          </div>
        </div>
        <div className="relative">
          <div className="absolute -right-4 -top-4 h-24 w-24 rounded-sm border-8 border-primary/20" />
          <div className="absolute -bottom-3 left-6 right-6 h-5 rounded-sm bg-primary/20 blur-sm" />
          <img className="relative aspect-[4/3] w-full rounded-md border-4 border-card object-cover shadow-soft" src={legacyAssets.header} alt="Lassen Rents storage containers" />
          <Card className="freight-card absolute bottom-4 left-4 right-4 border-primary/20 p-4 pl-6 sm:left-auto sm:w-72">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-1 h-5 w-5 text-emerald-700" />
              <div>
                <p className="font-semibold">Secure ground-level storage</p>
                <p className="mt-1 text-sm text-muted-foreground">Delivered and set up for immediate temporary or permanent use.</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}

function ServiceOverview() {
  const services = [
    { title: "Containers", href: "/containers", copy: "Month-to-month rentals, sales, 20 ft, 40 ft, high cube, and refrigerated units." },
    { title: "Options", href: "/options", copy: "Shelving, pipe racks, custom brackets, office conversions, doors, windows, vents, and AC." },
    { title: "Delivery", href: "/delivery", copy: "PinPoint delivery and pickup for tight spaces with flat delivery and pickup fees." },
    { title: "Trucking", href: "/trucking", copy: "Container movement, relocation, hauling, and local trucking support." }
  ];

  return (
    <section className="container py-16">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">Services</p>
        <h2 className="mt-2 text-3xl font-bold">Pick the part of the operation you need</h2>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {services.map((service) => (
          <a key={service.title} href={service.href}>
            <Card className="freight-card h-full p-5 pl-7 transition hover:-translate-y-0.5 hover:border-primary/40">
              <h3 className="font-semibold">{service.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{service.copy}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                View page
                <ArrowRight className="h-4 w-4" />
              </span>
            </Card>
          </a>
        ))}
      </div>
    </section>
  );
}

export function WebPage() {
  return (
    <PublicLayout>
      <Hero />
      <ServiceOverview />
    </PublicLayout>
  );
}
