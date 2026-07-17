import { ArrowRight } from "lucide-react";
import { containerSizes } from "@/data/siteData";
import { Badge, Card } from "@/components/ui";
import { saveContactIntent } from "@/lib/contactIntent";
import { PublicLayout } from "./PublicLayout";
import { TestimonialsSection } from "./TestimonialsSection";

export function ContainersPage() {
  return (
    <PublicLayout>
      <section className="relative isolate min-h-[420px] overflow-hidden">
        <img
          className="absolute inset-0 h-full w-full object-cover object-center"
          src="/assets/container-sizes/fortyfoot.png"
          alt="40 foot storage container"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/20" />
        <div className="container relative z-10 flex min-h-[420px] flex-col justify-end py-12 lg:justify-center">
          <div className="max-w-xl text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/70">Containers</p>
            <h1 className="font-display mt-3 text-4xl leading-none tracking-wide md:text-5xl lg:text-6xl">
              Sales and month-to-month rentals
            </h1>
            <p className="mt-5 max-w-md text-lg leading-8 text-white/85">
              20 ft, 40 ft, high-cube, and refrigerated units for jobsites, retail, schools, and farms across Northeastern California.
            </p>
          </div>
        </div>
      </section>

      <section className="container py-10">
        <div className="grid gap-4 lg:grid-cols-2">
          {containerSizes.map((item) => (
            <Card key={item.label} className="freight-card overflow-hidden">
              <div className="bg-muted">
                <img className="h-36 w-full object-cover sm:h-40 lg:h-44" src={item.image} alt={`${item.label} storage container`} />
              </div>
              <div className="p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h2 className="text-base font-semibold">{item.label}</h2>
                    <p className="mt-1 text-sm font-semibold text-primary">{item.dimensions}</p>
                  </div>
                  <Badge tone={item.status === "Available" ? "success" : item.status === "Reserved" ? "warn" : "default"}>{item.status}</Badge>
                </div>
                <p className="mt-2 text-sm leading-5 text-muted-foreground">{item.description}</p>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-2xl font-bold">
                    ${item.rate}
                    <span className="text-sm font-medium text-muted-foreground">/mo stub</span>
                  </p>
                  {item.rate > 0 && (
                    <a
                      href={`/request-quote?container=${encodeURIComponent(item.label)}`}
                      onClick={() => saveContactIntent("Containers")}
                      className="bolt-strip inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-bold text-primary-foreground transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      Get quote
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>
      <TestimonialsSection />
    </PublicLayout>
  );
}
