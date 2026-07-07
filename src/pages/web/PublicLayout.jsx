import { ArrowRight, Container, Mail, Menu, Phone } from "lucide-react";
import { Button } from "@/components/ui";

export function PublicHeader() {
  const nav = [
    { label: "Containers", href: "/containers" },
    { label: "Options", href: "/options" },
    { label: "Delivery", href: "/delivery" },
    { label: "Trucking", href: "/trucking" },
    { label: "Gallery", href: "/gallery" },
    { label: "Portal", href: "/portal/login" },
    { label: "Admin", href: "/admin/login" }
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/94 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <a href="/" className="flex items-center gap-3 font-bold">
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Container className="h-5 w-5" />
          </span>
          <span>
            <span className="block leading-tight">Lassen Rents</span>
            <span className="block text-xs font-medium text-muted-foreground">Susanville container rental</span>
          </span>
        </a>
        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <a key={item.label} href={item.href} className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground">
              {item.label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-2 sm:flex">
          <Button variant="outline">
            <Phone className="h-4 w-4" />
            530.257.3865
          </Button>
          <a
            href="/request-quote"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Request quote
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
        <Button variant="ghost" className="md:hidden" aria-label="Open navigation">
          <Menu className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}

export function PublicFooter() {
  return (
    <footer className="border-t border-border bg-muted/45 py-10">
      <div className="container grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <p className="font-bold">Lassen Rents</p>
          <p className="mt-2 text-sm text-muted-foreground">Terry Mallery, Owner - Locally owned and operated - Prompt, friendly service.</p>
        </div>
        <div className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
          <a className="flex items-center gap-2 hover:text-foreground" href="mailto:lassenrents@gmail.com">
            <Mail className="h-4 w-4" /> lassenrents@gmail.com
          </a>
          <a className="flex items-center gap-2 hover:text-foreground" href="tel:15302573865">
            <Phone className="h-4 w-4" /> 530.257.3865
          </a>
        </div>
      </div>
    </footer>
  );
}

export function PublicLayout({ children }) {
  return (
    <>
      <PublicHeader />
      <main>{children}</main>
      <PublicFooter />
    </>
  );
}
