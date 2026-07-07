import { useEffect, useState } from "react";
import { ArrowLeft, CalendarClock, CheckCircle2, Send, Truck } from "lucide-react";
import { Button, Card } from "@/components/ui";
import { isPortalAuthenticated, PortalShell } from "./PortalShell";

const endRentalWorkflowFiles = [
  "/workflows/end-rental/01-schedule-pickup.md",
  "/workflows/end-rental/02-pickup.md",
  "/workflows/end-rental/03-inspect-damages.md",
  "/workflows/end-rental/04-close-contract-refund-deposit.md"
];

function parseWorkflowStep(markdown, index) {
  const lines = markdown.split(/\r?\n/).filter(Boolean);
  const title = lines.find((line) => line.startsWith("# "))?.replace("# ", "") || `Step ${index + 1}`;
  const summary = lines.find((line) => !line.startsWith("#") && !line.startsWith("-")) || "";
  const checklist = lines.filter((line) => line.startsWith("- ")).map((line) => line.replace("- ", ""));

  return { title, summary, checklist };
}

export function PortalEndRentalPage() {
  const [workflowSteps, setWorkflowSteps] = useState([]);
  const [pickupRequest, setPickupRequest] = useState({
    requestedDate: "2026-08-03",
    accessNotes: "Container is empty, unlocked, and accessible from the driveway.",
    contactPhone: "530-257-3865"
  });
  const [requestStatus, setRequestStatus] = useState("idle");

  useEffect(() => {
    let isMounted = true;

    Promise.all(endRentalWorkflowFiles.map((file) => fetch(file).then((response) => response.text())))
      .then((files) => {
        if (isMounted) setWorkflowSteps(files.map(parseWorkflowStep));
      })
      .catch(() => {
        if (isMounted) setWorkflowSteps([]);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (!isPortalAuthenticated()) {
    window.location.replace("/portal/login");
    return null;
  }

  function updatePickupRequest(field, value) {
    setPickupRequest((current) => ({ ...current, [field]: value }));
  }

  function submitPickupRequest(event) {
    event.preventDefault();
    setRequestStatus("submitted");
    fetch("/api/portal/rentals/rent-1048/request-pickup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pickupRequest)
    }).catch(() => {
      setRequestStatus("submitted");
    });
  }

  return (
    <PortalShell>
      <a href="/portal" className="inline-flex items-center gap-2 text-sm font-semibold text-white/70 hover:text-white">
        <ArrowLeft className="h-4 w-4" />
        Portal overview
      </a>
      <div className="mt-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-300">End rental</p>
        <h1 className="mt-2 text-3xl font-bold">Schedule pickup and close rental</h1>
      </div>

      <section className="mt-8 grid gap-5 lg:grid-cols-[.95fr_1.05fr]">
        <Card className="border-white/10 bg-white p-0 text-slate-950">
          <div className="border-b border-border p-5">
            <p className="text-sm text-muted-foreground">Pickup request</p>
            <h2 className="mt-1 text-xl font-semibold">Request to end rental and schedule pickup</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Submit a preferred pickup date and site notes. The contract stays active until the container is picked up, inspected, and closed.
            </p>
          </div>
          <form className="space-y-4 p-5" onSubmit={submitPickupRequest}>
            <label className="block text-sm font-semibold">
              Preferred pickup date
              <input className="mt-2 h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring" type="date" value={pickupRequest.requestedDate} onChange={(event) => updatePickupRequest("requestedDate", event.target.value)} />
            </label>
            <label className="block text-sm font-semibold">
              Contact phone
              <input className="mt-2 h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring" value={pickupRequest.contactPhone} onChange={(event) => updatePickupRequest("contactPhone", event.target.value)} />
            </label>
            <label className="block text-sm font-semibold">
              Access notes
              <textarea className="mt-2 min-h-28 w-full rounded-md border border-input bg-background px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-ring" value={pickupRequest.accessNotes} onChange={(event) => updatePickupRequest("accessNotes", event.target.value)} />
            </label>
            <div className="flex flex-wrap items-center gap-3">
              <Button type="submit">
                <Send className="h-4 w-4" />
                Submit pickup request
              </Button>
              {requestStatus === "submitted" && (
                <span className="inline-flex items-center gap-2 rounded-md bg-emerald-100 px-3 py-2 text-sm font-semibold text-emerald-800">
                  <CheckCircle2 className="h-4 w-4" />
                  Pickup request submitted
                </span>
              )}
            </div>
          </form>
        </Card>

        <Card className="border-white/10 bg-white/8 p-5 text-white">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-white/65">Workflow</p>
              <h2 className="mt-1 text-xl font-semibold">End rental process</h2>
            </div>
            <Truck className="h-7 w-7 text-emerald-300" />
          </div>
          <div className="mt-5 space-y-3">
            {workflowSteps.map((step, index) => (
              <div key={step.title} className="rounded-md border border-white/10 bg-white/6 p-4">
                <div className="flex items-start gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-emerald-300 text-sm font-bold text-slate-950">{index + 1}</span>
                  <div>
                    <h3 className="font-semibold">{step.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-white/70">{step.summary}</p>
                    <div className="mt-3 space-y-2">
                      {step.checklist.slice(0, 3).map((item) => (
                        <p key={item} className="flex items-start gap-2 text-xs leading-5 text-white/65">
                          <CalendarClock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-300" />
                          {item}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {!workflowSteps.length && <p className="text-sm text-white/65">Loading workflow markdown...</p>}
          </div>
        </Card>
      </section>
    </PortalShell>
  );
}
