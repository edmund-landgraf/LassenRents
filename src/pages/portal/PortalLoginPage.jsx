import { ArrowLeft, CreditCard, FileText, LockKeyhole, UserRound } from "lucide-react";
import { Button, Card } from "@/components/ui";

export function PortalLoginPage() {
  function loginAsTestClient() {
    window.localStorage.setItem("lassen.portal.auth", "test-client");
    window.location.assign("/portal");
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="container grid min-h-screen items-center gap-10 py-10 lg:grid-cols-[.9fr_1.1fr]">
        <section>
          <a href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-white/70 hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            Back to Lassen Rents
          </a>
          <div className="mt-12 max-w-xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-emerald-400 text-slate-950">
              <CreditCard className="h-6 w-6" />
            </div>
            <h1 className="mt-6 text-4xl font-bold leading-tight sm:text-5xl">Client portal</h1>
            <p className="mt-4 text-lg leading-8 text-white/70">
              Customers can view their rental agreement, active container, balance, and payment history.
            </p>
            <div className="mt-8 grid gap-3 text-sm text-white/75 sm:grid-cols-2">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-emerald-300" />
                Rental agreements
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-emerald-300" />
                Payments and receipts
              </div>
            </div>
          </div>
        </section>
        <Card className="border-white/10 bg-white p-6 text-slate-950">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-slate-950 text-white">
              <LockKeyhole className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Sign in</h2>
              <p className="text-sm text-muted-foreground">Stubbed for the front-end prototype.</p>
            </div>
          </div>
          <div className="mt-6 grid gap-4">
            <label className="grid gap-2 text-sm font-medium">
              Email
              <input className="h-10 rounded-md border border-input px-3 text-sm outline-none focus:ring-2 focus:ring-ring" defaultValue="client@example.com" />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Password
              <input className="h-10 rounded-md border border-input px-3 text-sm outline-none focus:ring-2 focus:ring-ring" defaultValue="password" type="password" />
            </label>
            <Button className="h-11" onClick={loginAsTestClient}>
              <UserRound className="h-4 w-4" />
              Login as test client
            </Button>
          </div>
        </Card>
      </div>
    </main>
  );
}
