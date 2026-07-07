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

      <section className="mt-8 grid gap-5 lg:grid-cols-[.95fr_1.05fr]">
        <Card className="border-white/10 bg-white p-0 text-slate-950">
          <div className="border-b border-border p-5">
            <h2 className="font-semibold">Contract list</h2>
            <p className="mt-1 text-sm text-muted-foreground">Scrollable mini grid of agreements.</p>
          </div>
          <div className="max-h-[520px] overflow-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="sticky top-0 bg-muted text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Agreement</th>
                  <th className="px-4 py-3">Container</th>
                  <th className="px-4 py-3">Start</th>
                  <th className="px-4 py-3">Due back</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rentalContracts.map((contract) => (
                  <tr
                    key={contract.id}
                    className={`cursor-pointer transition hover:bg-muted/60 ${selectedContract?.id === contract.id ? "bg-emerald-50" : ""}`}
                    onClick={() => setSelectedContractId(contract.id)}
                  >
                    <td className="px-4 py-4 font-semibold">{contract.agreementNumber}</td>
                    <td className="px-4 py-4">{contract.container}</td>
                    <td className="px-4 py-4">{contract.start}</td>
                    <td className="px-4 py-4">{contract.dueBack}</td>
                    <td className="px-4 py-4">
                      <Badge tone={contract.status === "Current" ? "success" : "default"}>{contract.status}</Badge>
                    </td>
                    <td className="px-4 py-4 text-right font-semibold">${contract.balance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {selectedContract && (
          <Card className="border-white/10 bg-white/8 p-5 text-white">
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
              <a href={selectedContract.pdfUrl} download={`${selectedContract.agreementNumber}-container-rental-agreement.pdf`} className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-white px-4 text-sm font-semibold text-slate-950 transition hover:bg-white/90">
                <Download className="h-4 w-4" />
                Download PDF
              </a>
            </div>
            <div className="mt-5 overflow-hidden rounded-lg border border-white/10 bg-slate-950">
              <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3 text-sm font-semibold text-white/70">
                <FileText className="h-4 w-4 text-emerald-300" />
                Agreement preview
              </div>
              <iframe className="h-[520px] w-full bg-white" src={selectedContract.pdfUrl} title={`${selectedContract.agreementNumber} agreement preview`} />
            </div>
          </Card>
        )}
      </section>
    </PortalShell>
  );
}
