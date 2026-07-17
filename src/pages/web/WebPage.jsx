import { ArrowRight, Phone } from "lucide-react";
import { homeProofShots, legacyAssets } from "@/data/siteData";
import { saveContactIntent } from "@/lib/contactIntent";
import { PublicLayout } from "./PublicLayout";

function Hero() {
  return (
    <section className="hero-bleed relative isolate overflow-hidden">
      <img
        className="hero-bleed__media absolute inset-0 h-full w-full object-cover"
        src={legacyAssets.header}
        alt="Lassen Rents trucking and container yard"
      />
      <div className="hero-bleed__scrim absolute inset-0" />

      <div className="container relative z-10 flex min-h-[inherit] flex-col justify-end pb-14 pt-28 sm:pb-16 sm:pt-32 lg:justify-center lg:pb-20 lg:pt-24">
        <div className="max-w-xl text-white">
          <p className="reveal-up font-display text-5xl leading-none tracking-wide sm:text-6xl lg:text-7xl">Lassen Rents</p>
          <p className="reveal-up-delay mt-5 max-w-md text-lg leading-relaxed text-white/85 sm:text-xl">
            Onsite container rental and sales with PinPoint delivery across Lassen, Plumas, and Modoc Counties.
          </p>
          <div className="reveal-up-delay-2 mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="/request-quote"
              onClick={() => saveContactIntent("Containers")}
              className="bolt-strip inline-flex h-12 items-center justify-center gap-2 rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-lg transition duration-300 hover:-translate-y-0.5 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            >
              Request a quote
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="tel:15302573865"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-white/35 bg-white/10 px-6 text-sm font-semibold text-white backdrop-blur-sm transition duration-300 hover:bg-white/18 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            >
              <Phone className="h-4 w-4" />
              530.257.3865
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProofStrip() {
  return (
    <section className="proof-strip border-b border-border bg-card">
      <div className="container py-14 sm:py-16">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl text-foreground sm:text-4xl">Built for the yard, not the brochure</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground sm:text-lg">
            Real delivery, trucking, and container work from a locally owned Susanville operator.
          </p>
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {homeProofShots.map((shot) => (
            <a key={shot.href} href={shot.href} className="group relative block overflow-hidden bg-muted">
              <div className="aspect-[4/3] overflow-hidden">
                <img className="h-full w-full object-cover" src={shot.src} alt={shot.alt} />
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-4 pb-4 pt-12">
                <span className="font-display text-lg tracking-wide text-white">{shot.label}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceOverview() {
  const services = [
    { title: "Containers", href: "/containers", copy: "Month-to-month rentals, sales, 20 ft, 40 ft, high cube, and refrigerated units." },
    { title: "Options", href: "/options", copy: "Shelving, pipe racks, office conversions, doors, windows, vents, and AC." },
    { title: "Delivery", href: "/delivery", copy: "PinPoint delivery and pickup for tight spaces with flat delivery and pickup fees." },
    { title: "Trucking", href: "/trucking", copy: "Container movement, relocation, hauling, and local trucking support." }
  ];

  return (
    <section className="container py-14 sm:py-16">
      <div className="max-w-2xl">
        <h2 className="font-display text-3xl text-foreground sm:text-4xl">What we do</h2>
        <p className="mt-3 text-base leading-7 text-muted-foreground sm:text-lg">
          One local team for storage, setup, modifications, and the trucks that move them.
        </p>
      </div>
      <ul className="mt-10 divide-y divide-border border-y border-border">
        {services.map((service) => (
          <li key={service.title}>
            <a
              href={service.href}
              className="group grid gap-2 py-6 transition sm:grid-cols-[10rem_1fr_auto] sm:items-center sm:gap-8"
            >
              <span className="font-display text-2xl tracking-wide text-foreground group-hover:text-primary">{service.title}</span>
              <span className="text-base leading-7 text-muted-foreground">{service.copy}</span>
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                View
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function WebPage() {
  return (
    <PublicLayout>
      <Hero />
      <ProofStrip />
      <ServiceOverview />
    </PublicLayout>
  );
}
