import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui";

export function NotFoundPage() {
  return (
    <main className="container flex min-h-screen flex-col items-center justify-center text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-primary">Not found</p>
      <h1 className="mt-3 text-4xl font-bold">That page is not in the prototype.</h1>
      <p className="mt-3 max-w-xl text-muted-foreground">Use the public site, client portal, or admin login routes.</p>
      <a href="/" className="mt-8">
        <Button>
          <ArrowLeft className="h-4 w-4" />
          Back home
        </Button>
      </a>
    </main>
  );
}
