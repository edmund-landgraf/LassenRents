import { CalendarDays } from "lucide-react";
import { Badge, Card } from "@/components/ui";
import { operations } from "@/data/siteData";
import { AdminLayout } from "./AdminLayout";

export function AdminCalendarPage() {
  const days = ["Jul 7", "Jul 8", "Jul 9", "Jul 10", "Jul 11", "Jul 12", "Jul 13"];
  const layers = ["Dropoff", "Pickup", "Due back", "Committed", "Maintenance"];

  return (
    <AdminLayout>
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">Schedule</p>
        <h1 className="mt-2 text-3xl font-bold">Layered Calendar</h1>
        <p className="mt-3 max-w-3xl text-muted-foreground">Graphical week view with dispatch, pickup, due-back, committed inventory, truck, worker, and maintenance layers.</p>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {layers.map((layer) => (
          <Badge key={layer} tone={layer === "Maintenance" ? "danger" : layer === "Dropoff" ? "success" : layer === "Pickup" || layer === "Due back" ? "warn" : "default"}>
            {layer}
          </Badge>
        ))}
      </div>

      <Card className="mt-4 overflow-hidden">
        <div className="grid min-w-[980px] grid-cols-7 border-b border-border bg-muted">
          {days.map((day) => (
            <div key={day} className="border-r border-border p-3 last:border-r-0">
              <p className="text-sm font-semibold">{day}</p>
            </div>
          ))}
        </div>
        <div className="grid min-h-[560px] min-w-[980px] grid-cols-7">
          {days.map((day) => {
            const events = operations.calendarLayers.filter((event) => event.date === day);
            return (
              <div key={day} className="border-r border-border p-3 last:border-r-0">
                <div className="space-y-3">
                  {events.map((event) => (
                    <div key={`${event.date}-${event.time}-${event.asset}`} className="rounded-md border border-border bg-card p-3 shadow-sm">
                      <div className="flex items-center justify-between gap-2">
                        <Badge tone={event.tone}>{event.layer}</Badge>
                        <span className="text-xs text-muted-foreground">{event.time}</span>
                      </div>
                      <p className="mt-2 text-sm font-semibold">{event.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">Asset: {event.asset}</p>
                      <p className="mt-1 text-xs text-muted-foreground">Truck: {event.truck}</p>
                    </div>
                  ))}
                  {!events.length && (
                    <div className="flex h-28 items-center justify-center rounded-md border border-dashed border-border text-xs text-muted-foreground">
                      No scheduled layers
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card className="mt-5 p-5">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-primary" />
          <h2 className="font-semibold">Calendar layers</h2>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          This view is intentionally visual first; the next backend step would be toggles for workers, trucks, locations, container length, and high-cube capability.
        </p>
      </Card>
    </AdminLayout>
  );
}
