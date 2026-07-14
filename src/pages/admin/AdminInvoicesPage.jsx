import { useMemo, useState } from "react";
import { CreditCard, Mail, ReceiptText } from "lucide-react";
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
  const totals = useMemo(() => ({
    open: invoices.filter((invoice) => invoice.status !== "Paid").reduce((sum, invoice) => sum + invoice.amount, 0),
    pastDue: invoices.filter((invoice) => invoice.status === "Past due").reduce((sum, invoice) => sum + invoice.amount, 0),
    paid: invoices.filter((invoice) => invoice.status === "Paid").length
  }), [invoices]);

  function recordPayment(invoiceId) {
    setInvoices((current) => current.map((invoice) => (invoice.id === invoiceId ? { ...invoice, status: "Paid", amount: 0, age: "Paid just now" } : invoice)));
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
                      <Button className="h-9" disabled={invoice.status === "Paid"} onClick={() => recordPayment(invoice.id)}>
                        <CreditCard className="h-4 w-4" />
                        Record
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </AdminLayout>
  );
}
