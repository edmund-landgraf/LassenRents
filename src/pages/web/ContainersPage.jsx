import { ArrowRight } from "lucide-react";
import { containerSizes, legacyAssets } from "@/data/siteData";
import { Badge, Card } from "@/components/ui";
import { saveContactIntent } from "@/lib/contactIntent";
import { PublicLayout } from "./PublicLayout";
import { TestimonialsSection } from "./TestimonialsSection";

export function ContainersPage() {
  return (
    <PublicLayout>
      <section className="border-b border-border bg-muted/30 py-14">
        <div className="container grid gap-8 lg:grid-cols-[.9fr_1.1fr] lg:items-end">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">Containers</p>
            <h1 className="mt-2 text-4xl font-bold">Sales and month-to-month rentals</h1>
            <p className="mt-4 text-muted-foreground">
              As the largest container dealer in Northeastern California, Lassen Rents can find the perfect container for your needs at a great price.
            </p>
            <p className="mt-3 text-muted-foreground">
              Choose from compact storage, standard 20 and 40 foot containers, high-cube models with extra headroom, and refrigerated storage when cold space is needed.
            </p>
          </div>
          <img className="h-72 w-full rounded-lg border border-border object-cover shadow-soft" src={legacyAssets.refrigerated} alt="Refrigerated storage container" />
        </div>
      </section>

      <section className="container py-12">
        <div className="grid gap-5 lg:grid-cols-2">
          {containerSizes.map((item) => (
            <Card key={item.label} className="overflow-hidden">
              <div className="bg-muted">
                <img className="aspect-[2.35/1] w-full object-cover" src={item.image} alt={`${item.label} storage container`} />
              </div>
              <div className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold">{item.label}</h2>
                    <p className="mt-1 text-sm font-semibold text-primary">{item.dimensions}</p>
                  </div>
                  <Badge tone={item.status === "Available" ? "success" : item.status === "Reserved" ? "warn" : "default"}>{item.status}</Badge>
                </div>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.description}</p>
                <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                  <p className="text-2xl font-bold">
                    ${item.rate}
                    <span className="text-sm font-medium text-muted-foreground">/mo stub</span>
                  </p>
                  {item.rate > 0 && (
                    <a
                      href={`/request-quote?container=${encodeURIComponent(item.label)}`}
                      onClick={() => saveContactIntent("Containers")}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
