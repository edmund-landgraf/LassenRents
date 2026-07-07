import { ArrowLeft, CalendarDays, Container, Download, Home, LogOut, Truck } from "lucide-react";
import { Button } from "@/components/ui";

export function statusTone(status) {
  if (status === "Available") return "success";
  if (status === "Maintenance" || status === "Service") return "danger";
  if (status === "Due back" || status === "Committed" || status === "Assigned") return "warn";
  return "default";
}

export function AdminLayout({ children }) {
  if (window.localStorage.getItem("lassen.admin.auth") !== "test-admin") {
    window.location.replace("/admin/login");
    return null;
  }

  function logout() {
    window.localStorage.removeItem("lassen.admin.auth");
    window.location.assign("/admin/login");
  }

  const nav = [
    { label: "Dashboard", href: "/admin", icon: Home },
    { label: "Inventory", href: "/admin/inventory", icon: Container },
    { label: "Trucks", href: "/admin/trucks", icon: Truck },
    { label: "Calendar", href: "/admin/calendar", icon: CalendarDays },
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
            <Button variant="outline" onClick={logout}>
              <LogOut className="h-4 w-4" />
              Log out
            </Button>
          </div>
          <nav className="flex gap-2 overflow-x-auto rounded-lg border border-border bg-card p-2">
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
