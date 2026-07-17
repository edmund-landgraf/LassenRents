import { useMemo, useState } from "react";
import { CheckCircle2, ClipboardList, FileText, RefreshCcw, Search, Send, Wand2, X } from "lucide-react";
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

function buildQuote(lead) {
  const isRental = lead.interests?.includes("Rent a container") || !String(lead.container || "").includes("Customer-owned");
  const monthlyRate = isRental ? (String(lead.container).includes("40") ? 255 : String(lead.container).includes("High Cube") ? 165 : 145) : 0;
  const deliveryFee = isRental ? 175 : 225;
  const pickupFee = isRental ? 175 : 0;
  const deposit = isRental ? (String(lead.container).includes("40") ? 500 : 300) : 0;
  const truckingFee = isRental ? 0 : 325;
  const modificationAllowance = lead.interests?.includes("Modify a container") ? 450 : 0;

  return {
    isRental,
    quoteNumber: `QT-${lead.id.replace(/\D/g, "").slice(-6) || Date.now().toString().slice(-6)}`,
    validUntil: "August 15, 2026",
    unitMatch: isRental ? (String(lead.container).includes("40") ? "LR-40HC-203" : "LR-20HC-118") : "Customer-owned container",
    truckMatch: String(lead.container).includes("40") || !isRental ? "Landoll High Cube" : "Tilt Trailer 20",
    monthlyRate,
    deliveryFee,
    pickupFee,
    deposit,
    truckingFee,
    modificationAllowance,
    dueToStart: deliveryFee + deposit + truckingFee + modificationAllowance,
    recurring: monthlyRate
  };
}

export function AdminLeadsPage() {
  const [leads, setLeads] = useState(readQuoteLeads);
  const [query, setQuery] = useState("");
  const requestedLeadId = new URLSearchParams(window.location.search).get("lead");
  const initialLeadId = leads.some((lead) => lead.id === requestedLeadId) ? requestedLeadId : leads[0]?.id;
  const [selectedLeadId, setSelectedLeadId] = useState(initialLeadId);
  const [quoteLead, setQuoteLead] = useState(null);
  const [useDigitalSignature, setUseDigitalSignature] = useState(true);
  const selectedLead = leads.find((lead) => lead.id === selectedLeadId) || leads[0];
  const quote = quoteLead ? buildQuote(quoteLead) : null;

  const filteredLeads = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return leads;
    return leads.filter((lead) => [lead.name, lead.company, lead.container, lead.address, lead.status].some((field) => String(field).toLowerCase().includes(value)));
  }, [leads, query]);

  function openQuoteModal(lead) {
    setSelectedLeadId(lead.id);
    setQuoteLead(lead);
    setUseDigitalSignature(true);
  }

  function sendQuote(leadId) {
    setLeads((current) => current.map((lead) => (lead.id === leadId ? { ...lead, status: "Quoted", fit: "Ready to convert" } : lead)));
    setQuoteLead(null);
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
                      <Button className="h-9" variant="outline" onClick={() => openQuoteModal(lead)}>
                        <FileText className="h-4 w-4" />
                        Send quote
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
              <a className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90" href={`/admin/rentals?lead=${encodeURIComponent(selectedLead.id)}`}>
                Convert to rental
              </a>
              <a className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-border bg-background px-4 text-sm font-semibold hover:bg-muted" href="/admin/dispatch">
                Check dispatch
              </a>
            </div>
          </Card>
        )}
      </div>

      {quoteLead && quote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-5 py-8 backdrop-blur-sm">
          <div className="max-h-[88vh] w-full max-w-4xl overflow-y-auto rounded-lg border border-border bg-card text-card-foreground shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">Quote Preview</p>
                <h2 className="mt-1 text-2xl font-bold">Send {quote.quoteNumber} to {quoteLead.company || quoteLead.name}</h2>
                <p className="mt-1 text-sm text-muted-foreground">Review the demo quote package before marking this lead as quoted.</p>
              </div>
              <button className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground" type="button" onClick={() => setQuoteLead(null)} aria-label="Close quote preview">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-5 px-6 py-5 lg:grid-cols-[1fr_320px]">
              <div className="grid gap-4">
                <Card className="p-5">
                  <div className="flex flex-col justify-between gap-3 sm:flex-row">
                    <div>
                      <p className="text-sm text-muted-foreground">Customer</p>
                      <h3 className="text-xl font-semibold">{quoteLead.company || quoteLead.name}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{quoteLead.name} - {quoteLead.phone} - {quoteLead.email}</p>
                    </div>
                    <Badge tone="warn">Valid until {quote.validUntil}</Badge>
                  </div>
                  <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
                    <div className="rounded-md bg-muted p-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Requested service</p>
                      <p className="mt-1 font-semibold">{quoteLead.interests?.join(", ") || "General quote"}</p>
                    </div>
                    <div className="rounded-md bg-muted p-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Site / timing</p>
                      <p className="mt-1 font-semibold">{quoteLead.address || "Address to confirm"} - {quoteLead.date || "Flexible"}</p>
                    </div>
                    <div className="rounded-md bg-muted p-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Container</p>
                      <p className="mt-1 font-semibold">{quoteLead.container}</p>
                    </div>
                    <div className="rounded-md bg-muted p-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Matched equipment</p>
                      <p className="mt-1 font-semibold">{quote.unitMatch} - {quote.truckMatch}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-muted-foreground">{quoteLead.notes || "No extra customer notes were provided."}</p>
                </Card>

                <Card className="overflow-hidden">
                  <div className="border-b border-border px-5 py-4">
                    <h3 className="font-semibold">Quote line items</h3>
                  </div>
                  <table className="w-full text-sm">
                    <tbody className="divide-y divide-border">
                      {quote.isRental && <tr><td className="px-5 py-3 text-muted-foreground">Monthly rental</td><td className="px-5 py-3 text-right font-semibold">${quote.monthlyRate}/mo</td></tr>}
                      {quote.deliveryFee > 0 && <tr><td className="px-5 py-3 text-muted-foreground">{quote.isRental ? "Delivery" : "Container transport / trucking"}</td><td className="px-5 py-3 text-right font-semibold">${quote.deliveryFee + quote.truckingFee}</td></tr>}
                      {quote.pickupFee > 0 && <tr><td className="px-5 py-3 text-muted-foreground">Future pickup</td><td className="px-5 py-3 text-right font-semibold">${quote.pickupFee}</td></tr>}
                      {quote.deposit > 0 && <tr><td className="px-5 py-3 text-muted-foreground">Deposit</td><td className="px-5 py-3 text-right font-semibold">${quote.deposit}</td></tr>}
                      {quote.modificationAllowance > 0 && <tr><td className="px-5 py-3 text-muted-foreground">Modification allowance</td><td className="px-5 py-3 text-right font-semibold">${quote.modificationAllowance}</td></tr>}
                    </tbody>
                  </table>
                </Card>
              </div>

              <Card className="p-5">
                <div className="flex items-center gap-2">
                  <Send className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Send summary</h3>
                </div>
                <div className="mt-4 grid gap-3">
                  <div className="rounded-md bg-muted p-3">
                    <p className="text-xs text-muted-foreground">Due to start</p>
                    <p className="text-3xl font-bold">${quote.dueToStart.toLocaleString()}</p>
                  </div>
                  <div className="rounded-md bg-muted p-3">
                    <p className="text-xs text-muted-foreground">Recurring</p>
                    <p className="text-2xl font-bold">{quote.recurring ? `$${quote.recurring}/mo` : "None"}</p>
                  </div>
                  <div className="rounded-md bg-muted p-3">
                    <p className="text-xs text-muted-foreground">Recipient</p>
                    <p className="font-semibold">{quoteLead.email || "Email needed"}</p>
                  </div>
                </div>
                <div className="mt-5 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950">
                  <p className="font-semibold">Demo action</p>
                  <p className="mt-1">This will not email a real customer. It marks the lead quoted and makes it ready to convert.</p>
                </div>
                <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-md border border-border bg-background p-3 text-sm">
                  <input
                    className="mt-1 h-4 w-4 accent-primary"
                    type="checkbox"
                    checked={useDigitalSignature}
                    onChange={(event) => setUseDigitalSignature(event.target.checked)}
                  />
                  <span>
                    <span className="block font-semibold">Include DocuSign digital signature option</span>
                    <span className="mt-1 block text-muted-foreground">
                      Customer can sign digitally by DocuSign or sign a paper copy from the office or delivery driver.
                    </span>
                  </span>
                </label>
                <div className="mt-3 rounded-md bg-muted p-3 text-sm">
                  <p className="font-semibold">Customer message</p>
                  <p className="mt-1 text-muted-foreground">
                    {useDigitalSignature
                      ? "You can approve this quote with a DocuSign digital signature, or we can provide a paper copy if you prefer to sign in person."
                      : "We can provide a paper copy for signature at the office or with the delivery driver."}
                  </p>
                </div>
                <div className="mt-5 grid gap-3">
                  <Button onClick={() => sendQuote(quoteLead.id)}>
                    <CheckCircle2 className="h-4 w-4" />
                    Send quote
                  </Button>
                  <Button variant="outline" onClick={() => setQuoteLead(null)}>Cancel</Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
