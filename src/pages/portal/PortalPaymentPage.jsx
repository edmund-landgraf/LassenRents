import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, CreditCard, LockKeyhole, ReceiptText, ShieldCheck, X } from "lucide-react";
import { Badge, Card } from "@/components/ui";
import { clientAccount } from "@/data/siteData";
import { isPortalAuthenticated, PortalShell } from "./PortalShell";

function paymentTone(status) {
  if (status === "Paid") return "success";
  if (status === "Open" || status === "Due") return "warn";
  return "default";
}

export function PortalPaymentPage() {
  const ledgerItems = useMemo(
    () =>
      clientAccount.payments.map((item) => ({
        ...item,
        type: item.status === "Paid" ? "Payment paid" : "Payment due",
        description:
          item.status === "Paid"
            ? `${item.method} payment received for ${clientAccount.rental.container}`
            : `${clientAccount.rental.container} rental balance due`,
        canPay: item.status !== "Paid"
      })),
    []
  );
  const [selectedPaymentId, setSelectedPaymentId] = useState(ledgerItems.find((item) => item.canPay)?.id || ledgerItems[0]?.id);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
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

  const selectedPayment = ledgerItems.find((item) => item.id === selectedPaymentId) || ledgerItems[0];
  const dueItems = ledgerItems.filter((item) => item.canPay);
  const paidItems = ledgerItems.filter((item) => !item.canPay);

  if (!isPortalAuthenticated()) {
    window.location.replace("/portal/login");
    return null;
  }

  function updatePaymentForm(field, value) {
    setPaymentForm((current) => ({ ...current, [field]: value }));
  }

  function openPaymentModal() {
    setPaymentStatus("idle");
    setValidationMessage("");
    setIsPaymentModalOpen(true);
  }

  function closePaymentModal() {
    setIsPaymentModalOpen(false);
    setValidationMessage("");
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
      body: JSON.stringify({ amount: selectedPayment.amount, paymentId: selectedPayment.id, method: "test_card", ...paymentForm })
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
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-300">Payments</p>
        <h1 className="mt-2 text-3xl font-bold">Payment history and balances due</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/60">Select a paid or due payment to see details. Pay Now appears only for open balances.</p>
      </div>

      <section className="mt-8 grid min-w-0 gap-5" style={{ gridTemplateColumns: "minmax(0, 1fr) minmax(320px, 0.82fr)" }}>
        <Card className="min-w-0 border-white/10 bg-white p-0 text-slate-950">
          <div className="border-b border-border p-5">
            <h2 className="font-semibold">Payment ledger</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {paidItems.length} paid and {dueItems.length} due.
            </p>
          </div>
          <div className="divide-y divide-border">
            {ledgerItems.map((item) => (
              <button
                key={item.id}
                className={`grid w-full gap-3 px-5 py-4 text-left transition hover:bg-muted/60 sm:grid-cols-[1fr_auto] ${
                  selectedPayment?.id === item.id ? "bg-emerald-50" : ""
                }`}
                type="button"
                onClick={() => setSelectedPaymentId(item.id)}
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-bold">{item.id}</p>
                    <Badge tone={paymentTone(item.status)}>{item.status}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{item.date}</p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-lg font-bold">${item.amount}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{item.type}</p>
                </div>
              </button>
            ))}
          </div>
        </Card>

        {selectedPayment && (
          <Card className="min-w-0 border-white/10 bg-white/8 p-6 text-white">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-white/60">Selected item</p>
                <h2 className="mt-1 text-2xl font-bold">{selectedPayment.id}</h2>
              </div>
              <Badge tone={paymentTone(selectedPayment.status)}>{selectedPayment.status}</Badge>
            </div>

            <div className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
              <div>
                <p className="text-white/45">Type</p>
                <p className="font-semibold">{selectedPayment.type}</p>
              </div>
              <div>
                <p className="text-white/45">Amount</p>
                <p className="font-semibold">${selectedPayment.amount}</p>
              </div>
              <div>
                <p className="text-white/45">Date</p>
                <p className="font-semibold">{selectedPayment.date}</p>
              </div>
              <div>
                <p className="text-white/45">Method</p>
                <p className="font-semibold">{selectedPayment.method}</p>
              </div>
            </div>

            <div className="mt-6 rounded-md bg-slate-950/60 p-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-emerald-300">
                <ReceiptText className="h-4 w-4" />
                Detail
              </div>
              <p className="mt-3 text-sm leading-6 text-white/65">{selectedPayment.description}</p>
              <p className="mt-2 text-sm leading-6 text-white/65">
                Rental: {clientAccount.rental.container} at {clientAccount.rental.address}
              </p>
            </div>

            {selectedPayment.canPay ? (
              <button
                className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-md bg-amber-300 px-5 text-sm font-bold text-slate-950 transition hover:bg-amber-200"
                type="button"
                onClick={openPaymentModal}
              >
                <CreditCard className="h-4 w-4" />
                Pay now
              </button>
            ) : (
              <div className="mt-6 flex items-center gap-2 rounded-md border border-emerald-300/25 bg-emerald-300/10 p-3 text-sm font-semibold text-emerald-200">
                <CheckCircle2 className="h-4 w-4" />
                This payment has already been received.
              </div>
            )}
          </Card>
        )}
      </section>

      {isPaymentModalOpen && selectedPayment?.canPay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-8 py-10 backdrop-blur-sm" role="dialog" aria-modal="true">
          <Card className="max-h-[86vh] w-[min(1120px,calc(100vw-7rem))] overflow-y-auto border-white/10 bg-slate-950 p-0 text-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-white/10 p-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-300/70">Secure payment</p>
                <h2 className="mt-2 text-2xl font-bold">Pay {selectedPayment.id}</h2>
                <p className="mt-1 text-sm text-white/55">Amount due: ${selectedPayment.amount}</p>
              </div>
              <button className="rounded-md p-2 text-white/60 transition hover:bg-white/10 hover:text-white" type="button" onClick={closePaymentModal} aria-label="Close payment modal">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-0" style={{ gridTemplateColumns: "minmax(0, 1fr) minmax(280px, 0.55fr)" }}>
              <form className="p-5 md:p-7" onSubmit={failRealPaymentValidation}>
                <div className="flex items-center gap-3">
                  <ReceiptText className="h-5 w-5 text-amber-300" />
                  <h3 className="text-xl font-bold">Card details</h3>
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
                    Payment of ${selectedPayment.amount} has been received.
                  </div>
                )}
              </form>

              <aside className="border-t border-white/10 p-5 md:border-l md:border-t-0 md:p-7">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-300/70">Order summary</p>
                <div className="mt-6 flex items-start justify-between gap-4">
                  <div>
                    <p className="font-bold">{clientAccount.rental.container}</p>
                    <p className="mt-1 text-sm text-white/55">{selectedPayment.id} balance</p>
                  </div>
                  <p className="font-bold">${selectedPayment.amount}</p>
                </div>
                <div className="my-6 border-t border-white/10" />
                <div className="flex items-center justify-between gap-4">
                  <p className="font-semibold text-emerald-200">Total amount due</p>
                  <p className="text-4xl font-bold">${selectedPayment.amount}</p>
                </div>
                <div className="mt-6 rounded-md bg-black/30 p-4">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-amber-300">
                    <LockKeyhole className="h-4 w-4" />
                    Demo transaction
                  </div>
                  <p className="mt-3 text-xs leading-5 text-white/55">The API records a submitted test payment without charging a real card.</p>
                </div>
              </aside>
            </div>
          </Card>
        </div>
      )}
    </PortalShell>
  );
}
