import { useMemo, useState } from "react";
import { Download, FileSpreadsheet, X } from "lucide-react";
import { Button, Card } from "@/components/ui";
import { operations } from "@/data/siteData";
import { AdminLayout } from "./AdminLayout";

function csvEscape(value) {
  const text = String(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function AdminTaxExportPage() {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const csvRows = useMemo(
    () => [
      ["Date", "Account", "Payee", "Memo", "Category", "Amount"],
      ...operations.taxExport.exportRows.map((row) => [
        row.date,
        row.account,
        "Lassen Rents",
        row.memo,
        row.account,
        row.amount.toFixed(2)
      ])
    ],
    []
  );
  const csvPreview = csvRows.map((row) => row.map(csvEscape).join(",")).join("\n");

  return (
    <AdminLayout>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Accounting</p>
          <h1 className="mt-2 text-3xl font-bold">Tax Export</h1>
          <p className="mt-3 max-w-3xl text-muted-foreground">Quicken-friendly CSV staging for revenue, depreciation, repairs, mileage, and dispatch expenses.</p>
        </div>
        <Button onClick={() => setIsPreviewOpen(true)}>
          <Download className="h-4 w-4" />
          Preview {operations.taxExport.target}
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

      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-5 py-8 backdrop-blur-sm">
          <div className="max-h-[88vh] w-full max-w-4xl overflow-y-auto rounded-lg border border-border bg-card text-card-foreground shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">Quicken CSV Preview</p>
                <h2 className="mt-1 text-2xl font-bold">{operations.taxExport.period} sample export</h2>
                <p className="mt-1 text-sm text-muted-foreground">Preview only. No CSV file is generated or downloaded.</p>
              </div>
              <button
                className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                type="button"
                onClick={() => setIsPreviewOpen(false)}
                aria-label="Close Quicken CSV preview"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-5 px-6 py-5">
              <Card className="overflow-hidden">
                <div className="flex items-center gap-2 border-b border-border px-4 py-3">
                  <FileSpreadsheet className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">CSV columns</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[760px] text-sm">
                    <thead className="bg-muted text-left text-muted-foreground">
                      <tr>
                        {csvRows[0].map((header) => (
                          <th key={header} className="px-4 py-3 font-medium">{header}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {csvRows.slice(1).map((row) => (
                        <tr key={`${row[0]}-${row[1]}-${row[5]}`}>
                          {row.map((cell, index) => (
                            <td key={`${cell}-${index}`} className={index === 5 ? "px-4 py-3 text-right font-semibold" : "px-4 py-3"}>
                              {index === 5 ? `$${Number(cell).toLocaleString()}` : cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              <div className="rounded-md border border-border bg-slate-950 p-4 text-slate-100">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-emerald-300">Raw CSV preview</p>
                <pre className="max-h-72 overflow-auto whitespace-pre text-xs leading-6">{csvPreview}</pre>
              </div>

              <div className="flex justify-end border-t border-border pt-5">
                <Button type="button" onClick={() => setIsPreviewOpen(false)}>
                  Close preview
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
