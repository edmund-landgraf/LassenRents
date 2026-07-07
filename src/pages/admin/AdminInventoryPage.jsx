import { Plus } from "lucide-react";
import { Badge, Button, Card } from "@/components/ui";
import { operations } from "@/data/siteData";
import { AdminLayout, statusTone } from "./AdminLayout";

export function AdminInventoryPage() {
  return (
    <AdminLayout>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Fleet Assets</p>
          <h1 className="mt-2 text-3xl font-bold">Container Inventory</h1>
          <p className="mt-3 max-w-3xl text-muted-foreground">Manage units like rental cars: available, committed, rented, due back, on hold, and out for maintenance.</p>
        </div>
        <Button>
          <Plus className="h-4 w-4" />
          Add container
        </Button>
      </div>

      <Card className="mt-6 overflow-hidden">
        <div className="flex flex-col justify-between gap-4 border-b border-border p-5 md:flex-row md:items-center">
          <h2 className="font-semibold">Status summary</h2>
          <div className="flex flex-wrap gap-2">
            {operations.statusSummary.map((item) => (
              <Badge key={item.label} tone={item.tone}>
                {item.label}: {item.count}
              </Badge>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] text-sm">
            <thead className="bg-muted text-left text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-medium">Unit</th>
                <th className="px-5 py-3 font-medium">Length</th>
                <th className="px-5 py-3 font-medium">Cube</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Customer</th>
                <th className="px-5 py-3 font-medium">Location</th>
                <th className="px-5 py-3 font-medium">Due / commitment</th>
                <th className="px-5 py-3 font-medium">Book value</th>
                <th className="px-5 py-3 font-medium">Dep/mo</th>
                <th className="px-5 py-3 font-medium">Util.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {operations.inventory.map((item) => (
                <tr key={item.id}>
                  <td className="px-5 py-4 font-medium">{item.id}</td>
                  <td className="px-5 py-4">{item.length}</td>
                  <td className="px-5 py-4">{item.highCube ? "High cube" : "Standard"}</td>
                  <td className="px-5 py-4"><Badge tone={statusTone(item.status)}>{item.status}</Badge></td>
                  <td className="px-5 py-4">{item.customer}</td>
                  <td className="px-5 py-4 text-muted-foreground">{item.location}</td>
                  <td className="px-5 py-4 text-muted-foreground">{item.due}</td>
                  <td className="px-5 py-4">${item.bookValue.toLocaleString()}</td>
                  <td className="px-5 py-4">${item.monthlyDepreciation}</td>
                  <td className="px-5 py-4">{item.utilization}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </AdminLayout>
  );
}
