import { useState } from "react";
import { Camera, CheckCircle2, ClipboardCheck, PenLine } from "lucide-react";
import { Badge, Button, Card } from "@/components/ui";
import { demoWorkflow } from "@/data/siteData";
import { AdminLayout } from "./AdminLayout";

export function AdminInspectionPage() {
  const [checkedItems, setCheckedItems] = useState(["Confirm container is empty and accessible"]);
  const [signed, setSigned] = useState(false);
  const [photosAdded, setPhotosAdded] = useState(false);
  const [inspectionComplete, setInspectionComplete] = useState(false);

  function toggleItem(item) {
    setCheckedItems((current) => (current.includes(item) ? current.filter((value) => value !== item) : [...current, item]));
  }

  const complete = checkedItems.length === demoWorkflow.inspections.length && signed && photosAdded;

  return (
    <AdminLayout>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Driver Flow</p>
          <h1 className="mt-2 text-3xl font-bold">Delivery and pickup inspection</h1>
          <p className="mt-3 max-w-3xl text-muted-foreground">Mobile-friendly checklist for photos, condition notes, access confirmation, and customer signoff.</p>
        </div>
        <Badge tone={complete ? "success" : "warn"}>{complete ? "Ready to close" : "In progress"}</Badge>
      </div>

      <section className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
        <Card className="p-5">
          <div className="flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">JOB-766 - LR-20HC-118</h2>
          </div>
          <div className="mt-5 space-y-3">
            {demoWorkflow.inspections.map((item) => (
              <label key={item} className="flex min-h-12 cursor-pointer items-start gap-3 rounded-md border border-border bg-background p-3 text-sm font-semibold hover:bg-muted">
                <input className="mt-1 h-4 w-4 accent-primary" type="checkbox" checked={checkedItems.includes(item)} onChange={() => toggleItem(item)} />
                <span>{item}</span>
              </label>
            ))}
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <button className="rounded-md border border-dashed border-border bg-muted p-5 text-left hover:border-primary" type="button" onClick={() => setPhotosAdded(true)}>
              <Camera className="h-5 w-5 text-primary" />
              <p className="mt-2 font-semibold">Add placement photos</p>
              <p className="mt-1 text-sm text-muted-foreground">{photosAdded ? "Four demo photo slots attached." : "Prototype photo slot for before/after condition."}</p>
            </button>
            <button className="rounded-md border border-dashed border-border bg-muted p-5 text-left hover:border-primary" type="button" onClick={() => setSigned(true)}>
              <PenLine className="h-5 w-5 text-primary" />
              <p className="mt-2 font-semibold">Customer signature</p>
              <p className="mt-1 text-sm text-muted-foreground">{signed ? "Signature captured for demo." : "Tap to capture demo signature."}</p>
            </button>
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="font-semibold">Closeout package</h2>
          <div className="mt-4 space-y-3 text-sm">
            <div className="rounded-md bg-muted p-3">
              <p className="text-xs text-muted-foreground">Checked items</p>
              <p className="text-2xl font-bold">{checkedItems.length}/{demoWorkflow.inspections.length}</p>
            </div>
            <div className="rounded-md bg-muted p-3">
              <p className="text-xs text-muted-foreground">Photos</p>
              <p className="font-semibold">{photosAdded ? "4 demo photos attached" : "Needed"}</p>
            </div>
            <div className="rounded-md bg-muted p-3">
              <p className="text-xs text-muted-foreground">Signature</p>
              <p className="font-semibold">{signed ? "Captured" : "Needed"}</p>
            </div>
          </div>
          {inspectionComplete && <div className="mt-4 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-900">Inspection completed and closeout package staged.</div>}
          <Button className="mt-5 w-full" disabled={!complete} onClick={() => setInspectionComplete(true)}>
            <CheckCircle2 className="h-4 w-4" />
            Complete inspection
          </Button>
        </Card>
      </section>
    </AdminLayout>
  );
}
