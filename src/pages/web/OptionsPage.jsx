import { useState } from "react";
import { ArrowRight, Bike, Boxes, CheckCircle2, ClipboardList, Settings2 } from "lucide-react";
import { Card } from "@/components/ui";
import { legacyAssets, modificationOptions } from "@/data/siteData";
import { saveContactIntent } from "@/lib/contactIntent";
import { PublicLayout } from "./PublicLayout";

export function OptionsPage() {
  const [selectedModification, setSelectedModification] = useState(modificationOptions[0]);

  const accessorySections = [
    {
      title: "Shelving",
      kicker: "Organized container storage",
      icon: Boxes,
      image: legacyAssets.shelving,
      imageAlt: "Container shelving accessory",
      summary: "Shelving can help organize a container for storage, keeping valuable floor space clear and inventory easier to reach.",
      bullets: [
        "No more mess piled in the middle of the floor",
        "Optimize your storage space without relying on boxes and packing material",
        "1,100 lbs rating per bracket",
        "Quick and easy install",
        "Shelves in 6 sizes",
        "Create shelves in virtually any length in minutes"
      ]
    },
    {
      title: "Pipe racks",
      kicker: "Long material storage",
      icon: ClipboardList,
      image: "https://lassenrents.com/wp-content/uploads/2013/10/piperacks.jpg",
      imageAlt: "Pipe rack brackets for container storage",
      summary: "Pipe racks make organization simple for pipe, conduit, lumber, rails, and other long materials that should stay visible and off the floor.",
      bullets: [
        "Keeps your product out of the dirt",
        "Keeps pipe from taking up floor space",
        "Easy identification of inventory",
        "Prevents injury from walking on pipe",
        "Stores any long items",
        "1,000 lbs rating per bracket",
        "Quick and easy to install",
        "Four and five arm pipe racks",
        "All brackets can mount inside and outside your container"
      ]
    },
    {
      title: "Apparel, bike, and file storage racks",
      kicker: "Special-purpose brackets",
      icon: Bike,
      image: "https://lassenrents.com/wp-content/uploads/2013/10/bikeracks.jpg",
      imageAlt: "Bike and apparel rack brackets",
      summary: "Custom bracket systems turn a plain container into organized storage for retail, event, office, and equipment workflows.",
      bullets: ["Apparel and bike racks", "File storage system brackets", "Custom brackets designed to fit your needs"]
    }
  ];

  return (
    <PublicLayout>
      <section className="border-b border-border bg-muted/45 py-14">
        <div className="container">
          <div className="grid gap-8 lg:grid-cols-[.85fr_1.15fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-primary">Options & Accessories</p>
              <h1 className="mt-2 text-4xl font-bold">Organization and custom container upgrades</h1>
              <p className="mt-4 max-w-2xl text-muted-foreground">
                Add shelves, racks, brackets, and container modifications so the rental works like a small warehouse instead of a big empty box.
              </p>
              <a
                href="/request-quote"
                onClick={() => saveContactIntent("Accessories")}
                className="mt-6 inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Ask about accessories
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
            <img className="h-72 w-full rounded-lg border border-border object-cover shadow-soft" src={legacyAssets.modifications} alt="Modified storage container office interior" />
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container space-y-6">
          {accessorySections.map((section, index) => (
            <Card key={section.title} className="overflow-hidden">
              <div className={`grid gap-0 lg:grid-cols-2 ${index % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""}`}>
                <div className="min-h-72 bg-muted">
                  <img className="h-full min-h-72 w-full object-cover" src={section.image} alt={section.imageAlt} />
                </div>
                <div className="p-6 md:p-8">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <section.icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-primary">{section.kicker}</p>
                      <h2 className="text-2xl font-bold">{section.title}</h2>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-muted-foreground">{section.summary}</p>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {section.bullets.map((bullet) => (
                      <div key={bullet} className="flex items-start gap-2 text-sm leading-6">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span>{bullet}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}

          <section className="space-y-5 pt-4">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-primary">Container modifications</p>
                <h2 className="mt-2 text-3xl font-bold">Six ways to make the container fit the job</h2>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
                  Every shipping container can be custom engineered and modified to suit your needs. The variations and uses are endless.
                </p>
              </div>
              <a
                href="/request-quote"
                onClick={() => saveContactIntent("Modifications")}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Ask about modifications
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            <Card className="overflow-hidden">
              <div className="grid gap-0 lg:grid-cols-[1.1fr_.9fr]">
                <div className="flex min-h-[260px] items-center bg-white p-4 sm:min-h-[300px]">
                  <img
                    className="max-h-[360px] w-full object-contain"
                    src={selectedModification.image}
                    alt={`${selectedModification.label} container modification`}
                  />
                </div>
                <div className="p-6 md:p-8">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <Settings2 className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-primary">Selected modification</p>
                      <h3 className="text-2xl font-bold">{selectedModification.label}</h3>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-muted-foreground">{selectedModification.summary}</p>
                  <div className="mt-6 space-y-3">
                    {selectedModification.details.map((detail) => (
                      <p key={detail} className="flex items-start gap-2 text-sm leading-6">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        {detail}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {modificationOptions.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  className={`overflow-hidden rounded-lg border bg-card text-left shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg ${
                    selectedModification.label === item.label ? "border-primary ring-2 ring-primary/20" : "border-border"
                  }`}
                  onClick={() => setSelectedModification(item)}
                >
                  <div className="flex aspect-[16/5] items-center bg-white p-2">
                    <img className="h-full w-full object-contain" src={item.image} alt={`${item.label} modification`} />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold">{item.label}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.summary}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        </div>
      </section>
    </PublicLayout>
  );
}
