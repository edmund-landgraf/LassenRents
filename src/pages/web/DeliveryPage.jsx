import { Truck } from "lucide-react";
import { legacyAssets } from "@/data/siteData";
import { Card } from "@/components/ui";
import { PublicLayout } from "./PublicLayout";

export function DeliveryPage() {
  return (
    <PublicLayout>
      <section className="container py-16">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">PinPoint Delivery</p>
            <h1 className="mt-2 text-4xl font-bold">Placement for small spaces</h1>
            <p className="mt-4 text-muted-foreground">
              The custom delivery vehicle is designed to transport and install containers in limited areas. Drivers schedule dropoffs, pickups, swaps, and service jobs against truck and worker capacity.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {["Flat dropoff fee", "Flat pickup fee", "Dispatch schedule", "Worker and truck assignment"].map((item) => (
                <Card key={item} className="flex items-center gap-2 p-3 text-sm font-medium">
                  <Truck className="h-4 w-4 text-primary" />
                  {item}
                </Card>
              ))}
            </div>
          </div>
          <div className="flex min-h-80 items-center rounded-lg border border-border bg-white p-3 shadow-soft">
            <img className="h-auto w-full object-contain" src={legacyAssets.delivery} alt="Pinpoint container delivery system" />
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
