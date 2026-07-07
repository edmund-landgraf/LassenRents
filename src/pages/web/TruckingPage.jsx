import { ArrowRight } from "lucide-react";
import { legacyAssets } from "@/data/siteData";
import { PublicLayout } from "./PublicLayout";

export function TruckingPage() {
  return (
    <PublicLayout>
      <section className="border-b border-border bg-muted/30 py-16">
        <div className="container grid gap-8 lg:grid-cols-[.85fr_1.15fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">Trucking</p>
            <h1 className="mt-2 text-4xl font-bold">Dedicated trucking and relocation service</h1>
            <p className="mt-4 text-muted-foreground">The legacy trucking page is preserved as a gallery-led service area for hauling, relocating, hay and equipment support, and container movement.</p>
            <a
              href="/gallery"
              className="mt-6 inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              View photo gallery
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
          <img className="h-80 w-full rounded-lg object-cover" src={legacyAssets.trucking} alt="Lassen Rents trucking service" />
        </div>
      </section>
    </PublicLayout>
  );
}
