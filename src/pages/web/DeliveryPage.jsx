import { ArrowRight, CalendarDays, CheckCircle2, MapPin, Phone, Route, Truck, Wrench } from "lucide-react";
import { deliveryAssets } from "@/data/siteData";
import { Card } from "@/components/ui";
import { saveContactIntent } from "@/lib/contactIntent";
import { PublicLayout } from "./PublicLayout";

const deliveryHighlights = [
  {
    label: "Pinpoint placement",
    copy: "The custom delivery vehicle is designed to place containers in tight yards, alleys, jobsite lanes, and limited access areas.",
    icon: MapPin
  },
  {
    label: "Driver-led positioning",
    copy: "Highly skilled drivers help position the storage unit where it can be used safely and efficiently.",
    icon: Truck
  },
  {
    label: "Smarter site usage",
    copy: "The delivery system helps maximize limited space instead of leaving the container wherever a standard truck can stop.",
    icon: Route
  },
  {
    label: "Rental lifecycle support",
    copy: "Dropoffs, pickups, swaps, and service calls can be scheduled against truck and worker capacity.",
    icon: CalendarDays
  }
];

const serviceSteps = [
  "Confirm the container size, site access, and preferred placement.",
  "Schedule delivery around truck availability and customer readiness.",
  "Place the container, verify door swing, and confirm safe access.",
  "Return for pickup, relocation, swaps, or service when the rental changes."
];

const mediaCards = [
  {
    title: "Long day, careful delivery",
    copy: "Pinpoint placement helps when the access path is narrow or the usable landing area is limited.",
    image: deliveryAssets.longDay
  },
  {
    title: "Tough placement jobs",
    copy: "The right delivery rig and an experienced driver make tight jobs more practical.",
    image: deliveryAssets.toughDelivery
  }
];

export function DeliveryPage() {
  return (
    <PublicLayout>
      <section className="border-b border-border bg-hero">
        <div className="container grid gap-10 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">PinPoint Delivery</p>
            <h1 className="mt-3 max-w-xl text-4xl font-bold leading-tight text-foreground md:text-5xl">
              Put the container where the work actually happens
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
              Lassen Rents can transport and install storage containers in small spaces, helping customers get secure
              24/7 storage without wasting valuable site area.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                className="bolt-strip inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-bold text-primary-foreground transition hover:bg-primary/90"
                href="/request-quote"
                onClick={() => saveContactIntent("Delivery")}
              >
                Request delivery quote
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-border bg-white px-5 text-sm font-semibold text-foreground transition hover:bg-muted"
                href="tel:5302573865"
              >
                <Phone className="h-4 w-4" />
                530.257.3865
              </a>
            </div>
          </div>

          <Card className="overflow-hidden bg-slate-950 p-3 ring-4 ring-card/70">
            <div className="aspect-video overflow-hidden rounded-md bg-black">
              <iframe
                className="h-full w-full"
                src={deliveryAssets.videoUrl}
                title="Lassen Rents PinPoint delivery video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
            <div className="flex items-center justify-between gap-4 px-2 py-3 text-sm text-slate-300">
              <span>Watch the placement system in action</span>
              <span className="rounded-sm bg-white/10 px-2 py-1 text-xs font-semibold text-white">Video</span>
            </div>
          </Card>
        </div>
      </section>

      <section className="container py-14">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {deliveryHighlights.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.label} className="freight-card p-5 pl-7">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="mt-4 text-lg font-bold">{item.label}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.copy}</p>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="border-y border-border bg-muted/35">
        <div className="container grid gap-10 py-14 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">Delivery planning</p>
            <h2 className="mt-2 text-3xl font-bold">Built for dropoff, pickup, swaps, and service calls</h2>
            <p className="mt-4 max-w-3xl leading-7 text-muted-foreground">
              Delivery is managed like a rental fleet operation: the customer gets a clear flat dropoff and pickup fee,
              while the business schedules drivers, workers, trucks, and container readiness in one flow.
            </p>

            <div className="mt-8 grid gap-3">
              {serviceSteps.map((step, index) => (
                <Card key={step} className="flex gap-4 p-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-emerald-100 text-sm font-bold text-emerald-800">
                    {index + 1}
                  </span>
                  <p className="text-sm font-medium leading-6">{step}</p>
                </Card>
              ))}
            </div>
          </div>

          <Card className="freight-card overflow-hidden p-3 pl-5">
            <img className="h-auto w-full rounded-md object-contain" src={deliveryAssets.hero} alt="PinPoint delivery truck placing a container" />
            <div className="grid gap-3 p-4 sm:grid-cols-2">
              {["Flat dropoff fee", "Flat pickup fee", "Truck assignment", "Worker capacity"].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm font-semibold">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  {item}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      <section className="container pb-16">
        <div className="grid gap-6 lg:grid-cols-2">
          {mediaCards.map((item) => (
            <Card key={item.title} className="freight-card overflow-hidden">
              <div className="bg-slate-100 p-3">
                <img className="h-auto w-full rounded-md object-contain" src={item.image} alt={item.title} />
              </div>
              <div className="p-5">
                <h2 className="text-xl font-bold">{item.title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.copy}</p>
              </div>
            </Card>
          ))}
        </div>

        <Card className="field-surface mt-6 overflow-hidden">
          <div className="grid gap-6 p-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <div className="flex h-11 w-11 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Wrench className="h-5 w-5" />
              </div>
              <h2 className="mt-4 text-2xl font-bold">Modern delivery for real job sites</h2>
              <p className="mt-3 leading-7 text-muted-foreground">
                The original PinPoint delivery system is still the promise: careful placement, secure storage, and a
                practical plan for the full container rental lifecycle.
              </p>
            </div>
            <img
              className="h-auto w-full rounded-md object-contain"
              src={deliveryAssets.bottom}
              alt="Lassen Rents pinpoint delivery equipment"
            />
          </div>
        </Card>
      </section>
    </PublicLayout>
  );
}
