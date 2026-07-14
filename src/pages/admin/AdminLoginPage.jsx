import { ArrowLeft, LockKeyhole, ShieldCheck, Truck, UserCog } from "lucide-react";
import { Button, Card } from "@/components/ui";

export function AdminLoginPage() {
  function loginAsTestAdmin() {
    window.localStorage.setItem("lassen.admin.auth", "test-admin");
    const nextPath = new URLSearchParams(window.location.search).get("next");
    window.location.assign(nextPath?.startsWith("/admin") ? nextPath : "/admin");
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container grid min-h-screen items-center gap-10 py-10 lg:grid-cols-[.9fr_1.1fr]">
        <section>
          <a href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to Lassen Rents
          </a>
          <div className="mt-12 max-w-xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Truck className="h-6 w-6" />
            </div>
            <h1 className="mt-6 text-4xl font-bold leading-tight sm:text-5xl">Admin operations</h1>
            <p className="mt-4 text-lg leading-8 text-muted-foreground">
              Track inventory, rentals, dispatch, trucks, workers, payments, due-back containers, and maintenance.
            </p>
            <div className="mt-8 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Fleet-style workflow
              </div>
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-primary" />
                Dispatch assignments
              </div>
            </div>
          </div>
        </section>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <LockKeyhole className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Admin sign in</h2>
              <p className="text-sm text-muted-foreground">Stubbed for the front-end prototype.</p>
            </div>
          </div>
          <div className="mt-6 grid gap-4">
            <label className="grid gap-2 text-sm font-medium">
              Email
              <input className="h-10 rounded-md border border-input px-3 text-sm outline-none focus:ring-2 focus:ring-ring" defaultValue="admin@lassenrents.test" />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Password
              <input className="h-10 rounded-md border border-input px-3 text-sm outline-none focus:ring-2 focus:ring-ring" defaultValue="password" type="password" />
            </label>
            <Button className="h-11" onClick={loginAsTestAdmin}>
              <UserCog className="h-4 w-4" />
              Login as test admin
            </Button>
          </div>
        </Card>
      </div>
    </main>
  );
}
