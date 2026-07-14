import { useEffect, useState } from "react";
import { AlertCircle, Plus, Save, Trash2, Truck, X } from "lucide-react";
import { Badge, Button, Card } from "@/components/ui";
import { AdminLayout, statusTone } from "./AdminLayout";

const emptyTruck = {
  id: "",
  name: "",
  status: "Available",
  lengths: ["20 ft"],
  highCube: false,
  driver: "Unassigned",
  nextService: "",
  note: ""
};

const statusOptions = ["Available", "Assigned", "Service", "Maintenance"];
const lengthOptions = ["20 ft", "40 ft"];
const inputClass = "h-10 rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";

function Field({ label, children }) {
  return (
    <label className="grid gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
      {label}
      {children}
    </label>
  );
}

export function AdminTruckPage() {
  const [trucks, setTrucks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(emptyTruck);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function loadTrucks() {
      const sources = ["/api/admin/trucks-file", "/data/trucks.json"];
      let lastError = null;

      try {
        for (const source of sources) {
          try {
            const response = await fetch(source);
            if (!response.ok) throw new Error("Trucks could not be loaded.");
            const data = await response.json();
            if (!ignore) setTrucks(data);
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

    loadTrucks();
    return () => {
      ignore = true;
    };
  }, []);

  function updateForm(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function toggleLength(length) {
    setForm((current) => {
      const hasLength = current.lengths.includes(length);
      return {
        ...current,
        lengths: hasLength ? current.lengths.filter((item) => item !== length) : [...current.lengths, length]
      };
    });
  }

  function openModal() {
    setError("");
    setForm({
      ...emptyTruck,
      id: `T-${Date.now().toString().slice(-5)}`
    });
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setIsSaving(false);
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!form.id.trim() || !form.name.trim()) {
      setError("Truck ID and truck name are required.");
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch("/api/admin/trucks-file", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Truck could not be saved.");
      setTrucks(payload.trucks);
      closeModal();
    } catch (saveError) {
      setError(saveError.message);
      setIsSaving(false);
    }
  }

  async function deleteTruck(truckId) {
    setError("");

    try {
      const response = await fetch(`/api/admin/trucks-file/${encodeURIComponent(truckId)}`, { method: "DELETE" });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Truck could not be deleted.");
      setTrucks(payload.trucks);
    } catch (deleteError) {
      setError(deleteError.message);
    }
  }

  return (
    <AdminLayout>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Dispatch Capacity</p>
          <h1 className="mt-2 text-3xl font-bold">Truck Capability</h1>
          <p className="mt-3 max-w-3xl text-muted-foreground">Match jobs to trucks that can haul 20 ft, 40 ft, standard-height, and high-cube containers.</p>
        </div>
        <Button onClick={openModal}>
          <Plus className="h-4 w-4" />
          Add truck
        </Button>
      </div>

      {error && !isModalOpen && (
        <div className="mt-4 flex items-center gap-2 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {trucks.map((truck) => (
          <Card key={truck.id} className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-primary" />
                  <h2 className="font-semibold">{truck.name}</h2>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{truck.id} - {truck.note || "No notes"}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge tone={statusTone(truck.status)}>{truck.status}</Badge>
                <button className="rounded-md p-2 text-muted-foreground hover:bg-rose-50 hover:text-rose-700" type="button" onClick={() => deleteTruck(truck.id)} aria-label={`Delete ${truck.id}`}>
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {truck.lengths.length ? truck.lengths.map((length) => <Badge key={length}>{length}</Badge>) : <Badge tone="danger">No haul</Badge>}
              <Badge tone={truck.highCube ? "success" : "default"}>{truck.highCube ? "High cube OK" : "Standard only"}</Badge>
            </div>
            <div className="mt-5 grid gap-3 rounded-md bg-muted p-4 text-sm sm:grid-cols-2">
              <div>
                <p className="text-xs text-muted-foreground">Driver</p>
                <p className="font-semibold">{truck.driver}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Next service</p>
                <p className="font-semibold">{truck.nextService || "Not scheduled"}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-5 py-8 backdrop-blur-sm">
          <div className="max-h-[88vh] w-full max-w-3xl overflow-y-auto rounded-lg border border-border bg-card text-card-foreground shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">Truck Capability</p>
                <h2 className="mt-1 text-2xl font-bold">Add truck</h2>
                <p className="mt-1 text-sm text-muted-foreground">Saved rows append to the static trucks JSON file through the Express stub.</p>
              </div>
              <button className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground" type="button" onClick={closeModal} aria-label="Close add truck modal">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form className="grid gap-5 px-6 py-5" onSubmit={handleSubmit}>
              {error && (
                <div className="flex items-center gap-2 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Truck ID">
                  <input className={inputClass} value={form.id} onChange={(event) => updateForm("id", event.target.value)} />
                </Field>
                <Field label="Truck name">
                  <input className={inputClass} value={form.name} onChange={(event) => updateForm("name", event.target.value)} placeholder="Rollback 40" />
                </Field>
                <Field label="Status">
                  <select className={inputClass} value={form.status} onChange={(event) => updateForm("status", event.target.value)}>
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Driver">
                  <input className={inputClass} value={form.driver} onChange={(event) => updateForm("driver", event.target.value)} placeholder="Ray" />
                </Field>
                <Field label="Next service">
                  <input className={inputClass} type="date" value={form.nextService} onChange={(event) => updateForm("nextService", event.target.value)} />
                </Field>
                <label className="flex h-10 items-center gap-3 self-end rounded-md border border-border bg-background px-3 text-sm font-semibold">
                  <input className="h-4 w-4 accent-primary" type="checkbox" checked={form.highCube} onChange={(event) => updateForm("highCube", event.target.checked)} />
                  Handles high cube
                </label>
              </div>

              <div className="grid gap-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Supported lengths</p>
                <div className="flex flex-wrap gap-3">
                  {lengthOptions.map((length) => (
                    <label key={length} className="flex h-10 items-center gap-3 rounded-md border border-border bg-background px-3 text-sm font-semibold">
                      <input className="h-4 w-4 accent-primary" type="checkbox" checked={form.lengths.includes(length)} onChange={() => toggleLength(length)} />
                      {length}
                    </label>
                  ))}
                </div>
              </div>

              <Field label="Notes">
                <input className={inputClass} value={form.note} onChange={(event) => updateForm("note", event.target.value)} placeholder="Tight placement jobs" />
              </Field>

              <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
                <Button className="sm:w-auto" type="button" variant="outline" onClick={closeModal}>
                  Cancel
                </Button>
                <Button className="sm:w-auto" type="submit" disabled={isSaving}>
                  <Save className="h-4 w-4" />
                  {isSaving ? "Saving..." : "Save truck"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
