import { ArrowRight, CheckCircle2, Container, CreditCard, Mail, MapPinned, Menu, Phone, Wrench } from "lucide-react";
import { Button, Card } from "@/components/ui";
import { saveContactIntent } from "@/lib/contactIntent";

export function PublicHeader() {
  const nav = [
    { label: "Containers", href: "/containers" },
    { label: "Options", href: "/options" },
    { label: "Delivery", href: "/delivery" },
    { label: "Trucking", href: "/trucking" },
    { label: "Gallery", href: "/gallery" },
    { label: "Help", href: "/help" },
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
            onClick={() => saveContactIntent("Containers")}
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
    <footer className="border-t border-border bg-muted/45">
      <section className="container py-10">
        <div className="grid gap-4 lg:grid-cols-4">
          <Card className="p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
              <MapPinned className="h-5 w-5" />
            </div>
            <h2 className="mt-4 font-bold">Northeastern California</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Serving Lassen, Plumas, and Modoc Counties with prompt local container rental and sales support.
            </p>
          </Card>

          <Card className="overflow-hidden">
            <div className="flex h-36 items-center justify-center bg-white p-3">
              <img className="max-h-full w-full object-contain" src="/assets/site/custom-containers.png" alt="Custom order new and used containers" />
            </div>
            <div className="p-5">
              <div className="flex items-center gap-2 text-sm font-bold">
                <Container className="h-4 w-4 text-primary" />
                20 ft and 40 ft storage
              </div>
              <div className="mt-3 grid gap-2 text-sm text-muted-foreground">
                {["Onsite rentals and sales", "Tilt trailer delivery and pickup", "No hidden costs"].map((item) => (
                  <p key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    {item}
                  </p>
                ))}
              </div>
            </div>
          </Card>

          <Card className="overflow-hidden">
            <div className="flex h-36 items-center justify-center bg-white p-3">
              <img className="max-h-full w-full object-contain" src="/assets/site/insta-modifications.gif" alt="Authorized agent for Insta Modifications" />
            </div>
            <div className="p-5">
              <div className="flex items-center gap-2 text-sm font-bold">
                <Wrench className="h-4 w-4 text-primary" />
                Modifications and payment
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Windows, dividers, doors, shelving, lockboxes, vents, and card payment support.
              </p>
            </div>
          </Card>

          <Card className="overflow-hidden">
            <div className="grid grid-cols-[92px_1fr] gap-4 p-5">
              <img className="h-28 w-full rounded-md object-cover" src="/assets/site/terry-mallery.jpg" alt="Terry Mallery, owner of Lassen Rents" />
              <div>
                <p className="font-bold">Terry Mallery</p>
                <p className="mt-1 text-sm text-muted-foreground">Owner</p>
                <div className="mt-3 grid gap-2 text-sm text-muted-foreground">
                  <a className="flex items-center gap-2 hover:text-foreground" href="mailto:lassenrents@gmail.com">
                    <Mail className="h-4 w-4 text-primary" />
                    Email
                  </a>
                  <a className="flex items-center gap-2 hover:text-foreground" href="tel:15302573865">
                    <Phone className="h-4 w-4 text-primary" />
                    530.257.3865
                  </a>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <div className="border-t border-border py-8">
        <div className="container grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="font-bold">Lassen Rents</p>
            <p className="mt-2 text-sm text-muted-foreground">Locally owned and operated - Prompt, friendly service.</p>
          </div>
          <div className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-4">
            <a className="flex items-center gap-2 hover:text-foreground" href="/request-quote" onClick={() => saveContactIntent("Containers")}>
              <CreditCard className="h-4 w-4" /> Request quote
            </a>
          <a className="flex items-center gap-2 hover:text-foreground" href="/help">
            <CheckCircle2 className="h-4 w-4" /> Help center
          </a>
          <a className="flex items-center gap-2 hover:text-foreground" href="mailto:lassenrents@gmail.com">
            <Mail className="h-4 w-4" /> lassenrents@gmail.com
          </a>
          <a className="flex items-center gap-2 hover:text-foreground" href="tel:15302573865">
            <Phone className="h-4 w-4" /> 530.257.3865
          </a>
          </div>
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
