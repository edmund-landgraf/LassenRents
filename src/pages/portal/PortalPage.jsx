import { ArrowRight, CreditCard, FileText, Truck } from "lucide-react";
import { Card } from "@/components/ui";
import { clientAccount, rentalContracts } from "@/data/siteData";
import { isPortalAuthenticated, PortalShell } from "./PortalShell";

export function PortalPage() {
  if (!isPortalAuthenticated()) {
    window.location.replace("/portal/login");
    return null;
  }

  const currentContracts = rentalContracts.filter((contract) => contract.status === "Current").length;

  return (
    <PortalShell>
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-300">Client Portal</p>
        <h1 className="mt-2 text-3xl font-bold">Welcome back</h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-white/60">A quiet overview for your account. Use the menu for contracts, payments, and pickup requests.</p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Card className="border-white/10 bg-white/8 p-5 text-white">
          <p className="text-sm text-white/60">Open balance</p>
          <p className="mt-2 text-3xl font-bold">${clientAccount.balance}</p>
          <p className="mt-2 text-xs text-white/50">Next due {clientAccount.nextDue}</p>
        </Card>
        <Card className="border-white/10 bg-white/8 p-5 text-white">
          <p className="text-sm text-white/60">Current contracts</p>
          <p className="mt-2 text-3xl font-bold">{currentContracts}</p>
          <p className="mt-2 text-xs text-white/50">{rentalContracts.length} total contracts on file</p>
        </Card>
        <Card className="border-white/10 bg-white/8 p-5 text-white">
          <p className="text-sm text-white/60">Active rental</p>
          <p className="mt-2 text-xl font-bold">{clientAccount.rental.container}</p>
          <p className="mt-2 text-xs text-white/50">{clientAccount.rental.status}</p>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {[
          { label: "Rental Contracts", href: "/portal/contracts", icon: FileText, copy: "View current and past agreements." },
          { label: "Payments", href: "/portal/payment", icon: CreditCard, copy: "Pay the open balance." },
          { label: "Pickup", href: "/portal/end-rental", icon: Truck, copy: "End a rental and schedule pickup." }
        ].map((item) => (
          <a key={item.href} href={item.href} className="rounded-lg border border-white/10 bg-white/8 p-5 text-white transition hover:bg-white/12">
            <item.icon className="h-6 w-6 text-emerald-300" />
            <h2 className="mt-4 font-semibold">{item.label}</h2>
            <p className="mt-2 text-sm leading-6 text-white/60">{item.copy}</p>
            <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-300">
              Open <ArrowRight className="h-4 w-4" />
            </span>
          </a>
        ))}
      </div>
    </PortalShell>
  );
}
