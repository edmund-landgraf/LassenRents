import { useEffect, useMemo, useState } from "react";
import { AlertCircle, Camera, CheckCircle2, ClipboardCheck, PenLine, Save } from "lucide-react";
import { Badge, Button, Card } from "@/components/ui";
import { demoWorkflow } from "@/data/siteData";
import { cn } from "@/lib/utils";
import { AdminLayout } from "./AdminLayout";

const checklistSteps = demoWorkflow.inspections;

const textareaClass =
  "min-h-24 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";

function statusTone(status) {
  if (status === "Complete") return "success";
  if (status === "In progress") return "warn";
  return "default";
}

export function AdminInspectionPage() {
  const [inspections, setInspections] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [completionNote, setCompletionNote] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const selected = useMemo(
    () => inspections.find((item) => item.id === selectedId) || inspections[0] || null,
    [inspections, selectedId]
  );

  const openCount = useMemo(() => inspections.filter((item) => item.status !== "Complete").length, [inspections]);
  const completeCount = useMemo(() => inspections.filter((item) => item.status === "Complete").length, [inspections]);

  const readyToComplete = Boolean(
    selected &&
      selected.status !== "Complete" &&
      selected.checkedItems?.length === checklistSteps.length &&
      selected.photosAdded &&
      selected.signed
  );

  useEffect(() => {
    let ignore = false;

    async function loadInspections() {
      const sources = ["/api/admin/inspections", "/data/inspections.json"];
      let lastError = null;

      try {
        for (const source of sources) {
          try {
            const response = await fetch(source);
            if (!response.ok) throw new Error("Inspections could not be loaded.");
            const data = await response.json();
            if (ignore) return;
            setInspections(data);
            setSelectedId((current) => current || data[0]?.id || "");
            return;
          } catch (sourceError) {
            lastError = sourceError;
          }
        }
        throw lastError;
      } catch (loadError) {
        if (!ignore) setError(loadError.message);
      }
    }

    loadInspections();
    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (!selected) return;
    setCompletionNote(selected.completionNote || "");
  }, [selected?.id, selected?.completionNote]);

  async function persistInspection(patch, { complete = false } = {}) {
    if (!selected) return;
    setError("");
    setIsSaving(true);

    try {
      const endpoint = complete
        ? `/api/admin/inspections/${encodeURIComponent(selected.id)}/complete`
        : `/api/admin/inspections/${encodeURIComponent(selected.id)}`;
      const response = await fetch(endpoint, {
        method: complete ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch)
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Inspection could not be saved.");
      setInspections(payload.inspections);
      setSelectedId(payload.item.id);
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setIsSaving(false);
    }
  }

  function toggleItem(item) {
    if (!selected || selected.status === "Complete") return;
    const checkedItems = selected.checkedItems.includes(item)
      ? selected.checkedItems.filter((value) => value !== item)
      : [...selected.checkedItems, item];
    persistInspection({ checkedItems });
  }

  function selectInspection(id) {
    setSelectedId(id);
    setError("");
  }

  return (
    <AdminLayout>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Driver Flow</p>
          <h1 className="mt-2 text-3xl font-bold">Delivery and pickup inspection</h1>
          <p className="mt-3 max-w-3xl text-muted-foreground">
            Master list of inspection jobs with a detail checklist for photos, condition notes, and customer signoff.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge>{openCount} open</Badge>
          <Badge tone="success">{completeCount} complete</Badge>
        </div>
      </div>

      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      <section className="mt-6 grid gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
        <Card className="overflow-hidden">
          <div className="border-b border-border p-5">
            <h2 className="font-semibold">Inspection jobs</h2>
            <p className="text-sm text-muted-foreground">{inspections.length} file-backed records</p>
          </div>
          <div className="max-h-[40rem] divide-y divide-border overflow-y-auto">
            {inspections.length === 0 ? (
              <p className="px-5 py-8 text-sm text-muted-foreground">No inspections loaded yet.</p>
            ) : (
              inspections.map((item) => {
                const active = item.id === selected?.id;
                return (
                  <button
                    key={item.id}
                    className={cn("block w-full p-4 text-left transition hover:bg-muted", active && "bg-primary/5")}
                    type="button"
                    onClick={() => selectInspection(item.id)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold">{item.jobId}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{item.container}</p>
                      </div>
                      <Badge tone={statusTone(item.status)}>{item.status}</Badge>
                    </div>
                    <p className="mt-2 text-sm font-medium text-foreground">{item.customer}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {item.type} · {item.scheduledAt} · {item.driver}
                    </p>
                  </button>
                );
              })
            )}
          </div>
        </Card>

        {!selected ? (
          <Card className="flex items-center justify-center p-10 text-sm text-muted-foreground">Select an inspection job to continue.</Card>
        ) : (
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
            <Card className="p-5">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <ClipboardCheck className="h-5 w-5 text-primary" />
                    <h2 className="font-semibold">
                      {selected.jobId} · {selected.container}
                    </h2>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {selected.customer} · {selected.address || "Address not set"}
                  </p>
                </div>
                <Badge tone={statusTone(selected.status)}>{selected.status}</Badge>
              </div>

              <div className="mt-5 space-y-3">
                {checklistSteps.map((item, index) => (
                  <label
                    key={item}
                    className={cn(
                      "flex min-h-12 cursor-pointer items-start gap-3 rounded-md border border-border bg-background p-3 text-sm font-semibold hover:bg-muted",
                      selected.status === "Complete" && "cursor-default opacity-90"
                    )}
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded bg-muted text-[11px] font-bold text-muted-foreground">
                      {index + 1}
                    </span>
                    <input
                      className="mt-1 h-4 w-4 accent-primary"
                      type="checkbox"
                      checked={selected.checkedItems.includes(item)}
                      disabled={selected.status === "Complete" || isSaving}
                      onChange={() => toggleItem(item)}
                    />
                    <span>{item}</span>
                  </label>
                ))}
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <button
                  className="rounded-md border border-dashed border-border bg-muted p-5 text-left hover:border-primary disabled:opacity-60"
                  type="button"
                  disabled={selected.status === "Complete" || isSaving}
                  onClick={() => persistInspection({ photosAdded: true })}
                >
                  <Camera className="h-5 w-5 text-primary" />
                  <p className="mt-2 font-semibold">Add placement photos</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {selected.photosAdded ? "Four demo photo slots attached." : "Prototype photo slot for before/after condition."}
                  </p>
                </button>
                <button
                  className="rounded-md border border-dashed border-border bg-muted p-5 text-left hover:border-primary disabled:opacity-60"
                  type="button"
                  disabled={selected.status === "Complete" || isSaving}
                  onClick={() => persistInspection({ signed: true })}
                >
                  <PenLine className="h-5 w-5 text-primary" />
                  <p className="mt-2 font-semibold">Customer signature</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {selected.signed ? "Signature captured for demo." : "Tap to capture demo signature."}
                  </p>
                </button>
              </div>

              <label className="mt-5 grid gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Completion note
                <textarea
                  className={textareaClass}
                  value={completionNote}
                  disabled={selected.status === "Complete" || isSaving}
                  onChange={(event) => setCompletionNote(event.target.value)}
                  placeholder="Condition notes, access issues, customer comments..."
                />
              </label>
            </Card>

            <Card className="p-5">
              <h2 className="font-semibold">Closeout package</h2>
              <div className="mt-4 space-y-3 text-sm">
                <div className="rounded-md bg-muted p-3">
                  <p className="text-xs text-muted-foreground">Checked items</p>
                  <p className="text-2xl font-bold">
                    {selected.checkedItems.length}/{checklistSteps.length}
                  </p>
                </div>
                <div className="rounded-md bg-muted p-3">
                  <p className="text-xs text-muted-foreground">Photos</p>
                  <p className="font-semibold">{selected.photosAdded ? "4 demo photos attached" : "Needed"}</p>
                </div>
                <div className="rounded-md bg-muted p-3">
                  <p className="text-xs text-muted-foreground">Signature</p>
                  <p className="font-semibold">{selected.signed ? "Captured" : "Needed"}</p>
                </div>
                {selected.completionNote ? (
                  <div className="rounded-md border border-border bg-background p-3">
                    <p className="text-xs text-muted-foreground">Note</p>
                    <p className="mt-1 font-medium leading-6">{selected.completionNote}</p>
                  </div>
                ) : null}
              </div>

              {selected.status === "Complete" ? (
                <div className="mt-4 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-900">
                  Inspection completed{selected.completedAt ? ` · ${new Date(selected.completedAt).toLocaleString()}` : ""}.
                </div>
              ) : null}

              <Button
                className="mt-5 w-full"
                disabled={!readyToComplete || isSaving}
                onClick={() =>
                  persistInspection(
                    {
                      checkedItems: selected.checkedItems,
                      photosAdded: selected.photosAdded,
                      signed: selected.signed,
                      completionNote
                    },
                    { complete: true }
                  )
                }
              >
                {isSaving ? <Save className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                {isSaving ? "Saving..." : "Complete inspection"}
              </Button>
            </Card>
          </div>
        )}
      </section>
    </AdminLayout>
  );
}
