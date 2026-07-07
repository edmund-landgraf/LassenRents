import { Plus, Truck } from "lucide-react";
import { Badge, Button, Card } from "@/components/ui";
import { operations } from "@/data/siteData";
import { AdminLayout, statusTone } from "./AdminLayout";

export function AdminTruckPage() {
  return (
    <AdminLayout>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Dispatch Capacity</p>
          <h1 className="mt-2 text-3xl font-bold">Truck Capability</h1>
          <p className="mt-3 max-w-3xl text-muted-foreground">Match jobs to trucks that can haul 20 ft, 40 ft, standard-height, and high-cube containers.</p>
        </div>
        <Button>
          <Plus className="h-4 w-4" />
          Add truck
        </Button>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {operations.trucks.map((truck) => (
          <Card key={truck.id} className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-primary" />
                  <h2 className="font-semibold">{truck.name}</h2>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{truck.id} - {truck.note}</p>
              </div>
              <Badge tone={statusTone(truck.status)}>{truck.status}</Badge>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {truck.lengths.length ? truck.lengths.map((length) => <Badge key={length}>{length}</Badge>) : <Badge tone="danger">No haul</Badge>}
              <Badge tone={truck.highCube ? "success" : "default"}>{truck.highCube ? "High cube OK" : "Standard only"}</Badge>
            </div>
            <div className="mt-5 grid gap-3 rounded-md bg-muted p-4 text-sm sm:grid-cols-2">
              <div>
                <p className="text-xs text-muted-foreground">Driver</p>
                <p className="font-semibold">{truck.driver}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Next service</p>
                <p className="font-semibold">{truck.nextService}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </AdminLayout>
  );
}
