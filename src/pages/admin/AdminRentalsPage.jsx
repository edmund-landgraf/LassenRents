import { useEffect, useMemo, useState } from "react";
import { AlertCircle, Plus, Save, Trash2, X } from "lucide-react";
import { Badge, Button, Card } from "@/components/ui";
import { readQuoteLeads } from "@/lib/demoWorkflow";
import { AdminLayout, statusTone } from "./AdminLayout";

const statusOptions = ["Draft", "Active", "Due back", "Closed", "Cancelled"];

const rateBySize = {
  "5 x 9": 89,
  "20 ft": 145,
  "20 ft High Cube": 165,
  "40 ft": 225,
  "40 ft High Cube": 255,
  Refrigerated: 420
};

const emptyForm = {
  id: "",
  agreementNumber: "",
  customer: "",
  customerEmail: "",
  customerPhone: "",
  container: "",
  containerSize: "20 ft",
  status: "Draft",
  siteAddress: "",
  startDate: "",
  dueBackDate: "",
  rentalRate: 145,
  rateUnit: "monthly",
  deliveryFee: 150,
  pickupFee: 150,
  depositAmount: 150,
  notes: ""
};

const inputClass =
  "h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";
const textareaClass =
  "min-h-24 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";

function Field({ label, children }) {
  return (
    <label className="grid gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
      {label}
      {children}
    </label>
  );
}

function currency(value) {
  return `$${Number(value || 0).toLocaleString()}`;
}

function rentalTone(status) {
  if (status === "Active") return "success";
  if (status === "Due back") return "warn";
  if (status === "Cancelled") return "danger";
  if (status === "Closed") return "default";
  return statusTone(status);
}

function leadPrefill(lead) {
  if (!lead) return {};
  const containerSize = lead.container || emptyForm.containerSize;
  return {
    customer: lead.company || lead.name || "",
    customerEmail: lead.email || "",
    customerPhone: lead.phone || "",
    siteAddress: lead.address || "",
    containerSize,
    startDate: lead.date || "",
    rentalRate: rateBySize[containerSize] || emptyForm.rentalRate,
    notes: lead.notes || "",
    status: "Draft"
  };
}

export function AdminRentalsPage() {
  const params = useMemo(() => new URLSearchParams(window.location.search), []);
  const selectedLeadId = params.get("lead");
  const pathOpensNew = window.location.pathname.replace(/\/$/, "") === "/admin/rentals/new";
  const shouldOpenNew = pathOpensNew || params.has("new") || Boolean(selectedLeadId);

  const [rentals, setRentals] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [leadLabel, setLeadLabel] = useState("");

  const activeCount = useMemo(() => rentals.filter((item) => item.status === "Active").length, [rentals]);
  const dueBackCount = useMemo(() => rentals.filter((item) => item.status === "Due back").length, [rentals]);
  const availableUnits = useMemo(
    () => inventory.filter((item) => item.status === "Available" || item.status === "Committed"),
    [inventory]
  );

  useEffect(() => {
    let ignore = false;

    async function loadJson(sources, onData, fallbackMessage) {
      let lastError = null;
      for (const source of sources) {
        try {
          const response = await fetch(source);
          if (!response.ok) throw new Error(fallbackMessage);
          const data = await response.json();
          if (!ignore) onData(data);
          return;
        } catch (sourceError) {
          lastError = sourceError;
        }
      }
      throw lastError || new Error(fallbackMessage);
    }

    async function load() {
      try {
        await Promise.all([
          loadJson(["/api/admin/rentals", "/data/rentals.json"], setRentals, "Rentals could not be loaded."),
          loadJson(["/api/admin/container-inventory-file", "/data/container-inventory.json"], setInventory, "Inventory could not be loaded.")
        ]);
      } catch (loadError) {
        if (!ignore) setError(loadError.message);
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (!shouldOpenNew) return;
    const lead = selectedLeadId ? readQuoteLeads().find((item) => item.id === selectedLeadId) : null;
    const stamp = Date.now().toString().slice(-6);
    setError("");
    setLeadLabel(lead?.id || "");
    setForm({
      ...emptyForm,
      id: `rent-${stamp}`,
      agreementNumber: `RA-${stamp}`,
      ...leadPrefill(lead)
    });
    setIsModalOpen(true);
  }, [shouldOpenNew, selectedLeadId]);

  function updateForm(field, value) {
    setForm((current) => {
      const next = { ...current, [field]: value };
      if (field === "containerSize" && rateBySize[value] != null) {
        next.rentalRate = rateBySize[value];
      }
      return next;
    });
  }

  function selectContainer(containerId) {
    const unit = inventory.find((item) => item.id === containerId);
    if (!unit) {
      updateForm("container", containerId);
      return;
    }

    const containerSize = unit.highCube ? `${unit.length} High Cube` : unit.length;
    setForm((current) => ({
      ...current,
      container: unit.id,
      containerSize,
      rentalRate: rateBySize[containerSize] || current.rentalRate
    }));
  }

  function openModal(lead = null) {
    const stamp = Date.now().toString().slice(-6);
    setError("");
    setLeadLabel(lead?.id || "");
    setForm({
      ...emptyForm,
      id: `rent-${stamp}`,
      agreementNumber: `RA-${stamp}`,
      ...leadPrefill(lead)
    });
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setIsSaving(false);
    setError("");
    setLeadLabel("");
    if (params.has("new") || params.has("lead")) {
      window.history.replaceState({}, "", "/admin/rentals");
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!form.customer.trim() || !form.container.trim() || !form.startDate) {
      setError("Customer, container, and start date are required.");
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch("/api/admin/rentals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Rental could not be saved.");
      setRentals(payload.rentals);
      closeModal();
    } catch (saveError) {
      setError(saveError.message);
      setIsSaving(false);
    }
  }

  async function deleteRental(rentalId) {
    setError("");

    try {
      const response = await fetch(`/api/admin/rentals/${encodeURIComponent(rentalId)}`, { method: "DELETE" });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Rental could not be deleted.");
      setRentals(payload.rentals);
    } catch (deleteError) {
      setError(deleteError.message);
    }
  }

  return (
    <AdminLayout>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Rental Agreements</p>
          <h1 className="mt-2 text-3xl font-bold">Rentals</h1>
          <p className="mt-3 max-w-3xl text-muted-foreground">
            Create and manage rental agreements. Records persist to the local rentals JSON file through the Express API.
          </p>
        </div>
        <Button onClick={() => openModal()}>
          <Plus className="h-4 w-4" />
          New rental
        </Button>
      </div>

      {error && !isModalOpen && (
        <div className="mt-4 flex items-center gap-2 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      <section className="mt-6 grid gap-3 sm:grid-cols-3">
        <Card className="border-slate-200/80 p-5 shadow-none">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Total</p>
          <p className="mt-2 font-display text-3xl tracking-wide text-slate-900">{rentals.length}</p>
        </Card>
        <Card className="border-slate-200/80 p-5 shadow-none">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Active</p>
          <p className="mt-2 font-display text-3xl tracking-wide text-slate-900">{activeCount}</p>
        </Card>
        <Card className="border-slate-200/80 p-5 shadow-none">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Due back</p>
          <p className="mt-2 font-display text-3xl tracking-wide text-slate-900">{dueBackCount}</p>
        </Card>
      </section>

      <Card className="mt-6 overflow-hidden">
        <div className="flex flex-col justify-between gap-3 border-b border-border p-5 md:flex-row md:items-center">
          <div>
            <h2 className="font-semibold">Agreement list</h2>
            <p className="text-sm text-muted-foreground">File-backed records from `/data/rentals.json`</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] text-sm">
            <thead className="bg-muted text-left text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-medium">Agreement</th>
                <th className="px-5 py-3 font-medium">Customer</th>
                <th className="px-5 py-3 font-medium">Container</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Start</th>
                <th className="px-5 py-3 font-medium">Due back</th>
                <th className="px-5 py-3 font-medium">Rate</th>
                <th className="px-5 py-3 font-medium" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rentals.length === 0 ? (
                <tr>
                  <td className="px-5 py-8 text-muted-foreground" colSpan={8}>
                    No rentals yet. Create the first agreement with New rental.
                  </td>
                </tr>
              ) : (
                rentals.map((item) => (
                  <tr key={item.id}>
                    <td className="px-5 py-4">
                      <p className="font-medium">{item.agreementNumber}</p>
                      <p className="text-xs text-muted-foreground">{item.id}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium">{item.customer}</p>
                      <p className="text-xs text-muted-foreground">{item.siteAddress || "—"}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium">{item.container}</p>
                      <p className="text-xs text-muted-foreground">{item.containerSize}</p>
                    </td>
                    <td className="px-5 py-4">
                      <Badge tone={rentalTone(item.status)}>{item.status}</Badge>
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">{item.startDate || "—"}</td>
                    <td className="px-5 py-4 text-muted-foreground">{item.dueBackDate || "—"}</td>
                    <td className="px-5 py-4">
                      {currency(item.rentalRate)}
                      <span className="text-xs text-muted-foreground">/{item.rateUnit || "mo"}</span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        className="rounded-md p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-700"
                        type="button"
                        onClick={() => deleteRental(item.id)}
                        aria-label={`Delete ${item.agreementNumber}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-5 py-8 backdrop-blur-sm">
          <div className="max-h-[88vh] w-full max-w-3xl overflow-y-auto rounded-lg border border-border bg-card text-card-foreground shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">Rental Agreement</p>
                <h2 className="mt-1 text-2xl font-bold">New rental</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {leadLabel
                    ? `Prefilling from lead ${leadLabel}. Saved records append to rentals.json via POST /api/admin/rentals.`
                    : "Saved records append to the rentals JSON file through the Express API."}
                </p>
              </div>
              <button className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground" type="button" onClick={closeModal} aria-label="Close new rental modal">
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
                <Field label="Agreement number">
                  <input className={inputClass} value={form.agreementNumber} onChange={(event) => updateForm("agreementNumber", event.target.value)} />
                </Field>
                <Field label="Status">
                  <select className={inputClass} value={form.status} onChange={(event) => updateForm("status", event.target.value)}>
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Customer">
                  <input className={inputClass} value={form.customer} onChange={(event) => updateForm("customer", event.target.value)} placeholder="Honey Lake Ag Supply" />
                </Field>
                <Field label="Site address">
                  <input className={inputClass} value={form.siteAddress} onChange={(event) => updateForm("siteAddress", event.target.value)} placeholder="Johnstonville Rd, Susanville, CA" />
                </Field>
                <Field label="Email">
                  <input className={inputClass} type="email" value={form.customerEmail} onChange={(event) => updateForm("customerEmail", event.target.value)} placeholder="ops@example.com" />
                </Field>
                <Field label="Phone">
                  <input className={inputClass} value={form.customerPhone} onChange={(event) => updateForm("customerPhone", event.target.value)} placeholder="530-555-0100" />
                </Field>
                <Field label="Container unit">
                  <select className={inputClass} value={form.container} onChange={(event) => selectContainer(event.target.value)}>
                    <option value="">Select unit…</option>
                    {availableUnits.map((unit) => (
                      <option key={unit.id} value={unit.id}>
                        {unit.id} · {unit.length}
                        {unit.highCube ? " HC" : ""} · {unit.status}
                      </option>
                    ))}
                    {form.container && !availableUnits.some((unit) => unit.id === form.container) ? (
                      <option value={form.container}>{form.container}</option>
                    ) : null}
                  </select>
                </Field>
                <Field label="Or enter unit ID">
                  <input className={inputClass} value={form.container} onChange={(event) => updateForm("container", event.target.value)} placeholder="LR-40HC-203" />
                </Field>
                <Field label="Container size">
                  <select className={inputClass} value={form.containerSize} onChange={(event) => updateForm("containerSize", event.target.value)}>
                    {Object.keys(rateBySize).map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Monthly rate">
                  <input className={inputClass} type="number" min="0" step="1" value={form.rentalRate} onChange={(event) => updateForm("rentalRate", event.target.value)} />
                </Field>
                <Field label="Start date">
                  <input className={inputClass} type="date" value={form.startDate} onChange={(event) => updateForm("startDate", event.target.value)} />
                </Field>
                <Field label="Due back">
                  <input className={inputClass} type="date" value={form.dueBackDate} onChange={(event) => updateForm("dueBackDate", event.target.value)} />
                </Field>
                <Field label="Delivery fee">
                  <input className={inputClass} type="number" min="0" step="1" value={form.deliveryFee} onChange={(event) => updateForm("deliveryFee", event.target.value)} />
                </Field>
                <Field label="Pickup fee">
                  <input className={inputClass} type="number" min="0" step="1" value={form.pickupFee} onChange={(event) => updateForm("pickupFee", event.target.value)} />
                </Field>
                <Field label="Deposit">
                  <input className={inputClass} type="number" min="0" step="1" value={form.depositAmount} onChange={(event) => updateForm("depositAmount", event.target.value)} />
                </Field>
              </div>

              <Field label="Notes">
                <textarea className={textareaClass} value={form.notes} onChange={(event) => updateForm("notes", event.target.value)} placeholder="Placement notes, access instructions, special terms..." />
              </Field>

              <div className="rounded-md border border-border bg-muted/50 p-4 text-sm">
                <p className="font-semibold text-foreground">Due today estimate</p>
                <p className="mt-1 text-muted-foreground">
                  Deposit + delivery = <span className="font-semibold text-foreground">{currency(Number(form.depositAmount) + Number(form.deliveryFee))}</span>
                  {" · "}
                  Monthly <span className="font-semibold text-foreground">{currency(form.rentalRate)}</span>
                </p>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
                <Button className="sm:w-auto" type="button" variant="outline" onClick={closeModal}>
                  Cancel
                </Button>
                <Button className="sm:w-auto" type="submit" disabled={isSaving}>
                  <Save className="h-4 w-4" />
                  {isSaving ? "Saving..." : "Save rental"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
