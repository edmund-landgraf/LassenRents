import { useState } from "react";
import { CalendarDays, Container, Clock, MapPinned, Truck, X } from "lucide-react";
import { Badge, Button, Card } from "@/components/ui";
import { operations } from "@/data/siteData";
import { AdminLayout } from "./AdminLayout";

export function AdminCalendarPage() {
  const [selectedEvent, setSelectedEvent] = useState(null);
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

      <Card className="mt-4 min-w-0 overflow-hidden">
        <div className="grid min-w-0 grid-cols-7 border-b border-border bg-muted">
          {days.map((day) => (
            <div key={day} className="min-w-0 border-r border-border p-2 last:border-r-0 md:p-3">
              <p className="text-sm font-semibold">{day}</p>
            </div>
          ))}
        </div>
        <div className="grid min-h-[560px] min-w-0 grid-cols-7">
          {days.map((day) => {
            const events = operations.calendarLayers.filter((event) => event.date === day);
            return (
              <div key={day} className="min-w-0 border-r border-border p-2 last:border-r-0 md:p-3">
                <div className="space-y-3">
                  {events.map((event) => (
                    <button
                      key={`${event.date}-${event.time}-${event.asset}`}
                      className="block w-full min-w-0 rounded-md border border-border bg-card p-2 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:p-3"
                      type="button"
                      onClick={() => setSelectedEvent(event)}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <Badge tone={event.tone}>{event.layer}</Badge>
                        <span className="text-xs text-muted-foreground">{event.time}</span>
                      </div>
                      <p className="mt-2 text-sm font-semibold">{event.title}</p>
                      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{event.address}</p>
                      <p className="mt-1 text-xs text-muted-foreground">Asset: {event.asset}</p>
                      <p className="mt-1 text-xs text-muted-foreground">Truck: {event.truck}</p>
                    </button>
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

      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-5 py-8 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-lg border border-border bg-card text-card-foreground shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">Calendar Detail</p>
                <h2 className="mt-1 text-2xl font-bold">{selectedEvent.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">Single-click calendar event details.</p>
              </div>
              <button
                className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                type="button"
                onClick={() => setSelectedEvent(null)}
                aria-label="Close calendar detail"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-4 px-6 py-5">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone={selectedEvent.tone}>{selectedEvent.layer}</Badge>
                <Badge>{selectedEvent.date}</Badge>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-md border border-border p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                    <Clock className="h-4 w-4 text-primary" />
                    Time
                  </div>
                  <p className="mt-2 font-semibold">{selectedEvent.time}</p>
                </div>
                <div className="rounded-md border border-border p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                    <MapPinned className="h-4 w-4 text-primary" />
                    Address
                  </div>
                  <p className="mt-2 font-semibold">{selectedEvent.address}</p>
                </div>
                <div className="rounded-md border border-border p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                    <Container className="h-4 w-4 text-primary" />
                    Asset
                  </div>
                  <p className="mt-2 font-semibold">{selectedEvent.asset}</p>
                </div>
                <div className="rounded-md border border-border p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                    <Truck className="h-4 w-4 text-primary" />
                    Truck
                  </div>
                  <p className="mt-2 font-semibold">{selectedEvent.truck}</p>
                </div>
              </div>

              <div className="rounded-md border border-border bg-muted p-4">
                <p className="text-sm font-semibold text-muted-foreground">Driver note</p>
                <p className="mt-2 text-sm">{selectedEvent.driverNote}</p>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
                <Button type="button" variant="outline" onClick={() => setSelectedEvent(null)}>
                  Close
                </Button>
                <Button type="button" onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedEvent.address)}`, "_blank", "noopener,noreferrer")}>
                  Open in maps
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
