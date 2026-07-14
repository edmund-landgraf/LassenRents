import { useEffect, useState } from "react";
import { AlertCircle, ArrowRight, PackageCheck, Plus, ReceiptText, Save, Trash2, Users, X } from "lucide-react";
import { Badge, Button, Card } from "@/components/ui";
import { operations } from "@/data/siteData";
import { AdminLayout, statusTone } from "./AdminLayout";

const emptyWorkOrder = {
  id: "",
  container: "",
  type: "Maintenance",
  issue: "",
  priority: "Medium",
  status: "Open",
  assignedTo: "Unassigned",
  dueDate: "",
  notes: ""
};

const inputClass = "h-10 rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";
const textareaClass = "min-h-24 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";

function Field({ label, children }) {
  return (
    <label className="grid gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
      {label}
      {children}
    </label>
  );
}

function workOrderTone(item) {
  if (item.priority === "High" || item.status === "Open") return "warn";
  if (item.status === "Closed") return "success";
  return statusTone(item.status);
}

export function AdminPage() {
  const [workOrders, setWorkOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(emptyWorkOrder);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const modules = [
    { title: "Quote Leads", href: "/admin/leads", copy: "Review public quote submissions, match availability, and convert promising leads into rentals." },
    { title: "Customers", href: "/admin/customers", copy: "Open customer profiles with balances, rentals, notes, and contact actions." },
    { title: "Rental Wizard", href: "/admin/rentals/new", copy: "Create a rental by choosing customer, matching inventory, setting terms, and generating an agreement." },
    { title: "Dispatch Board", href: "/admin/dispatch", copy: "Move delivery, pickup, and service jobs from unassigned to complete." },
    { title: "Invoices", href: "/admin/invoices", copy: "Review receivables, aging, reminders, and demo payment recording." },
    { title: "Container Inventory", href: "/admin/inventory", copy: "Manage fleet states, due backs, commitments, book value, depreciation, and utilization." },
    { title: "Truck Capability", href: "/admin/trucks", copy: "See which trucks can haul 20 ft, 40 ft, high-cube, standard-height, or service-only jobs." },
    { title: "Layered Calendar", href: "/admin/calendar", copy: "Graphical calendar with dropoffs, pickups, due backs, commitments, maintenance, workers, and trucks." },
    { title: "Driver Inspection", href: "/admin/inspection", copy: "Mobile-style checklist for photos, condition notes, customer signature, and closeout readiness." },
    { title: "Activity Feed", href: "/admin/activity", copy: "Timeline that ties together quote intake, matching, dispatch, billing, and inspections." },
    { title: "Tax Export", href: "/admin/tax-export", copy: "Stage Quicken CSV rows for revenue, depreciation, repairs, mileage, and expenses." }
  ];

  useEffect(() => {
    let ignore = false;

    async function loadWorkOrders() {
      const sources = ["/api/admin/work-orders-file", "/data/work-orders.json"];
      let lastError = null;

      try {
        for (const source of sources) {
          try {
            const response = await fetch(source);
            if (!response.ok) throw new Error("Work orders could not be loaded.");
            const data = await response.json();
            if (!ignore) setWorkOrders(data);
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

    loadWorkOrders();
    return () => {
      ignore = true;
    };
  }, []);

  function updateForm(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function openModal() {
    setError("");
    setForm({
      ...emptyWorkOrder,
      id: `WO-${Date.now().toString().slice(-6)}`
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

    if (!form.id.trim() || !form.container.trim() || !form.issue.trim()) {
      setError("Work order ID, container, and issue are required.");
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch("/api/admin/work-orders-file", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Work order could not be saved.");
      setWorkOrders(payload.workOrders);
      closeModal();
    } catch (saveError) {
      setError(saveError.message);
      setIsSaving(false);
    }
  }

  async function deleteWorkOrder(workOrderId) {
    setError("");

    try {
      const response = await fetch(`/api/admin/work-orders-file/${encodeURIComponent(workOrderId)}`, { method: "DELETE" });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Work order could not be deleted.");
      setWorkOrders(payload.workOrders);
    } catch (deleteError) {
      setError(deleteError.message);
    }
  }

  return (
    <AdminLayout>
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Operations Backend</p>
          <h1 className="mt-2 text-3xl font-bold">Rental fleet command center</h1>
          <p className="mt-3 max-w-3xl text-muted-foreground">
            Dashboard-level overview for rentals, dispatch, maintenance, and receivables. Deeper fleet tools live on their own backend pages.
          </p>
        </div>
        <Button variant="outline" onClick={() => window.location.assign("/admin/rentals/new")}>
          <Users className="h-4 w-4" />
          New rental
        </Button>
      </div>

      {error && !isModalOpen && (
        <div className="mt-4 flex items-center gap-2 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {operations.metrics.map((metric) => (
          <Card key={metric.label} className="p-5">
            <metric.icon className="h-5 w-5 text-primary" />
            <p className="mt-4 text-3xl font-bold">{metric.value}</p>
            <p className="text-sm text-muted-foreground">{metric.label}</p>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {modules.map((module) => (
          <a key={module.href} href={module.href}>
            <Card className="h-full p-5 transition hover:-translate-y-0.5 hover:border-primary/40">
              <h2 className="font-semibold">{module.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{module.copy}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                Open page
                <ArrowRight className="h-4 w-4" />
              </span>
            </Card>
          </a>
        ))}
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[1.1fr_.9fr]">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Today's Dispatch</h2>
            <PackageCheck className="h-5 w-5 text-primary" />
          </div>
          <div className="mt-3 space-y-3">
            {operations.dispatch.map((job) => (
              <div key={`${job.type}-${job.customer}`} className="rounded-md border border-border p-3">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{job.type}</p>
                  <span className="text-sm text-muted-foreground">{job.time}</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{job.customer} - {job.truck} - {job.worker}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold">Work orders</h2>
              <p className="text-sm text-muted-foreground">{workOrders.length} active file-backed records</p>
            </div>
            <ReceiptText className="h-5 w-5 text-primary" />
          </div>
          <div className="mt-3 space-y-3">
            {workOrders.map((item) => (
              <div key={item.id} className="rounded-md border border-border p-3 text-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{item.id}</p>
                    <p className="mt-1 font-medium">{item.container}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge tone={workOrderTone(item)}>{item.priority}</Badge>
                    <button className="rounded-md p-2 text-muted-foreground hover:bg-rose-50 hover:text-rose-700" type="button" onClick={() => deleteWorkOrder(item.id)} aria-label={`Delete ${item.id}`}>
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <p className="mt-2 text-muted-foreground">{item.issue}</p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <span>{item.type}</span>
                  <span>{item.status}</span>
                  <span>Assigned: {item.assignedTo}</span>
                  {item.dueDate && <span>Due: {item.dueDate}</span>}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 border-t border-border pt-5">
            <Button onClick={openModal}>
              <Plus className="h-4 w-4" />
              Add work order
            </Button>
          </div>
        </Card>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-5 py-8 backdrop-blur-sm">
          <div className="max-h-[88vh] w-full max-w-3xl overflow-y-auto rounded-lg border border-border bg-card text-card-foreground shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">Storage Work Order</p>
                <h2 className="mt-1 text-2xl font-bold">Add work order</h2>
                <p className="mt-1 text-sm text-muted-foreground">Saved records append to the static work-orders JSON file through the Express stub.</p>
              </div>
              <button className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground" type="button" onClick={closeModal} aria-label="Close add work order modal">
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
                <Field label="Work order ID">
                  <input className={inputClass} value={form.id} onChange={(event) => updateForm("id", event.target.value)} />
                </Field>
                <Field label="Container / asset">
                  <input className={inputClass} value={form.container} onChange={(event) => updateForm("container", event.target.value)} placeholder="LR-20HC-118" />
                </Field>
                <Field label="Type">
                  <select className={inputClass} value={form.type} onChange={(event) => updateForm("type", event.target.value)}>
                    <option>Maintenance</option>
                    <option>Repair</option>
                    <option>Inspection</option>
                    <option>Cleaning</option>
                    <option>Truck service</option>
                  </select>
                </Field>
                <Field label="Priority">
                  <select className={inputClass} value={form.priority} onChange={(event) => updateForm("priority", event.target.value)}>
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </Field>
                <Field label="Status">
                  <select className={inputClass} value={form.status} onChange={(event) => updateForm("status", event.target.value)}>
                    <option>Open</option>
                    <option>Scheduled</option>
                    <option>In progress</option>
                    <option>Closed</option>
                  </select>
                </Field>
                <Field label="Assigned to">
                  <input className={inputClass} value={form.assignedTo} onChange={(event) => updateForm("assignedTo", event.target.value)} placeholder="Terry" />
                </Field>
                <Field label="Due date">
                  <input className={inputClass} type="date" value={form.dueDate} onChange={(event) => updateForm("dueDate", event.target.value)} />
                </Field>
                <Field label="Issue">
                  <input className={inputClass} value={form.issue} onChange={(event) => updateForm("issue", event.target.value)} placeholder="Door gasket repair" />
                </Field>
              </div>

              <Field label="Notes">
                <textarea className={textareaClass} value={form.notes} onChange={(event) => updateForm("notes", event.target.value)} placeholder="Inspection notes, parts needed, photos requested..." />
              </Field>

              <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
                <Button className="sm:w-auto" type="button" variant="outline" onClick={closeModal}>
                  Cancel
                </Button>
                <Button className="sm:w-auto" type="submit" disabled={isSaving}>
                  <Save className="h-4 w-4" />
                  {isSaving ? "Saving..." : "Save work order"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
