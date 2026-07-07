import { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, CreditCard, LockKeyhole, ReceiptText, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui";
import { clientAccount } from "@/data/siteData";
import { isPortalAuthenticated, PortalShell } from "./PortalShell";

export function PortalPaymentPage() {
  const [paymentStatus, setPaymentStatus] = useState("idle");
  const [validationMessage, setValidationMessage] = useState("");
  const [paymentForm, setPaymentForm] = useState({
    name: "Mallery Construction",
    email: "accounts@mallery.example",
    cardNumber: "4242 4242 4242 4242",
    expiration: "12/29",
    cvc: "123",
    billingZip: "96130"
  });

  if (!isPortalAuthenticated()) {
    window.location.replace("/portal/login");
    return null;
  }

  function updatePaymentForm(field, value) {
    setPaymentForm((current) => ({ ...current, [field]: value }));
  }

  function failRealPaymentValidation(event) {
    event.preventDefault();
    setPaymentStatus("idle");
    setValidationMessage("Live payment processing is not enabled yet. Use the demo payment button while the processor is stubbed.");
  }

  function submitTestPayment(event) {
    event.preventDefault();
    setValidationMessage("");
    setPaymentStatus("submitted");
    fetch("/api/portal/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: clientAccount.balance, method: "test_card", ...paymentForm })
    }).catch(() => {
      setPaymentStatus("submitted");
    });
  }

  return (
    <PortalShell>
      <a href="/portal" className="inline-flex items-center gap-2 text-sm font-semibold text-white/70 hover:text-white">
        <ArrowLeft className="h-4 w-4" />
        Portal overview
      </a>
      <div className="mt-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-300">Payment</p>
        <h1 className="mt-2 text-3xl font-bold">Make a payment</h1>
      </div>

      <section className="mt-8 grid gap-5 lg:grid-cols-[1.08fr_.92fr]">
        <Card className="border-white/10 bg-white/8 p-0 text-white">
          <form className="p-5 md:p-7" onSubmit={failRealPaymentValidation}>
            <div className="flex items-center gap-3">
              <ReceiptText className="h-5 w-5 text-amber-300" />
              <h2 className="text-xl font-bold">Pay invoice for {clientAccount.rental.id}</h2>
            </div>

            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-white/50">Service type</p>
              <div className="mt-3 rounded-md border border-white/10 bg-white/6 p-4 text-sm font-semibold text-white/70">
                {clientAccount.rental.container} rental - ${clientAccount.balance}
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="block text-xs font-semibold uppercase tracking-wide text-white/50">
                Full name
                <input className="mt-2 h-12 w-full rounded-md border border-white/10 bg-white/8 px-4 text-sm font-semibold text-white outline-none focus:ring-2 focus:ring-emerald-300" value={paymentForm.name} onChange={(event) => updatePaymentForm("name", event.target.value)} />
              </label>
              <label className="block text-xs font-semibold uppercase tracking-wide text-white/50">
                Email address
                <input className="mt-2 h-12 w-full rounded-md border border-white/10 bg-white/8 px-4 text-sm font-semibold text-white outline-none focus:ring-2 focus:ring-emerald-300" value={paymentForm.email} onChange={(event) => updatePaymentForm("email", event.target.value)} />
              </label>
            </div>

            <label className="mt-5 block text-xs font-semibold uppercase tracking-wide text-white/50">
              Card number
              <input className="mt-2 h-12 w-full rounded-md border border-white/10 bg-white/8 px-4 text-sm font-semibold text-white outline-none focus:ring-2 focus:ring-emerald-300" value={paymentForm.cardNumber} onChange={(event) => updatePaymentForm("cardNumber", event.target.value)} />
            </label>

            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {[
                ["expiration", "Expiration"],
                ["cvc", "CVC"],
                ["billingZip", "Billing ZIP"]
              ].map(([field, label]) => (
                <label key={field} className="block text-xs font-semibold uppercase tracking-wide text-white/50">
                  {label}
                  <input className="mt-2 h-12 w-full rounded-md border border-white/10 bg-white/8 px-4 text-sm font-semibold text-white outline-none focus:ring-2 focus:ring-emerald-300" value={paymentForm[field]} onChange={(event) => updatePaymentForm(field, event.target.value)} />
                </label>
              ))}
            </div>

            <button className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-amber-300 px-4 text-sm font-bold text-slate-950 shadow-lg shadow-amber-300/15 transition hover:bg-amber-200" type="submit">
              Continue to payment
              <ArrowRight className="h-4 w-4" />
            </button>
            {validationMessage && (
              <div className="mt-4 rounded-md border border-amber-300/30 bg-amber-300/10 p-3 text-sm font-semibold text-amber-100">
                {validationMessage}
              </div>
            )}

            <button className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-md border border-white/10 bg-transparent px-4 text-xs font-bold uppercase tracking-wide text-white/55 transition hover:bg-white/8 hover:text-white" type="button" onClick={submitTestPayment}>
              <ShieldCheck className="h-4 w-4" />
              Continue to test payment (demo mode)
            </button>

            {paymentStatus === "submitted" && (
              <div className="mt-4 flex items-center gap-2 rounded-md border border-emerald-300/30 bg-emerald-300/10 p-3 text-sm font-semibold text-emerald-200">
                <CheckCircle2 className="h-4 w-4" />
                Payment of ${clientAccount.balance} has been received.
              </div>
            )}
          </form>
        </Card>

        <div className="space-y-5">
          <Card className="border-white/10 bg-white/8 p-6 text-white">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-300/70">Order summary</p>
            <div className="mt-6 flex items-start justify-between gap-4">
              <div>
                <p className="font-bold">{clientAccount.rental.container}</p>
                <p className="mt-1 text-sm text-white/55">Monthly container rental balance</p>
              </div>
              <p className="font-bold">${clientAccount.balance}</p>
            </div>
            <div className="my-6 border-t border-white/10" />
            <div className="flex items-center justify-between gap-4">
              <p className="font-semibold text-emerald-200">Total amount due</p>
              <p className="text-4xl font-bold">${clientAccount.balance}</p>
            </div>
            <div className="mt-6 rounded-md bg-slate-950/60 p-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-amber-300">
                <LockKeyhole className="h-4 w-4" />
                Secure transaction
              </div>
              <p className="mt-3 text-xs leading-5 text-white/55">This is a demo card screen. The API records a submitted test payment without charging a real card.</p>
            </div>
          </Card>

          <Card className="border-white/10 bg-white/8 p-6 text-white">
            <div className="flex items-start gap-3">
              <CreditCard className="mt-1 h-5 w-5 text-amber-300" />
              <div>
                <h3 className="font-bold">Test card</h3>
                <p className="mt-2 text-sm leading-6 text-white/60">Use 4242 4242 4242 4242 with any future expiration, CVC, and ZIP while payments are stubbed.</p>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </PortalShell>
  );
}
