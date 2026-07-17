import { useMemo, useState } from "react";
import {
  Activity,
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  ClipboardList,
  Container,
  CreditCard,
  Download,
  Home,
  LogOut,
  Menu,
  Route,
  Truck,
  Users,
  X
} from "lucide-react";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";

export function statusTone(status) {
  if (status === "Available") return "success";
  if (status === "Maintenance" || status === "Service") return "danger";
  if (status === "Due back" || status === "Committed" || status === "Assigned") return "warn";
  return "default";
}

const nav = [
  { label: "Dashboard", href: "/admin", icon: Home },
  { label: "Leads", href: "/admin/leads", icon: ClipboardList },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "New Rental", href: "/admin/rentals/new", icon: ClipboardCheck },
  { label: "Dispatch", href: "/admin/dispatch", icon: Route },
  { label: "Invoices", href: "/admin/invoices", icon: CreditCard },
  { label: "Inventory", href: "/admin/inventory", icon: Container },
  { label: "Trucks", href: "/admin/trucks", icon: Truck },
  { label: "Calendar", href: "/admin/calendar", icon: CalendarDays },
  { label: "Inspection", href: "/admin/inspection", icon: ClipboardCheck },
  { label: "Activity", href: "/admin/activity", icon: Activity },
  { label: "Tax Export", href: "/admin/tax-export", icon: Download }
];

function isActive(pathname, href) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = typeof window !== "undefined" ? window.location.pathname : "/admin";
  const activeLabel = useMemo(() => nav.find((item) => isActive(pathname, item.href))?.label || "Admin", [pathname]);
  const isAuthed = typeof window !== "undefined" && window.localStorage.getItem("lassen.admin.auth") === "test-admin";

  if (!isAuthed) {
    const nextPath = `${window.location.pathname}${window.location.search}`;
    window.location.replace(`/admin/login?next=${encodeURIComponent(nextPath)}`);
    return null;
  }

  function logout() {
    window.localStorage.removeItem("lassen.admin.auth");
    window.location.assign("/admin/login");
  }

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="border-b border-white/10 px-5 py-5">
        <a href="/admin" className="block">
          <p className="font-display text-xl tracking-wide text-white">Lassen Rents</p>
          <p className="mt-1 text-xs font-medium uppercase tracking-[0.16em] text-emerald-300/80">Ops console</p>
        </a>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {nav.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold transition",
                active ? "bg-white/10 text-white shadow-sm ring-1 ring-white/10" : "text-slate-300 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className={cn("h-4 w-4 shrink-0", active ? "text-emerald-300" : "text-slate-400")} />
              {item.label}
            </a>
          );
        })}
      </nav>

      <div className="space-y-2 border-t border-white/10 p-4">
        <a
          href="/help"
          className="flex h-10 items-center justify-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
        >
          <BookOpen className="h-4 w-4" />
          Help
        </a>
        <Button
          variant="ghost"
          className="h-10 w-full justify-center text-slate-200 hover:bg-white/10 hover:text-white"
          onClick={logout}
        >
          <LogOut className="h-4 w-4" />
          Log out
        </Button>
        <a href="/" className="block text-center text-xs font-medium text-slate-400 hover:text-slate-200">
          Back to public site
        </a>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#eef1f4] text-foreground">
      <div className="flex min-h-screen">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 bg-[#0f171c] lg:block">{sidebar}</aside>

        {mobileOpen ? (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button className="absolute inset-0 bg-slate-950/55" type="button" aria-label="Close menu" onClick={() => setMobileOpen(false)} />
            <aside className="relative h-full w-72 max-w-[85vw] bg-[#0f171c] shadow-2xl">{sidebar}</aside>
          </div>
        ) : null}

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur">
            <div className="flex h-14 items-center justify-between gap-3 px-4 sm:px-6">
              <div className="flex items-center gap-3">
                <Button variant="ghost" className="lg:hidden" aria-label="Open navigation" onClick={() => setMobileOpen(true)}>
                  {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Admin</p>
                  <p className="text-sm font-semibold text-slate-900">{activeLabel}</p>
                </div>
              </div>
              <div className="hidden items-center gap-2 sm:flex">
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-200">
                  Test admin
                </span>
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
