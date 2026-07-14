import { useState } from "react";
import { Mail, MessageSquareText, Phone, ReceiptText, UserRound } from "lucide-react";
import { Badge, Button, Card } from "@/components/ui";
import { demoWorkflow, rentalContracts } from "@/data/siteData";
import { AdminLayout } from "./AdminLayout";

export function AdminCustomersPage() {
  const [selectedId, setSelectedId] = useState(demoWorkflow.customers[0].id);
  const [invoiceDrafted, setInvoiceDrafted] = useState(false);
  const selectedCustomer = demoWorkflow.customers.find((customer) => customer.id === selectedId) || demoWorkflow.customers[0];
  const openInvoices = demoWorkflow.invoices.filter((invoice) => invoice.customer === selectedCustomer.name);
  const contracts = rentalContracts.filter((contract) => contract.address || contract.container).slice(0, selectedCustomer.rentals + 1);

  return (
    <AdminLayout>
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">Customers</p>
        <h1 className="mt-2 text-3xl font-bold">Customer records and account history</h1>
        <p className="mt-3 max-w-3xl text-muted-foreground">A single place for contact details, balances, rentals, notes, and follow-up actions.</p>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[360px_minmax(0,1fr)]">
        <Card className="overflow-hidden">
          <div className="border-b border-border p-5">
            <h2 className="font-semibold">Accounts</h2>
            <p className="text-sm text-muted-foreground">{demoWorkflow.customers.length} demo records</p>
          </div>
          <div className="divide-y divide-border">
            {demoWorkflow.customers.map((customer) => (
              <button
                key={customer.id}
                className={`block w-full p-4 text-left transition hover:bg-muted ${customer.id === selectedId ? "bg-primary/5" : ""}`}
                type="button"
                onClick={() => {
                  setSelectedId(customer.id);
                  setInvoiceDrafted(false);
                }}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold">{customer.name}</p>
                  <Badge tone={customer.balance > 0 ? "warn" : "success"}>${customer.balance}</Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{customer.contact}</p>
              </button>
            ))}
          </div>
        </Card>

        <div className="grid gap-5">
          <Card className="p-5">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
              <div>
                <div className="flex items-center gap-2">
                  <UserRound className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold">{selectedCustomer.name}</h2>
                </div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{selectedCustomer.notes}</p>
              </div>
              <Badge tone={selectedCustomer.status === "Active" ? "success" : "default"}>{selectedCustomer.status}</Badge>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <a className="rounded-md border border-border p-3 text-sm hover:bg-muted" href={`tel:${selectedCustomer.phone}`}>
                <Phone className="h-4 w-4 text-primary" />
                <p className="mt-2 font-semibold">{selectedCustomer.phone}</p>
              </a>
              <a className="rounded-md border border-border p-3 text-sm hover:bg-muted" href={`mailto:${selectedCustomer.email}`}>
                <Mail className="h-4 w-4 text-primary" />
                <p className="mt-2 font-semibold">{selectedCustomer.email}</p>
              </a>
              <div className="rounded-md border border-border p-3 text-sm">
                <MessageSquareText className="h-4 w-4 text-primary" />
                <p className="mt-2 font-semibold">{selectedCustomer.lastTouch}</p>
              </div>
            </div>
          </Card>

          <div className="grid gap-5 xl:grid-cols-2">
            <Card className="p-5">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">Rentals</h2>
                <Badge>{selectedCustomer.rentals} active</Badge>
              </div>
              <div className="mt-4 space-y-3">
                {contracts.map((contract) => (
                  <div key={contract.id} className="rounded-md border border-border p-3 text-sm">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold">{contract.agreementNumber}</p>
                      <Badge tone={contract.status === "Current" ? "success" : "default"}>{contract.status}</Badge>
                    </div>
                    <p className="mt-1 text-muted-foreground">{contract.container} - {contract.address}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-5">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">Invoices</h2>
                <ReceiptText className="h-5 w-5 text-primary" />
              </div>
              <div className="mt-4 space-y-3">
                {openInvoices.length ? openInvoices.map((invoice) => (
                  <div key={invoice.id} className="rounded-md border border-border p-3 text-sm">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold">{invoice.id}</p>
                      <Badge tone={invoice.status === "Past due" ? "danger" : invoice.status === "Paid" ? "success" : "warn"}>{invoice.status}</Badge>
                    </div>
                    <p className="mt-1 text-muted-foreground">${invoice.amount} due {invoice.due} - {invoice.age}</p>
                  </div>
                )) : <p className="rounded-md bg-muted p-3 text-sm text-muted-foreground">No open invoices for this customer.</p>}
              </div>
              <div className="mt-5">
                <Button variant="outline" onClick={() => setInvoiceDrafted(true)}>
                  <ReceiptText className="h-4 w-4" />
                  Create invoice
                </Button>
                {invoiceDrafted && <span className="ml-3"><Badge tone="success">Draft invoice staged</Badge></span>}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
