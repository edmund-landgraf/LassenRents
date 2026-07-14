import { useMemo, useState } from "react";
import { CreditCard, Mail, ReceiptText, RotateCcw, X } from "lucide-react";
import { Badge, Button, Card } from "@/components/ui";
import { demoWorkflow } from "@/data/siteData";
import { AdminLayout } from "./AdminLayout";

function invoiceTone(status) {
  if (status === "Paid") return "success";
  if (status === "Past due") return "danger";
  return "warn";
}

export function AdminInvoicesPage() {
  const [invoices, setInvoices] = useState(demoWorkflow.invoices);
  const [confirmInvoice, setConfirmInvoice] = useState(null);
  const [lastPayment, setLastPayment] = useState(null);
  const totals = useMemo(() => ({
    open: invoices.filter((invoice) => invoice.status !== "Paid").reduce((sum, invoice) => sum + invoice.amount, 0),
    pastDue: invoices.filter((invoice) => invoice.status === "Past due").reduce((sum, invoice) => sum + invoice.amount, 0),
    paid: invoices.filter((invoice) => invoice.status === "Paid").length
  }), [invoices]);

  function markInvoicePaid() {
    if (!confirmInvoice) return;

    setInvoices((current) => current.map((invoice) => {
      if (invoice.id !== confirmInvoice.id) return invoice;
      const paidInvoice = {
        ...invoice,
        previousAmount: invoice.amount,
        previousAge: invoice.age,
        previousStatus: invoice.status,
        status: "Paid",
        amount: 0,
        age: "Paid just now"
      };
      setLastPayment({ invoice: paidInvoice, restored: invoice });
      return paidInvoice;
    }));
    setConfirmInvoice(null);
  }

  function undoPayment(invoiceId = lastPayment?.invoice.id) {
    if (!invoiceId) return;

    setInvoices((current) => current.map((invoice) => {
      if (invoice.id !== invoiceId || !invoice.previousAmount) return invoice;
      return {
        ...invoice,
        status: invoice.previousStatus,
        amount: invoice.previousAmount,
        age: invoice.previousAge,
        previousAmount: undefined,
        previousAge: undefined,
        previousStatus: undefined
      };
    }));
    setLastPayment(null);
  }

  function sendReminder(invoiceId) {
    setInvoices((current) => current.map((invoice) => (invoice.id === invoiceId ? { ...invoice, age: "Reminder sent just now" } : invoice)));
  }

  return (
    <AdminLayout>
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">Billing</p>
        <h1 className="mt-2 text-3xl font-bold">Invoices and payments</h1>
        <p className="mt-3 max-w-3xl text-muted-foreground">Admin view for open balances, aging, payment recording, and invoice reminders.</p>
      </div>

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
            <p className="font-semibold">{lastPayment.invoice.id} was marked paid and removed from open receivables.</p>
            <Button className="h-9 bg-emerald-700 hover:bg-emerald-800" onClick={() => undoPayment()}>
              <RotateCcw className="h-4 w-4" />
              Undo payment
            </Button>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="bg-muted text-left text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-medium">Invoice</th>
                <th className="px-5 py-3 font-medium">Customer</th>
                <th className="px-5 py-3 font-medium">Due</th>
                <th className="px-5 py-3 font-medium">Aging</th>
                <th className="px-5 py-3 text-right font-medium">Amount</th>
                <th className="px-5 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {invoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td className="px-5 py-4">
                    <p className="font-semibold">{invoice.id}</p>
                    <Badge tone={invoiceTone(invoice.status)}>{invoice.status}</Badge>
                  </td>
                  <td className="px-5 py-4">{invoice.customer}</td>
                  <td className="px-5 py-4">{invoice.due}</td>
                  <td className="px-5 py-4 text-muted-foreground">{invoice.age}</td>
                  <td className="px-5 py-4 text-right font-semibold">${invoice.amount.toLocaleString()}</td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <Button className="h-9" variant="outline" onClick={() => sendReminder(invoice.id)}>
                        <Mail className="h-4 w-4" />
                        Send
                      </Button>
                      {invoice.status === "Paid" && invoice.previousAmount ? (
                        <Button className="h-9" variant="outline" onClick={() => undoPayment(invoice.id)}>
                          <RotateCcw className="h-4 w-4" />
                          Undo
                        </Button>
                      ) : (
                        <Button className="h-9" disabled={invoice.status === "Paid"} onClick={() => setConfirmInvoice(invoice)}>
                          <CreditCard className="h-4 w-4" />
                          Mark paid
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
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
              <button className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground" type="button" onClick={() => setConfirmInvoice(null)} aria-label="Close payment confirmation">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-4 px-6 py-5">
              <p className="text-sm leading-6 text-muted-foreground">
                This demo action will mark the invoice paid, set the displayed open balance for this invoice to $0, and remove ${confirmInvoice.amount.toLocaleString()} from open receivables.
              </p>
              <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
                <p className="font-semibold">No real payment will be processed.</p>
                <p className="mt-1">Use this only when you want to simulate receiving payment for {confirmInvoice.customer}.</p>
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
              <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
                <Button type="button" variant="outline" onClick={() => setConfirmInvoice(null)}>
                  Cancel
                </Button>
                <Button type="button" onClick={markInvoicePaid}>
                  <CreditCard className="h-4 w-4" />
                  Confirm mark paid
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
