import { useState } from "react";
import { Download, FileText, MapPin } from "lucide-react";
import { Badge, Card } from "@/components/ui";
import { rentalContracts } from "@/data/siteData";
import { isPortalAuthenticated, PortalShell } from "./PortalShell";

export function PortalContractsPage() {
  const [selectedContractId, setSelectedContractId] = useState(rentalContracts[0]?.id);
  const selectedContract = rentalContracts.find((contract) => contract.id === selectedContractId) || rentalContracts[0];

  if (!isPortalAuthenticated()) {
    window.location.replace("/portal/login");
    return null;
  }

  return (
    <PortalShell>
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-300">Rental Contracts</p>
        <h1 className="mt-2 text-3xl font-bold">Current and past rentals</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/60">Select a contract row to view details and preview the agreement PDF.</p>
      </div>

      <section className="mt-8 grid min-w-0 gap-5 lg:grid-cols-[minmax(0,.95fr)_minmax(0,1.05fr)]">
        <Card className="min-w-0 border-white/10 bg-white p-0 text-slate-950">
          <div className="border-b border-border p-5">
            <h2 className="font-semibold">Contract list</h2>
            <p className="mt-1 text-sm text-muted-foreground">Scrollable mini grid of agreements.</p>
          </div>
          <div className="max-h-[520px] overflow-y-auto">
            <table className="w-full table-fixed text-left text-sm">
              <thead className="sticky top-0 bg-muted text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="w-[18%] px-3 py-3">Agreement</th>
                  <th className="w-[20%] px-3 py-3">Container</th>
                  <th className="w-[16%] px-3 py-3">Start</th>
                  <th className="w-[16%] px-3 py-3">Due</th>
                  <th className="w-[15%] px-3 py-3">Status</th>
                  <th className="w-[15%] px-3 py-3 text-right">Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rentalContracts.map((contract) => (
                  <tr
                    key={contract.id}
                    className={`cursor-pointer transition hover:bg-muted/60 ${selectedContract?.id === contract.id ? "bg-emerald-50" : ""}`}
                    onClick={() => setSelectedContractId(contract.id)}
                  >
                    <td className="px-3 py-4 font-semibold">{contract.agreementNumber}</td>
                    <td className="px-3 py-4 leading-5">{contract.container}</td>
                    <td className="px-3 py-4 leading-5">{contract.start}</td>
                    <td className="px-3 py-4 leading-5">{contract.dueBack}</td>
                    <td className="px-3 py-4">
                      <Badge tone={contract.status === "Current" ? "success" : "default"}>{contract.status}</Badge>
                    </td>
                    <td className="px-3 py-4 text-right font-semibold">${contract.balance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {selectedContract && (
          <Card className="min-w-0 border-white/10 bg-white/8 p-5 text-white">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-white/60">Selected contract</p>
                <h2 className="mt-1 text-2xl font-bold">{selectedContract.agreementNumber}</h2>
              </div>
              <Badge tone={selectedContract.status === "Current" ? "success" : "default"}>{selectedContract.status}</Badge>
            </div>
            <div className="mt-5 grid gap-3 text-sm text-white/70 sm:grid-cols-2">
              <div>
                <p className="text-white/45">Container</p>
                <p className="font-semibold text-white">{selectedContract.container}</p>
              </div>
              <div>
                <p className="text-white/45">Deposit</p>
                <p className="font-semibold text-white">${selectedContract.deposit}</p>
              </div>
              <div>
                <p className="text-white/45">Start</p>
                <p className="font-semibold text-white">{selectedContract.start}</p>
              </div>
              <div>
                <p className="text-white/45">Due back</p>
                <p className="font-semibold text-white">{selectedContract.dueBack}</p>
              </div>
            </div>
            <p className="mt-4 flex items-start gap-2 text-sm leading-6 text-white/65">
              <MapPin className="mt-1 h-4 w-4 shrink-0 text-emerald-300" />
              {selectedContract.address}
            </p>
            <p className="mt-3 text-sm leading-6 text-white/65">{selectedContract.notes}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a href={`${selectedContract.pdfUrl}?download=1`} download={`${selectedContract.agreementNumber}-container-rental-agreement.pdf`} className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-white px-4 text-sm font-semibold text-slate-950 transition hover:bg-white/90">
                <Download className="h-4 w-4" />
                Download PDF
              </a>
              <a href={selectedContract.pdfUrl} target="_blank" rel="noreferrer" className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-white/15 px-4 text-sm font-semibold text-white transition hover:bg-white/10">
                <FileText className="h-4 w-4" />
                Open PDF
              </a>
            </div>
            <div className="mt-5 overflow-hidden rounded-lg border border-white/10 bg-slate-950">
              <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3 text-sm font-semibold text-white/70">
                <FileText className="h-4 w-4 text-emerald-300" />
                Agreement preview
              </div>
              <div className="max-h-[520px] overflow-y-auto bg-white p-6 text-slate-950">
                <div className="mx-auto max-w-[680px] rounded-md border border-slate-200 bg-white p-6 text-xs leading-5 shadow-sm">
                  <p className="font-bold">Lassen Rents, Inc. - Sample Storage Container Rental Agreement</p>
                  <div className="mt-4 grid gap-1">
                    <p>
                      <span className="font-semibold">Agreement No:</span> {selectedContract.agreementNumber}
                    </p>
                    <p>
                      <span className="font-semibold">Customer:</span> Mallery Construction
                    </p>
                    <p>
                      <span className="font-semibold">Site Address:</span> {selectedContract.address}
                    </p>
                  </div>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="font-bold">Container</p>
                      <p>Unit: {selectedContract.id.replace("rent-", "LR-").toUpperCase()}</p>
                      <p>Size: {selectedContract.container}</p>
                      <p>Condition at delivery: Good</p>
                    </div>
                    <div>
                      <p className="font-bold">Rental Terms</p>
                      <p>Start date: {selectedContract.start}</p>
                      <p>Due back: {selectedContract.dueBack}</p>
                      <p>Deposit: ${selectedContract.deposit}</p>
                    </div>
                  </div>
                  <div className="mt-5">
                    <p className="font-bold">Customer Responsibilities</p>
                    <ol className="mt-2 list-decimal space-y-1 pl-4">
                      <li>Keep the container locked and secure.</li>
                      <li>Do not move the container without written approval.</li>
                      <li>Keep the container accessible for pickup or service.</li>
                      <li>Do not store hazardous, illegal, explosive, or flammable materials.</li>
                    </ol>
                  </div>
                  <div className="mt-5">
                    <p className="font-bold">Payment and Return</p>
                    <p className="mt-2">
                      Monthly rent, delivery, pickup, deposits, taxes, and fees are due as invoiced. Final charges may
                      include unpaid rent, pickup, repair, cleaning, or adjustment items.
                    </p>
                  </div>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <p>Customer Signature: ____________________</p>
                    <p>Lassen Rents Signature: ________________</p>
                  </div>
                  <p className="mt-6 text-[11px] text-slate-500">Preview only. Use Open PDF or Download PDF for the generated contract document.</p>
                </div>
              </div>
            </div>
          </Card>
        )}
      </section>
    </PortalShell>
  );
}
