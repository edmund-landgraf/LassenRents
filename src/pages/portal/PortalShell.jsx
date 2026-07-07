import { ArrowLeft, CreditCard, FileText, LayoutDashboard, LogOut, Truck } from "lucide-react";
import { Button } from "@/components/ui";

export function isPortalAuthenticated() {
  return window.localStorage.getItem("lassen.portal.auth") === "test-client";
}

export function PortalShell({ children }) {
  const path = window.location.pathname.replace(/\/$/, "") || "/portal";
  const nav = [
    { label: "Dashboard", href: "/portal", icon: LayoutDashboard },
    { label: "Rental Contracts", href: "/portal/contracts", icon: FileText },
    { label: "Payments", href: "/portal/payment", icon: CreditCard },
    { label: "Pickup", href: "/portal/end-rental", icon: Truck }
  ];

  function logout() {
    window.localStorage.removeItem("lassen.portal.auth");
    window.location.assign("/portal/login");
  }

  return (
    <main className="min-h-screen bg-slate-950 py-8 text-white">
      <div className="container">
        <header className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <a href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-white/70 hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            Back to site
          </a>
          <Button variant="outline" className="border-white/20 bg-transparent text-white hover:bg-white/10" onClick={logout}>
            <LogOut className="h-4 w-4" />
            Log out
          </Button>
        </header>
        <nav className="mb-8 flex gap-2 overflow-x-auto rounded-lg border border-white/10 bg-white/5 p-2">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`inline-flex h-10 shrink-0 items-center gap-2 rounded-md px-3 text-sm font-semibold transition ${
                path === item.href ? "bg-white text-slate-950" : "text-white/65 hover:bg-white/10 hover:text-white"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </a>
          ))}
        </nav>
        {children}
      </div>
    </main>
  );
}
