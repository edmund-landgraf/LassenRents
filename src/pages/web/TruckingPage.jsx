import { ArrowRight, CheckCircle2, MapPinned, PackageCheck, Route, Truck } from "lucide-react";
import { Badge, Card } from "@/components/ui";
import { truckingAssets } from "@/data/siteData";
import { saveContactIntent } from "@/lib/contactIntent";
import { PublicLayout } from "./PublicLayout";

const serviceCards = [
  {
    title: "Container relocation",
    copy: "Move containers between jobsites, yards, ranches, schools, and commercial properties when plans change.",
    icon: Route
  },
  {
    title: "Hay and material hauling",
    copy: "The original trucking service includes agricultural hauling and practical bulk transport support.",
    icon: PackageCheck
  },
  {
    title: "20 and 40 ft container support",
    copy: "Lassen Rents specializes in onsite storage containers with trucking matched to the length and site access.",
    icon: Truck
  },
  {
    title: "Regional service area",
    copy: "Serving Lassen, Plumas, and Modoc Counties with local routing knowledge and prompt scheduling.",
    icon: MapPinned
  }
];

const promises = ["Prompt, friendly service", "Locally owned and operated", "No hidden costs", "Tilt trailer delivery and pickup"];

export function TruckingPage() {
  const hero = truckingAssets[0];
  const featured = truckingAssets.slice(1, 4);
  const gallery = truckingAssets.slice(4);

  return (
    <PublicLayout>
      <section className="border-b border-border bg-slate-50">
        <div className="container grid gap-10 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">Trucking</p>
            <h1 className="mt-3 max-w-2xl text-4xl font-bold leading-tight md:text-5xl">Container moves, relocation, and regional hauling</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
              Lassen Rents supports storage container delivery, pickup, relocation, hay hauling, and equipment movement
              across Lassen, Plumas, and Modoc Counties.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="/request-quote"
                onClick={() => saveContactIntent("Trucking")}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Ask about trucking
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="/gallery"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-border bg-white px-5 text-sm font-semibold text-foreground transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                View photo gallery
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          <Card className="overflow-hidden p-3">
            <div className="flex min-h-80 items-center bg-white">
              <img className="h-auto w-full rounded-md object-contain" src={hero.image} alt={hero.title} />
            </div>
            <div className="flex items-center justify-between gap-4 p-4">
              <div>
                <h2 className="font-bold">{hero.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{hero.summary}</p>
              </div>
              <Badge>Fleet</Badge>
            </div>
          </Card>
        </div>
      </section>

      <section className="container py-14">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {serviceCards.map((service) => {
            const Icon = service.icon;
            return (
              <Card key={service.title} className="p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="mt-4 text-lg font-bold">{service.title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{service.copy}</p>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="border-y border-border bg-white">
        <div className="container grid gap-8 py-14 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">Original services preserved</p>
            <h2 className="mt-2 text-3xl font-bold">Relocating, hay hauling, and container trucking</h2>
            <p className="mt-4 leading-7 text-muted-foreground">
              The legacy page showed real trucking work instead of a long sales pitch. This version keeps that visual
              proof and adds clearer service labels so customers can understand what to ask for.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {promises.map((promise) => (
                <div key={promise} className="flex items-center gap-2 text-sm font-semibold">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  {promise}
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {featured.map((item) => (
              <Card key={item.title} className="overflow-hidden">
                <div className="flex aspect-[4/3] items-center bg-white p-3">
                  <img className="max-h-full w-full object-contain" src={item.image} alt={item.title} />
                </div>
                <div className="p-4">
                  <h3 className="font-bold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.summary}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-14">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">Trucking photos</p>
            <h2 className="mt-2 text-3xl font-bold">More work from the original page</h2>
          </div>
          <a className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline" href="/request-quote" onClick={() => saveContactIntent("Trucking")}>
            Request trucking quote <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {gallery.map((item) => (
            <Card key={item.title} className="overflow-hidden">
              <div className="flex aspect-[4/3] items-center bg-white p-3">
                <img className="max-h-full w-full object-contain" src={item.image} alt={item.title} loading="lazy" />
              </div>
              <div className="p-4">
                <h3 className="font-bold">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.summary}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </PublicLayout>
  );
}
