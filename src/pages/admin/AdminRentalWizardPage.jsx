import { useState } from "react";
import { CalendarCheck2, CheckCircle2, Container, FileSignature, Truck } from "lucide-react";
import { Badge, Button, Card } from "@/components/ui";
import { demoWorkflow } from "@/data/siteData";
import { readQuoteLeads } from "@/lib/demoWorkflow";
import { AdminLayout } from "./AdminLayout";

const stepIcons = [FileSignature, Container, CalendarCheck2, CheckCircle2];

export function AdminRentalWizardPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [agreementReady, setAgreementReady] = useState(false);
  const selectedLeadId = new URLSearchParams(window.location.search).get("lead");
  const selectedLead = selectedLeadId ? readQuoteLeads().find((lead) => lead.id === selectedLeadId) : null;
  const seedWizard = demoWorkflow.rentalWizard;
  const wizard = {
    ...seedWizard,
    customer: selectedLead?.company || selectedLead?.name || seedWizard.customer,
    container: selectedLead?.container || seedWizard.container,
    startDate: selectedLead?.date || seedWizard.startDate,
    sourceContact: selectedLead?.name,
    sourceAddress: selectedLead?.address,
    sourceNotes: selectedLead?.notes
  };

  const totals = {
    dueToday: wizard.deposit + wizard.deliveryFee,
    monthly: wizard.monthlyRate,
    closeout: wizard.pickupFee
  };

  function handleBack() {
    if (activeStep > 0) {
      setActiveStep((step) => Math.max(0, step - 1));
      return;
    }

    window.location.assign(selectedLeadId ? `/admin/leads?lead=${encodeURIComponent(selectedLeadId)}` : "/admin/leads");
  }

  return (
    <AdminLayout>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Rental Creation</p>
          <h1 className="mt-2 text-3xl font-bold">Convert quote to rental agreement</h1>
          <p className="mt-3 max-w-3xl text-muted-foreground">Guided demo flow for customer, availability, terms, and agreement generation.</p>
        </div>
        <Button onClick={() => setAgreementReady(true)}>
          <FileSignature className="h-4 w-4" />
          Generate agreement
        </Button>
      </div>

      <Card className="mt-6 overflow-hidden">
        <div className="grid border-b border-border bg-muted md:grid-cols-4">
          {wizard.steps.map((step, index) => {
            const Icon = stepIcons[index];
            return (
              <button
                key={step}
                className={`flex items-center gap-3 border-b border-border p-4 text-left last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0 ${activeStep === index ? "bg-card" : ""}`}
                type="button"
                onClick={() => setActiveStep(index)}
              >
                <span className={`flex h-9 w-9 items-center justify-center rounded-md ${activeStep >= index ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground"}`}>
                  <Icon className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-xs text-muted-foreground">Step {index + 1}</p>
                  <p className="font-semibold">{step}</p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="grid gap-6 p-5 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="grid gap-4">
            {activeStep === 0 && (
              <Card className="p-5">
                <h2 className="font-semibold">Customer and site</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-md bg-muted p-3">
                    <p className="text-xs text-muted-foreground">Customer</p>
                    <p className="font-semibold">{wizard.customer}</p>
                  </div>
                  <div className="rounded-md bg-muted p-3">
                    <p className="text-xs text-muted-foreground">Requested start</p>
                    <p className="font-semibold">{wizard.startDate}</p>
                  </div>
                </div>
                {selectedLead && (
                  <div className="mt-4 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">
                    <p className="font-semibold">Imported from {selectedLead.id}</p>
                    <p className="mt-1">{wizard.sourceContact} - {wizard.sourceAddress || "Address not provided"}</p>
                    <p className="mt-1">{wizard.sourceNotes || "No placement notes provided."}</p>
                  </div>
                )}
                {!selectedLead && <p className="mt-4 text-sm text-muted-foreground">Source lead includes contact details, delivery address, duration, and placement notes from the public quote form.</p>}
              </Card>
            )}

            {activeStep === 1 && (
              <Card className="p-5">
                <h2 className="font-semibold">Availability matcher</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-emerald-900">
                    <Container className="h-5 w-5" />
                    <p className="mt-2 text-xs font-semibold uppercase tracking-wide">Unit</p>
                    <p className="font-semibold">{wizard.matchedUnit}</p>
                  </div>
                  <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-emerald-900">
                    <Truck className="h-5 w-5" />
                    <p className="mt-2 text-xs font-semibold uppercase tracking-wide">Truck</p>
                    <p className="font-semibold">{wizard.truck}</p>
                  </div>
                  <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-emerald-900">
                    <CalendarCheck2 className="h-5 w-5" />
                    <p className="mt-2 text-xs font-semibold uppercase tracking-wide">Window</p>
                    <p className="font-semibold">Jul 18 AM</p>
                  </div>
                </div>
              </Card>
            )}

            {activeStep === 2 && (
              <Card className="p-5">
                <h2 className="font-semibold">Terms</h2>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[520px] text-sm">
                    <tbody className="divide-y divide-border">
                      <tr><td className="py-3 text-muted-foreground">Monthly rate</td><td className="py-3 text-right font-semibold">${wizard.monthlyRate}</td></tr>
                      <tr><td className="py-3 text-muted-foreground">Delivery fee</td><td className="py-3 text-right font-semibold">${wizard.deliveryFee}</td></tr>
                      <tr><td className="py-3 text-muted-foreground">Pickup fee</td><td className="py-3 text-right font-semibold">${wizard.pickupFee}</td></tr>
                      <tr><td className="py-3 text-muted-foreground">Deposit</td><td className="py-3 text-right font-semibold">${wizard.deposit}</td></tr>
                    </tbody>
                  </table>
                </div>
              </Card>
            )}

            {activeStep === 3 && (
              <Card className="p-5">
                <h2 className="font-semibold">Agreement package</h2>
                <p className="mt-2 text-sm text-muted-foreground">Creates a draft rental agreement, schedules a delivery job, and stages the first invoice.</p>
                <div className="mt-4 rounded-md border border-border bg-muted p-4">
                  <p className="font-semibold">{agreementReady ? "Agreement RA-DRAFT-260714 is ready for signature." : "Generate agreement when terms are confirmed."}</p>
                </div>
              </Card>
            )}

            <div className="flex justify-between gap-3">
              <Button variant="outline" onClick={handleBack}>Back</Button>
              <Button disabled={activeStep === wizard.steps.length - 1} onClick={() => setActiveStep((step) => Math.min(wizard.steps.length - 1, step + 1))}>Next</Button>
            </div>
          </div>

          <Card className="p-5">
            <h2 className="font-semibold">Rental summary</h2>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between gap-3"><span className="text-muted-foreground">Customer</span><span className="font-semibold">{wizard.customer}</span></div>
              <div className="flex justify-between gap-3"><span className="text-muted-foreground">Container</span><span className="font-semibold">{wizard.container}</span></div>
              <div className="flex justify-between gap-3"><span className="text-muted-foreground">Unit</span><span className="font-semibold">{wizard.matchedUnit}</span></div>
              <div className="flex justify-between gap-3"><span className="text-muted-foreground">Truck</span><span className="font-semibold">{wizard.truck}</span></div>
            </div>
            <div className="mt-5 grid gap-3">
              <div className="rounded-md bg-muted p-3">
                <p className="text-xs text-muted-foreground">Due today</p>
                <p className="text-2xl font-bold">${totals.dueToday}</p>
              </div>
              <div className="rounded-md bg-muted p-3">
                <p className="text-xs text-muted-foreground">Monthly</p>
                <p className="text-2xl font-bold">${totals.monthly}</p>
              </div>
              <div className="rounded-md bg-muted p-3">
                <p className="text-xs text-muted-foreground">Closeout pickup</p>
                <p className="text-2xl font-bold">${totals.closeout}</p>
              </div>
            </div>
            {agreementReady && <Badge tone="success">Ready for customer signature</Badge>}
          </Card>
        </div>
      </Card>
    </AdminLayout>
  );
}
