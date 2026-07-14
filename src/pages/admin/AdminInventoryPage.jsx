import { useEffect, useMemo, useState } from "react";
import { AlertCircle, Plus, Save, X } from "lucide-react";
import { Badge, Button, Card } from "@/components/ui";
import { AdminLayout, statusTone } from "./AdminLayout";

const emptyForm = {
  id: "",
  length: "20 ft",
  highCube: false,
  status: "Available",
  location: "Yard A",
  customer: "-",
  due: "-",
  bookValue: "",
  monthlyDepreciation: "",
  utilization: "0%"
};

const statusOptions = ["Available", "Committed", "Rented", "Due back", "Hold", "Maintenance"];

function currency(value) {
  return `$${Number(value || 0).toLocaleString()}`;
}

function normalizePercent(value) {
  const text = String(value || "0").trim();
  return text.endsWith("%") ? text : `${text}%`;
}

function Field({ label, children }) {
  return (
    <label className="grid gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
      {label}
      {children}
    </label>
  );
}

const inputClass = "h-10 rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";

export function AdminInventoryPage() {
  const [inventory, setInventory] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadInventory() {
      const sources = ["/api/admin/container-inventory-file", "/data/container-inventory.json"];
      let lastError = null;

      try {
        for (const source of sources) {
          try {
            const response = await fetch(source);
            if (!response.ok) throw new Error("Inventory source could not be loaded.");
            const data = await response.json();
            if (!ignore) setInventory(data);
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

    loadInventory();
    return () => {
      ignore = true;
    };
  }, []);

  const statusSummary = useMemo(
    () =>
      statusOptions.map((status) => ({
        label: status,
        count: inventory.filter((item) => item.status === status).length,
        tone: statusTone(status)
      })),
    [inventory]
  );

  function updateForm(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function openModal() {
    setError("");
    setForm(emptyForm);
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

    if (!form.id.trim()) {
      setError("Container ID is required.");
      return;
    }

    const item = {
      ...form,
      id: form.id.trim(),
      location: form.location.trim() || "Yard A",
      customer: form.customer.trim() || "-",
      due: form.due.trim() || "-",
      bookValue: Number(form.bookValue) || 0,
      monthlyDepreciation: Number(form.monthlyDepreciation) || 0,
      utilization: normalizePercent(form.utilization)
    };

    setIsSaving(true);

    try {
      const response = await fetch("/api/admin/container-inventory-file", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item)
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Container could not be saved.");
      setInventory(payload.inventory);
      closeModal();
    } catch (saveError) {
      setError(saveError.message);
      setIsSaving(false);
    }
  }

  return (
    <AdminLayout>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Fleet Assets</p>
          <h1 className="mt-2 text-3xl font-bold">Container Inventory</h1>
          <p className="mt-3 max-w-3xl text-muted-foreground">Manage units like rental cars: available, committed, rented, due back, on hold, and out for maintenance.</p>
        </div>
        <Button onClick={openModal}>
          <Plus className="h-4 w-4" />
          Add container
        </Button>
      </div>

      {error && !isModalOpen && (
        <div className="mt-4 flex items-center gap-2 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      <Card className="mt-6 overflow-hidden">
        <div className="flex flex-col justify-between gap-4 border-b border-border p-5 md:flex-row md:items-center">
          <h2 className="font-semibold">Status summary</h2>
          <div className="flex flex-wrap gap-2">
            {statusSummary.map((item) => (
              <Badge key={item.label} tone={item.tone}>
                {item.label}: {item.count}
              </Badge>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] text-sm">
            <thead className="bg-muted text-left text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-medium">Unit</th>
                <th className="px-5 py-3 font-medium">Length</th>
                <th className="px-5 py-3 font-medium">Cube</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Customer</th>
                <th className="px-5 py-3 font-medium">Location</th>
                <th className="px-5 py-3 font-medium">Due / commitment</th>
                <th className="px-5 py-3 font-medium">Book value</th>
                <th className="px-5 py-3 font-medium">Dep/mo</th>
                <th className="px-5 py-3 font-medium">Util.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {inventory.map((item) => (
                <tr key={item.id}>
                  <td className="px-5 py-4 font-medium">{item.id}</td>
                  <td className="px-5 py-4">{item.length}</td>
                  <td className="px-5 py-4">{item.highCube ? "High cube" : "Standard"}</td>
                  <td className="px-5 py-4"><Badge tone={statusTone(item.status)}>{item.status}</Badge></td>
                  <td className="px-5 py-4">{item.customer}</td>
                  <td className="px-5 py-4 text-muted-foreground">{item.location}</td>
                  <td className="px-5 py-4 text-muted-foreground">{item.due}</td>
                  <td className="px-5 py-4">{currency(item.bookValue)}</td>
                  <td className="px-5 py-4">${item.monthlyDepreciation}</td>
                  <td className="px-5 py-4">{item.utilization}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-5 py-8 backdrop-blur-sm">
          <div className="max-h-[88vh] w-full max-w-3xl overflow-y-auto rounded-lg border border-border bg-card text-card-foreground shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">Inventory</p>
                <h2 className="mt-1 text-2xl font-bold">Add container</h2>
                <p className="mt-1 text-sm text-muted-foreground">Saved rows append to the static inventory JSON file through the Express stub.</p>
              </div>
              <button className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground" type="button" onClick={closeModal} aria-label="Close add container modal">
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
                <Field label="Container ID">
                  <input className={inputClass} value={form.id} onChange={(event) => updateForm("id", event.target.value)} placeholder="LR-20-140" />
                </Field>
                <Field label="Status">
                  <select className={inputClass} value={form.status} onChange={(event) => updateForm("status", event.target.value)}>
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Length">
                  <select className={inputClass} value={form.length} onChange={(event) => updateForm("length", event.target.value)}>
                    <option value="20 ft">20 ft</option>
                    <option value="40 ft">40 ft</option>
                  </select>
                </Field>
                <label className="flex h-10 items-center gap-3 self-end rounded-md border border-border bg-background px-3 text-sm font-semibold">
                  <input className="h-4 w-4 accent-primary" type="checkbox" checked={form.highCube} onChange={(event) => updateForm("highCube", event.target.checked)} />
                  High cube
                </label>
                <Field label="Customer">
                  <input className={inputClass} value={form.customer} onChange={(event) => updateForm("customer", event.target.value)} placeholder="-" />
                </Field>
                <Field label="Location">
                  <input className={inputClass} value={form.location} onChange={(event) => updateForm("location", event.target.value)} placeholder="Yard A" />
                </Field>
                <Field label="Due / commitment">
                  <input className={inputClass} value={form.due} onChange={(event) => updateForm("due", event.target.value)} placeholder="Reserved Jul 18" />
                </Field>
                <Field label="Utilization">
                  <input className={inputClass} value={form.utilization} onChange={(event) => updateForm("utilization", event.target.value)} placeholder="72%" />
                </Field>
                <Field label="Book value">
                  <input className={inputClass} min="0" type="number" value={form.bookValue} onChange={(event) => updateForm("bookValue", event.target.value)} placeholder="5200" />
                </Field>
                <Field label="Monthly depreciation">
                  <input className={inputClass} min="0" type="number" value={form.monthlyDepreciation} onChange={(event) => updateForm("monthlyDepreciation", event.target.value)} placeholder="87" />
                </Field>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
                <Button className="sm:w-auto" type="button" variant="outline" onClick={closeModal}>
                  Cancel
                </Button>
                <Button className="sm:w-auto" type="submit" disabled={isSaving}>
                  <Save className="h-4 w-4" />
                  {isSaving ? "Saving..." : "Save container"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
