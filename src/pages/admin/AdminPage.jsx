import { ArrowRight, PackageCheck, Plus, ReceiptText, Users } from "lucide-react";
import { Badge, Button, Card } from "@/components/ui";
import { operations } from "@/data/siteData";
import { AdminLayout } from "./AdminLayout";

export function AdminPage() {
  const modules = [
    { title: "Container Inventory", href: "/admin/inventory", copy: "Manage fleet states, due backs, commitments, book value, depreciation, and utilization." },
    { title: "Truck Capability", href: "/admin/trucks", copy: "See which trucks can haul 20 ft, 40 ft, high-cube, standard-height, or service-only jobs." },
    { title: "Layered Calendar", href: "/admin/calendar", copy: "Graphical calendar with dropoffs, pickups, due backs, commitments, maintenance, workers, and trucks." },
    { title: "Tax Export", href: "/admin/tax-export", copy: "Stage Quicken CSV rows for revenue, depreciation, repairs, mileage, and expenses." }
  ];

  return (
    <AdminLayout>
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Operations Backend</p>
          <h1 className="mt-2 text-3xl font-bold">Rental fleet command center</h1>
          <p className="mt-3 max-w-3xl text-muted-foreground">
            Dashboard-level overview for rentals, dispatch, maintenance, and receivables. Deeper fleet tools live on their own backend pages.
          </p>
        </div>
        <Button variant="outline">
          <Users className="h-4 w-4" />
          New rental
        </Button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {operations.metrics.map((metric) => (
          <Card key={metric.label} className="p-5">
            <metric.icon className="h-5 w-5 text-primary" />
            <p className="mt-4 text-3xl font-bold">{metric.value}</p>
            <p className="text-sm text-muted-foreground">{metric.label}</p>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {modules.map((module) => (
          <a key={module.href} href={module.href}>
            <Card className="h-full p-5 transition hover:-translate-y-0.5 hover:border-primary/40">
              <h2 className="font-semibold">{module.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{module.copy}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                Open page
                <ArrowRight className="h-4 w-4" />
              </span>
            </Card>
          </a>
        ))}
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[1.1fr_.9fr]">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Today's Dispatch</h2>
            <PackageCheck className="h-5 w-5 text-primary" />
          </div>
          <div className="mt-3 space-y-3">
            {operations.dispatch.map((job) => (
              <div key={`${job.type}-${job.customer}`} className="rounded-md border border-border p-3">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{job.type}</p>
                  <span className="text-sm text-muted-foreground">{job.time}</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{job.customer} - {job.truck} - {job.worker}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Maintenance</h2>
            <ReceiptText className="h-5 w-5 text-primary" />
          </div>
          <div className="mt-3 space-y-3">
            {operations.maintenance.map((item) => (
              <div key={item.container} className="flex items-start justify-between gap-4 text-sm">
                <div>
                  <p className="font-medium">{item.container}</p>
                  <p className="text-muted-foreground">{item.issue}</p>
                </div>
                <Badge tone="warn">{item.age}</Badge>
              </div>
            ))}
          </div>
          <div className="mt-5 border-t border-border pt-5">
            <Button>
              <Plus className="h-4 w-4" />
              Add work order
            </Button>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
