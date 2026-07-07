import { Download } from "lucide-react";
import { Button, Card } from "@/components/ui";
import { operations } from "@/data/siteData";
import { AdminLayout } from "./AdminLayout";

export function AdminTaxExportPage() {
  return (
    <AdminLayout>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Accounting</p>
          <h1 className="mt-2 text-3xl font-bold">Tax Export</h1>
          <p className="mt-3 max-w-3xl text-muted-foreground">Quicken-friendly CSV staging for revenue, depreciation, repairs, mileage, and dispatch expenses.</p>
        </div>
        <Button>
          <Download className="h-4 w-4" />
          Export {operations.taxExport.target}
        </Button>
      </div>

      <Card className="mt-6 p-5">
        <div className="grid gap-3 sm:grid-cols-4">
          <div className="rounded-md bg-muted p-3">
            <p className="text-xs text-muted-foreground">Period</p>
            <p className="font-semibold">{operations.taxExport.period}</p>
          </div>
          <div className="rounded-md bg-muted p-3">
            <p className="text-xs text-muted-foreground">Revenue</p>
            <p className="font-semibold">${operations.taxExport.revenue.toLocaleString()}</p>
          </div>
          <div className="rounded-md bg-muted p-3">
            <p className="text-xs text-muted-foreground">Depreciation</p>
            <p className="font-semibold">${operations.taxExport.depreciation.toLocaleString()}</p>
          </div>
          <div className="rounded-md bg-muted p-3">
            <p className="text-xs text-muted-foreground">Repairs</p>
            <p className="font-semibold">${operations.taxExport.repairs.toLocaleString()}</p>
          </div>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="text-left text-muted-foreground">
              <tr>
                <th className="py-2 font-medium">Date</th>
                <th className="py-2 font-medium">Quicken account</th>
                <th className="py-2 font-medium">Memo</th>
                <th className="py-2 text-right font-medium">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {operations.taxExport.exportRows.map((row) => (
                <tr key={`${row.date}-${row.account}`}>
                  <td className="py-3">{row.date}</td>
                  <td className="py-3">{row.account}</td>
                  <td className="py-3 text-muted-foreground">{row.memo}</td>
                  <td className="py-3 text-right">${row.amount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </AdminLayout>
  );
}
