import { useEffect, useState } from "react";
import { ArrowRight, Container, Mail, Menu, Phone, X } from "lucide-react";
import { Button } from "@/components/ui";
import { saveContactIntent } from "@/lib/contactIntent";

const primaryNav = [
  { label: "Containers", href: "/containers" },
  { label: "Options", href: "/options" },
  { label: "Delivery", href: "/delivery" },
  { label: "Trucking", href: "/trucking" },
  { label: "Gallery", href: "/gallery" },
  { label: "Portal", href: "/portal/login" },
  { label: "Admin", href: "/admin/login" }
];

export function PublicHeader() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="yard-header sticky top-0 z-40 border-b border-border/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between gap-4">
        <a href="/" className="flex items-center gap-3">
          <span className="container-badge flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Container className="h-5 w-5" />
          </span>
          <span>
            <span className="font-display block text-lg leading-none tracking-wide text-foreground">Lassen Rents</span>
            <span className="mt-1 block text-xs font-medium text-muted-foreground">Susanville, CA</span>
          </span>
        </a>

        <nav className="hidden items-center gap-1 lg:flex">
          {primaryNav.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 sm:flex">
          <a
            href="tel:15302573865"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-border bg-card px-3 text-sm font-semibold text-foreground transition hover:bg-muted"
          >
            <Phone className="h-4 w-4" />
            530.257.3865
          </a>
          <a
            href="/request-quote"
            onClick={() => saveContactIntent("Containers")}
            className="bolt-strip inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition hover:-translate-y-0.5 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Request quote
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <Button
          variant="ghost"
          className="lg:hidden"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {open ? (
        <div className="border-t border-border bg-card lg:hidden">
          <nav className="container flex flex-col gap-1 py-4">
            {primaryNav.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="rounded-md px-3 py-3 text-base font-semibold text-foreground hover:bg-muted"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <a href="/help" className="rounded-md px-3 py-3 text-base font-semibold text-muted-foreground hover:bg-muted" onClick={() => setOpen(false)}>
              Help
            </a>
            <div className="mt-2 grid gap-2 border-t border-border pt-4">
              <a
                href="tel:15302573865"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-border px-4 text-sm font-semibold"
              >
                <Phone className="h-4 w-4" />
                530.257.3865
              </a>
              <a
                href="/request-quote"
                onClick={() => {
                  saveContactIntent("Containers");
                  setOpen(false);
                }}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground"
              >
                Request quote
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}

export function PublicFooter() {
  return (
    <footer className="border-t border-border bg-foreground text-white">
      <div className="container grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-display text-3xl tracking-wide">Lassen Rents</p>
          <p className="mt-3 max-w-sm text-sm leading-6 text-white/70">
            Locally owned container rental, sales, PinPoint delivery, modifications, and trucking for Lassen, Plumas, and Modoc Counties.
          </p>
          <div className="mt-6 flex items-center gap-4">
            <img
              className="h-16 w-16 rounded-md object-cover"
              src="/assets/site/terry-mallery-headshot.jpg"
              alt="Terry Mallery, owner of Lassen Rents"
            />
            <div>
              <p className="font-semibold">Terry Mallery</p>
              <p className="text-sm text-white/65">Owner</p>
            </div>
          </div>
        </div>

        <div>
          <p className="font-display text-lg tracking-wide text-white/90">Services</p>
          <div className="mt-4 grid gap-2 text-sm text-white/70">
            {primaryNav.map((item) => (
              <a key={item.href} className="hover:text-white" href={item.href}>
                {item.label}
              </a>
            ))}
          </div>
        </div>

        <div>
          <p className="font-display text-lg tracking-wide text-white/90">Contact</p>
          <div className="mt-4 grid gap-3 text-sm text-white/70">
            <a className="inline-flex items-center gap-2 hover:text-white" href="tel:15302573865">
              <Phone className="h-4 w-4" />
              530.257.3865
            </a>
            <a className="inline-flex items-center gap-2 hover:text-white" href="mailto:lassenrents@gmail.com">
              <Mail className="h-4 w-4" />
              lassenrents@gmail.com
            </a>
            <a className="inline-flex items-center gap-2 hover:text-white" href="/request-quote" onClick={() => saveContactIntent("Containers")}>
              Request a quote
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-5">
        <div className="container flex flex-col gap-2 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Lassen Rents, Inc.</p>
          <p>Prompt local service. No hidden costs.</p>
        </div>
      </div>
    </footer>
  );
}

export function PublicLayout({ children }) {
  return (
    <div className="yard-shell">
      <PublicHeader />
      <main>{children}</main>
      <PublicFooter />
    </div>
  );
}
