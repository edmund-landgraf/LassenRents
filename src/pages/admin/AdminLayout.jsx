import { Activity, ArrowLeft, BookOpen, CalendarDays, ClipboardCheck, ClipboardList, Container, CreditCard, Download, Home, LogOut, Route, Truck, Users } from "lucide-react";
import { Button } from "@/components/ui";

export function statusTone(status) {
  if (status === "Available") return "success";
  if (status === "Maintenance" || status === "Service") return "danger";
  if (status === "Due back" || status === "Committed" || status === "Assigned") return "warn";
  return "default";
}

export function AdminLayout({ children }) {
  if (window.localStorage.getItem("lassen.admin.auth") !== "test-admin") {
    const nextPath = `${window.location.pathname}${window.location.search}`;
    window.location.replace(`/admin/login?next=${encodeURIComponent(nextPath)}`);
    return null;
  }

  function logout() {
    window.localStorage.removeItem("lassen.admin.auth");
    window.location.assign("/admin/login");
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

  return (
    <main className="min-h-screen bg-background py-8">
      <div className="container">
        <header className="mb-8 flex flex-col gap-4">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <a href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              Back to site
            </a>
            <div className="flex flex-wrap gap-2">
              <a className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-border bg-background px-4 text-sm font-semibold text-foreground transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" href="/help">
                <BookOpen className="h-4 w-4" />
                Help
              </a>
              <Button variant="outline" onClick={logout}>
                <LogOut className="h-4 w-4" />
                Log out
              </Button>
            </div>
          </div>
          <nav className="flex flex-wrap gap-2 rounded-lg border border-border bg-card p-2">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="inline-flex h-10 shrink-0 items-center gap-2 rounded-md px-3 text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </a>
            ))}
          </nav>
        </header>
        {children}
      </div>
    </main>
  );
}
