import { useEffect, useMemo, useState } from "react";
import { AlertCircle, CreditCard, Mail, ReceiptText, RotateCcw, X } from "lucide-react";
import { Badge, Button, Card } from "@/components/ui";
import { AdminLayout } from "./AdminLayout";

function invoiceTone(status) {
  if (status === "Paid") return "success";
  if (status === "Past due") return "danger";
  return "warn";
}

const textareaClass =
  "min-h-24 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";

export function AdminInvoicesPage() {
  const [invoices, setInvoices] = useState([]);
  const [confirmInvoice, setConfirmInvoice] = useState(null);
  const [paymentNote, setPaymentNote] = useState("");
  const [lastPayment, setLastPayment] = useState(null);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const totals = useMemo(
    () => ({
      open: invoices.filter((invoice) => invoice.status !== "Paid").reduce((sum, invoice) => sum + invoice.amount, 0),
      pastDue: invoices.filter((invoice) => invoice.status === "Past due").reduce((sum, invoice) => sum + invoice.amount, 0),
      paid: invoices.filter((invoice) => invoice.status === "Paid").length
    }),
    [invoices]
  );

  useEffect(() => {
    let ignore = false;

    async function loadInvoices() {
      const sources = ["/api/admin/invoices", "/data/invoices.json"];
      let lastError = null;

      try {
        for (const source of sources) {
          try {
            const response = await fetch(source);
            if (!response.ok) throw new Error("Invoices could not be loaded.");
            const data = await response.json();
            if (!ignore) setInvoices(data);
            return;
          } catch (sourceError) {
            lastError = sourceError;
          }
        }
        throw lastError;
      } catch (loadError) {
        if (!ignore) setError(loadError.message);
      }
    }

    loadInvoices();
    return () => {
      ignore = true;
    };
  }, []);

  function openConfirm(invoice) {
    setError("");
    setPaymentNote("");
    setConfirmInvoice(invoice);
  }

  function closeConfirm() {
    setConfirmInvoice(null);
    setPaymentNote("");
    setIsSaving(false);
  }

  async function markInvoicePaid() {
    if (!confirmInvoice) return;
    setError("");
    setIsSaving(true);

    try {
      const response = await fetch(`/api/admin/invoices/${encodeURIComponent(confirmInvoice.id)}/mark-paid`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentNote })
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Invoice could not be marked paid.");
      setInvoices(payload.invoices);
      setLastPayment({ invoice: payload.item });
      closeConfirm();
    } catch (saveError) {
      setError(saveError.message);
      setIsSaving(false);
    }
  }

  async function undoPayment(invoiceId = lastPayment?.invoice.id) {
    if (!invoiceId) return;
    setError("");

    try {
      const response = await fetch(`/api/admin/invoices/${encodeURIComponent(invoiceId)}/undo-paid`, { method: "POST" });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Payment could not be undone.");
      setInvoices(payload.invoices);
      setLastPayment(null);
    } catch (undoError) {
      setError(undoError.message);
    }
  }

  async function sendReminder(invoiceId) {
    setError("");

    try {
      const response = await fetch(`/api/admin/invoices/${encodeURIComponent(invoiceId)}/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({})
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Reminder could not be sent.");
      setInvoices(payload.invoices);
    } catch (sendError) {
      setError(sendError.message);
    }
  }

  return (
    <AdminLayout>
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">Billing</p>
        <h1 className="mt-2 text-3xl font-bold">Invoices and payments</h1>
        <p className="mt-3 max-w-3xl text-muted-foreground">Admin view for open balances, aging, payment recording, and invoice reminders.</p>
      </div>

      {error && !confirmInvoice && (
        <div className="mt-4 flex items-center gap-2 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Card className="p-5">
          <p className="text-sm text-muted-foreground">Open receivables</p>
          <p className="mt-2 text-3xl font-bold">${totals.open.toLocaleString()}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-muted-foreground">Past due</p>
          <p className="mt-2 text-3xl font-bold">${totals.pastDue.toLocaleString()}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-muted-foreground">Paid records</p>
          <p className="mt-2 text-3xl font-bold">{totals.paid}</p>
        </Card>
      </div>

      <Card className="mt-5 overflow-hidden">
        <div className="flex items-center gap-2 border-b border-border p-5">
          <ReceiptText className="h-5 w-5 text-primary" />
          <h2 className="font-semibold">Invoice queue</h2>
        </div>
        {lastPayment && (
          <div className="flex flex-col gap-3 border-b border-border bg-emerald-50 px-5 py-4 text-sm text-emerald-900 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-semibold">{lastPayment.invoice.id} was marked paid and removed from open receivables.</p>
              {lastPayment.invoice.paymentNote ? <p className="mt-1 text-emerald-800">Note: {lastPayment.invoice.paymentNote}</p> : null}
            </div>
            <Button className="h-9 bg-emerald-700 hover:bg-emerald-800" onClick={() => undoPayment()}>
              <RotateCcw className="h-4 w-4" />
              Undo payment
            </Button>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-sm">
            <thead className="bg-muted text-left text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-medium">Invoice</th>
                <th className="px-5 py-3 font-medium">Customer</th>
                <th className="px-5 py-3 font-medium">Due</th>
                <th className="px-5 py-3 font-medium">Aging / note</th>
                <th className="px-5 py-3 text-right font-medium">Amount</th>
                <th className="px-5 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {invoices.length === 0 ? (
                <tr>
                  <td className="px-5 py-8 text-muted-foreground" colSpan={6}>
                    No invoices loaded yet.
                  </td>
                </tr>
              ) : (
                invoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td className="px-5 py-4">
                      <p className="font-semibold">{invoice.id}</p>
                      <Badge tone={invoiceTone(invoice.status)}>{invoice.status}</Badge>
                    </td>
                    <td className="px-5 py-4">{invoice.customer}</td>
                    <td className="px-5 py-4">{invoice.due}</td>
                    <td className="px-5 py-4 text-muted-foreground">
                      <p>{invoice.age}</p>
                      {invoice.paymentNote ? <p className="mt-1 text-xs text-foreground/80">Note: {invoice.paymentNote}</p> : null}
                    </td>
                    <td className="px-5 py-4 text-right font-semibold">${Number(invoice.amount || 0).toLocaleString()}</td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <Button className="h-9" variant="outline" onClick={() => sendReminder(invoice.id)}>
                          <Mail className="h-4 w-4" />
                          Send
                        </Button>
                        {invoice.status === "Paid" && invoice.previousAmount != null ? (
                          <Button className="h-9" variant="outline" onClick={() => undoPayment(invoice.id)}>
                            <RotateCcw className="h-4 w-4" />
                            Undo
                          </Button>
                        ) : (
                          <Button className="h-9" disabled={invoice.status === "Paid"} onClick={() => openConfirm(invoice)}>
                            <CreditCard className="h-4 w-4" />
                            Mark paid
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {confirmInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-5 py-8 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-lg border border-border bg-card text-card-foreground shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">Confirm Payment</p>
                <h2 className="mt-1 text-2xl font-bold">Mark {confirmInvoice.id} as paid?</h2>
              </div>
              <button className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground" type="button" onClick={closeConfirm} aria-label="Close payment confirmation">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-4 px-6 py-5">
              {error && (
                <div className="flex items-center gap-2 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}

              <p className="text-sm leading-6 text-muted-foreground">
                This action will mark the invoice paid, set the displayed open balance for this invoice to $0, and remove ${confirmInvoice.amount.toLocaleString()} from open receivables.
              </p>
              <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
                <p className="font-semibold">No real payment will be processed.</p>
                <p className="mt-1">Use this only when you want to record payment for {confirmInvoice.customer}.</p>
              </div>
              <div className="rounded-md bg-muted p-4 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Current balance</span>
                  <span className="font-semibold">${confirmInvoice.amount.toLocaleString()}</span>
                </div>
                <div className="mt-2 flex justify-between gap-4">
                  <span className="text-muted-foreground">After confirmation</span>
                  <span className="font-semibold">$0</span>
                </div>
              </div>

              <label className="grid gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Payment note
                <textarea
                  className={textareaClass}
                  value={paymentNote}
                  onChange={(event) => setPaymentNote(event.target.value)}
                  placeholder="Check #4421, ACH confirmation, cash received at office..."
                />
              </label>

              <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
                <Button type="button" variant="outline" onClick={closeConfirm}>
                  Cancel
                </Button>
                <Button type="button" disabled={isSaving} onClick={markInvoicePaid}>
                  <CreditCard className="h-4 w-4" />
                  {isSaving ? "Saving..." : "Confirm mark paid"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
