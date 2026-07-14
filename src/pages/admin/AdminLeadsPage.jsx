import { useMemo, useState } from "react";
import { CheckCircle2, ClipboardList, RefreshCcw, Search, Wand2 } from "lucide-react";
import { Badge, Button, Card } from "@/components/ui";
import { demoWorkflow } from "@/data/siteData";
import { clearSavedQuoteLeads, readQuoteLeads } from "@/lib/demoWorkflow";
import { AdminLayout } from "./AdminLayout";

const inputClass = "h-10 rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";

function leadTone(status) {
  if (status === "New") return "success";
  if (status === "Quoted" || status === "Review") return "warn";
  return "default";
}

export function AdminLeadsPage() {
  const [leads, setLeads] = useState(readQuoteLeads);
  const [query, setQuery] = useState("");
  const [selectedLeadId, setSelectedLeadId] = useState(leads[0]?.id);
  const selectedLead = leads.find((lead) => lead.id === selectedLeadId) || leads[0];

  const filteredLeads = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return leads;
    return leads.filter((lead) => [lead.name, lead.company, lead.container, lead.address, lead.status].some((field) => String(field).toLowerCase().includes(value)));
  }, [leads, query]);

  function markQuoted(leadId) {
    setLeads((current) => current.map((lead) => (lead.id === leadId ? { ...lead, status: "Quoted", fit: "Ready to convert" } : lead)));
  }

  function resetDemoLeads() {
    clearSavedQuoteLeads();
    setLeads(demoWorkflow.quoteLeads);
    setSelectedLeadId(demoWorkflow.quoteLeads[0]?.id);
  }

  return (
    <AdminLayout>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Lead Intake</p>
          <h1 className="mt-2 text-3xl font-bold">Quotes and availability match</h1>
          <p className="mt-3 max-w-3xl text-muted-foreground">Public quote requests land here, then get matched to inventory, truck capacity, and rental terms.</p>
        </div>
        <Button variant="outline" onClick={resetDemoLeads}>
          <RefreshCcw className="h-4 w-4" />
          Reset saved leads
        </Button>
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(360px,.8fr)]">
        <Card className="overflow-hidden">
          <div className="flex flex-col gap-3 border-b border-border p-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-semibold">Quote queue</h2>
              <p className="text-sm text-muted-foreground">{filteredLeads.length} leads visible</p>
            </div>
            <label className="relative">
              <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input className={`${inputClass} w-full pl-9 md:w-72`} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search leads" />
            </label>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[880px] text-sm">
              <thead className="bg-muted text-left text-muted-foreground">
                <tr>
                  <th className="px-5 py-3 font-medium">Lead</th>
                  <th className="px-5 py-3 font-medium">Need</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 font-medium">Fit</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className={lead.id === selectedLead?.id ? "bg-primary/5" : ""}>
                    <td className="px-5 py-4">
                      <button className="text-left font-semibold hover:text-primary" type="button" onClick={() => setSelectedLeadId(lead.id)}>
                        {lead.company || lead.name}
                      </button>
                      <p className="mt-1 text-xs text-muted-foreground">{lead.name} - {lead.receivedAt}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium">{lead.container}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{lead.address}</p>
                    </td>
                    <td className="px-5 py-4">{lead.date || "Flexible"}</td>
                    <td className="px-5 py-4"><Badge tone={lead.fit.includes("Needs") ? "warn" : "success"}>{lead.fit}</Badge></td>
                    <td className="px-5 py-4"><Badge tone={leadTone(lead.status)}>{lead.status}</Badge></td>
                    <td className="px-5 py-4 text-right">
                      <Button className="h-9" variant="outline" onClick={() => markQuoted(lead.id)}>
                        <CheckCircle2 className="h-4 w-4" />
                        Mark quoted
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {selectedLead && (
          <Card className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-muted-foreground">Selected lead</p>
                <h2 className="mt-1 text-xl font-semibold">{selectedLead.company || selectedLead.name}</h2>
              </div>
              <ClipboardList className="h-6 w-6 text-primary" />
            </div>
            <div className="mt-5 grid gap-3 text-sm">
              <div className="rounded-md bg-muted p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Contact</p>
                <p className="mt-1 font-semibold">{selectedLead.name}</p>
                <p className="text-muted-foreground">{selectedLead.phone} - {selectedLead.email}</p>
              </div>
              <div className="rounded-md bg-muted p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Request</p>
                <p className="mt-1 font-semibold">{selectedLead.container} for {selectedLead.duration}</p>
                <p className="text-muted-foreground">{selectedLead.notes}</p>
              </div>
              <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-emerald-900">
                <div className="flex items-center gap-2 font-semibold">
                  <Wand2 className="h-4 w-4" />
                  Suggested conversion
                </div>
                <p className="mt-2 text-sm">Reserve LR-40HC-203, assign Landoll High Cube, collect $500 deposit, and create Jul 18 delivery job.</p>
              </div>
            </div>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <a className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90" href={`/admin/rentals/new?lead=${encodeURIComponent(selectedLead.id)}`}>
                Convert to rental
              </a>
              <a className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-border bg-background px-4 text-sm font-semibold hover:bg-muted" href="/admin/dispatch">
                Check dispatch
              </a>
            </div>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
