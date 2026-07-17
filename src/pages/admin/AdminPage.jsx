import { useEffect, useMemo, useState } from "react";
import { AlertCircle, ArrowRight, PackageCheck, Plus, ReceiptText, Save, Trash2, Users, X } from "lucide-react";
import { Badge, Button, Card } from "@/components/ui";
import { demoWorkflow, operations } from "@/data/siteData";
import { cn } from "@/lib/utils";
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

const inputClass =
  "h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";
const textareaClass =
  "min-h-24 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";

const statusColors = {
  Available: "#0f766e",
  Committed: "#d97706",
  Rented: "#334155",
  "Due back": "#ea580c",
  Hold: "#64748b",
  Maintenance: "#e11d48"
};

const truckStatusColor = {
  Available: "bg-emerald-500",
  Assigned: "bg-amber-500",
  Service: "bg-rose-500"
};

function Field({ label, children }) {
  return (
    <label className="grid gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
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

function dispatchAccent(type) {
  if (type === "Dropoff") return "bg-emerald-500";
  if (type === "Pickup") return "bg-amber-500";
  return "bg-sky-500";
}

function FleetDonut({ segments, total }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="relative mx-auto h-40 w-40">
      <svg viewBox="0 0 140 140" className="h-full w-full -rotate-90">
        <circle cx="70" cy="70" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="16" />
        {segments.map((segment) => {
          const length = (segment.count / total) * circumference;
          const circle = (
            <circle
              key={segment.label}
              cx="70"
              cy="70"
              r={radius}
              fill="none"
              stroke={statusColors[segment.label] || "#64748b"}
              strokeWidth="16"
              strokeDasharray={`${length} ${circumference - length}`}
              strokeDashoffset={-offset}
              strokeLinecap="butt"
            />
          );
          offset += length;
          return circle;
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="font-display text-3xl tracking-wide text-slate-900">{total}</p>
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Units</p>
      </div>
    </div>
  );
}

function OpsGraphics() {
  const fleetTotal = operations.statusSummary.reduce((sum, item) => sum + item.count, 0);
  const maxStatus = Math.max(...operations.statusSummary.map((item) => item.count));
  const invoices = demoWorkflow.invoices || [];
  const openReceivables = invoices.filter((invoice) => invoice.status !== "Paid");
  const receivableTotal = openReceivables.reduce((sum, invoice) => sum + invoice.amount, 0);
  const monthlyRevenue = operations.monthlyRevenue || [];
  const maxIncome = Math.max(...monthlyRevenue.map((row) => row.income), 1);
  const latestMonth = monthlyRevenue[monthlyRevenue.length - 1];
  const priorMonth = monthlyRevenue[monthlyRevenue.length - 2];
  const incomeDelta = latestMonth && priorMonth ? latestMonth.income - priorMonth.income : 0;
  const incomeDeltaPct = priorMonth ? Math.round((incomeDelta / priorMonth.income) * 100) : 0;

  const utilizationByClass = (() => {
    const buckets = {
      "20 ft": { label: "20 ft", total: 0, count: 0 },
      "40 ft": { label: "40 ft", total: 0, count: 0 },
      "High cube": { label: "High cube", total: 0, count: 0 },
      Refrigerated: { label: "Refrigerated", total: 0, count: 0 }
    };

    operations.inventory.forEach((item) => {
      const util = Number(String(item.utilization).replace("%", "")) || 0;
      const key = item.id.includes("REF") ? "Refrigerated" : item.highCube ? "High cube" : item.length === "40 ft" ? "40 ft" : "20 ft";
      buckets[key].total += util;
      buckets[key].count += 1;
    });

    return Object.values(buckets)
      .filter((bucket) => bucket.count > 0)
      .map((bucket) => ({
        label: bucket.label,
        value: Math.round(bucket.total / bucket.count),
        count: bucket.count
      }));
  })();

  const calendarPreview = operations.calendarLayers.slice(0, 5);

  return (
    <section className="mt-6 grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
      <Card className="border-slate-200/80 p-5 shadow-none">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-lg tracking-wide text-slate-900">Fleet status mix</h2>
            <p className="text-sm text-slate-500">Live distribution across the container yard</p>
          </div>
          <a href="/admin/inventory" className="text-sm font-semibold text-primary hover:underline">
            Inventory
          </a>
        </div>

        <div className="mt-5 grid gap-6 md:grid-cols-[auto_1fr] md:items-center">
          <FleetDonut segments={operations.statusSummary} total={fleetTotal} />
          <div className="space-y-3">
            {operations.statusSummary.map((item) => (
              <div key={item.label} className="grid grid-cols-[7rem_1fr_2rem] items-center gap-3">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: statusColors[item.label] }} />
                  {item.label}
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${(item.count / maxStatus) * 100}%`,
                      backgroundColor: statusColors[item.label]
                    }}
                  />
                </div>
                <span className="text-right text-sm font-bold text-slate-900">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-md bg-slate-100">
          <div className="flex h-3 w-full">
            {operations.statusSummary.map((item) => (
              <div
                key={item.label}
                title={`${item.label}: ${item.count}`}
                style={{
                  width: `${(item.count / fleetTotal) * 100}%`,
                  backgroundColor: statusColors[item.label]
                }}
              />
            ))}
          </div>
        </div>
      </Card>

      <Card className="border-slate-200/80 p-5 shadow-none">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-lg tracking-wide text-slate-900">Truck readiness</h2>
            <p className="text-sm text-slate-500">{operations.trucks.length} units in the fleet</p>
          </div>
          <a href="/admin/trucks" className="text-sm font-semibold text-primary hover:underline">
            Trucks
          </a>
        </div>

        <div className="mt-5 space-y-3">
          {operations.trucks.map((truck) => (
            <div key={truck.id} className="rounded-md border border-slate-100 bg-slate-50/80 px-3 py-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{truck.name}</p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {truck.driver} · service {truck.nextService}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-600">
                  <span className={cn("h-2 w-2 rounded-full", truckStatusColor[truck.status] || "bg-slate-400")} />
                  {truck.status}
                </span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white">
                <div
                  className={cn("h-full rounded-full", truckStatusColor[truck.status] || "bg-slate-400")}
                  style={{ width: truck.status === "Available" ? "100%" : truck.status === "Assigned" ? "68%" : "35%" }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="border-slate-200/80 p-5 shadow-none">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-lg tracking-wide text-slate-900">Monthly revenue</h2>
            <p className="text-sm text-slate-500">
              {latestMonth ? (
                <>
                  ${latestMonth.income.toLocaleString()} in {latestMonth.month}
                  <span className={cn("ml-2 font-semibold", incomeDelta >= 0 ? "text-emerald-700" : "text-rose-600")}>
                    {incomeDelta >= 0 ? "+" : ""}
                    {incomeDeltaPct}%
                  </span>
                </>
              ) : (
                "Rental income trend"
              )}
            </p>
          </div>
          <a href="/admin/tax-export" className="text-sm font-semibold text-primary hover:underline">
            Tax export
          </a>
        </div>

        <div className="mt-5 flex h-44 items-end gap-2.5">
          {monthlyRevenue.map((row) => {
            const incomeHeight = Math.max(10, (row.income / maxIncome) * 100);
            const expenseHeight = Math.max(6, (row.expenses / maxIncome) * 100);
            return (
              <div key={row.month} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-[10px] font-bold text-slate-700">${Math.round(row.income / 1000)}k</span>
                <div className="flex h-32 w-full items-end justify-center gap-1 rounded-md bg-slate-100 px-1.5 pb-1.5">
                  <div
                    className="w-[45%] rounded-sm bg-primary"
                    style={{ height: `${incomeHeight}%` }}
                    title={`${row.month} income: $${row.income.toLocaleString()}`}
                  />
                  <div
                    className="w-[35%] rounded-sm bg-slate-400/70"
                    style={{ height: `${expenseHeight}%` }}
                    title={`${row.month} expenses: $${row.expenses.toLocaleString()}`}
                  />
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">{row.month}</span>
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-slate-100 pt-3 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-primary" /> Income
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-slate-400/70" /> Expenses
          </span>
          <span className="ml-auto font-semibold text-slate-700">
            ${receivableTotal.toLocaleString()} open AR · {openReceivables.length} invoices
          </span>
        </div>
      </Card>

      <Card className="border-slate-200/80 p-5 shadow-none">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-lg tracking-wide text-slate-900">Utilization by class</h2>
            <p className="text-sm text-slate-500">Average utilization across container classes</p>
          </div>
          <a href="/admin/inventory" className="text-sm font-semibold text-primary hover:underline">
            Inventory
          </a>
        </div>

        <div className="mt-5 flex h-44 items-end gap-3">
          {utilizationByClass.map((row) => (
            <div key={row.label} className="flex flex-1 flex-col items-center gap-2">
              <span className="text-xs font-bold text-slate-800">{row.value}%</span>
              <div className="flex h-32 w-full items-end rounded-md bg-slate-100 px-2 pb-2">
                <div
                  className="w-full rounded-sm bg-[linear-gradient(180deg,#0f766e_0%,#134e4a_100%)]"
                  style={{ height: `${Math.max(8, row.value)}%` }}
                  title={`${row.label}: ${row.value}% avg across ${row.count} units`}
                />
              </div>
              <div className="text-center">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-600">{row.label}</p>
                <p className="text-[10px] text-slate-400">{row.count} units</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="border-slate-200/80 p-5 shadow-none xl:col-span-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-lg tracking-wide text-slate-900">Upcoming schedule</h2>
            <p className="text-sm text-slate-500">Layered calendar preview across dropoffs, pickups, and maintenance</p>
          </div>
          <a href="/admin/calendar" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
            Calendar
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-5">
          {calendarPreview.map((event) => (
            <div key={`${event.date}-${event.title}`} className="rounded-md border border-slate-100 bg-slate-50/70 p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{event.date}</p>
                <Badge tone={event.tone === "danger" ? "danger" : event.tone === "warn" ? "warn" : "success"}>{event.layer}</Badge>
              </div>
              <p className="mt-3 text-sm font-semibold text-slate-900">{event.title}</p>
              <p className="mt-1 text-xs text-slate-500">{event.time}</p>
              <p className="mt-2 text-xs text-slate-500">
                {event.asset} · {event.truck}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </section>
  );
}

export function AdminPage() {
  const [workOrders, setWorkOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(emptyWorkOrder);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const openWorkOrders = useMemo(() => workOrders.filter((item) => item.status !== "Closed").length, [workOrders]);
  const highPriority = useMemo(() => workOrders.filter((item) => item.priority === "High").length, [workOrders]);

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
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Operations backend</p>
          <h1 className="font-display mt-2 text-3xl tracking-wide text-slate-900 sm:text-4xl">Rental fleet command center</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
            Dashboard-level overview for rentals, dispatch, maintenance, and receivables. Deeper fleet tools live on their own backend pages.
          </p>
        </div>
        <Button onClick={() => window.location.assign("/admin/rentals/new")}>
          <Users className="h-4 w-4" />
          New rental
        </Button>
      </div>

      {error && !isModalOpen && (
        <div className="mt-4 flex items-center gap-2 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <section className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {operations.metrics.map((metric, index) => (
          <Card
            key={metric.label}
            className={cn(
              "relative overflow-hidden border-slate-200/80 p-5 shadow-none",
              index === 0 && "bg-[linear-gradient(135deg,#0f171c_0%,#16352d_100%)] text-white"
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className={cn("text-xs font-semibold uppercase tracking-[0.14em]", index === 0 ? "text-emerald-200/80" : "text-slate-500")}>
                  {metric.label}
                </p>
                <p className="mt-3 font-display text-4xl tracking-wide">{metric.value}</p>
              </div>
              <span
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-md",
                  index === 0 ? "bg-white/10 text-emerald-200" : "bg-slate-100 text-primary"
                )}
              >
                <metric.icon className="h-5 w-5" />
              </span>
            </div>
            {index === 0 ? <p className="mt-3 text-xs text-white/65">Ready to assign from yard inventory</p> : null}
          </Card>
        ))}
      </section>

      <OpsGraphics />

      <section className="mt-6 grid gap-4 xl:grid-cols-[1.05fr_1fr]">
        <Card className="overflow-hidden border-slate-200/80 shadow-none">
          <div className="flex items-center justify-between border-b border-slate-100 bg-white px-5 py-4">
            <div>
              <h2 className="font-display text-lg tracking-wide text-slate-900">Today&apos;s Dispatch</h2>
              <p className="text-sm text-slate-500">{operations.dispatch.length} jobs on the board</p>
            </div>
            <a href="/admin/dispatch" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
              Board
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
          <div className="divide-y divide-slate-100">
            {operations.dispatch.map((job, index) => (
              <div key={`${job.type}-${job.customer}`} className="flex gap-4 px-5 py-4">
                <div className="flex w-16 flex-col items-start">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Slot {index + 1}</span>
                  <span className="mt-1 text-sm font-bold text-slate-900">{job.time}</span>
                </div>
                <div className="relative flex-1 pl-4">
                  <span className={cn("absolute left-0 top-1.5 h-full w-1 rounded-full", dispatchAccent(job.type))} />
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-slate-900">{job.type}</p>
                    <Badge tone={job.type === "Service" ? "default" : job.type === "Pickup" ? "warn" : "success"}>{job.type}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-slate-600">{job.customer}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {job.truck} · {job.worker}
                  </p>
                </div>
                <PackageCheck className="mt-1 hidden h-4 w-4 text-slate-300 sm:block" />
              </div>
            ))}
          </div>
        </Card>

        <Card className="overflow-hidden border-slate-200/80 shadow-none">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 bg-white px-5 py-4">
            <div>
              <h2 className="font-display text-lg tracking-wide text-slate-900">Work orders</h2>
              <p className="text-sm text-slate-500">
                {workOrders.length} file-backed records · {openWorkOrders} open · {highPriority} high priority
              </p>
            </div>
            <ReceiptText className="h-5 w-5 text-primary" />
          </div>

          <div className="max-h-[28rem] divide-y divide-slate-100 overflow-y-auto">
            {workOrders.length === 0 ? (
              <p className="px-5 py-8 text-sm text-slate-500">No work orders loaded yet.</p>
            ) : (
              workOrders.map((item) => (
                <div key={item.id} className="px-5 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-slate-900">{item.id}</p>
                        <Badge tone={workOrderTone(item)}>{item.priority}</Badge>
                        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                          {item.status}
                        </span>
                      </div>
                      <p className="mt-1 text-sm font-medium text-slate-700">{item.container}</p>
                    </div>
                    <button
                      className="rounded-md p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-700"
                      type="button"
                      onClick={() => deleteWorkOrder(item.id)}
                      aria-label={`Delete ${item.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{item.issue}</p>
                  <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500">
                    <span>{item.type}</span>
                    <span>Assigned: {item.assignedTo}</span>
                    {item.dueDate ? <span>Due: {item.dueDate}</span> : null}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="border-t border-slate-100 bg-slate-50/80 px-5 py-4">
            <Button onClick={openModal}>
              <Plus className="h-4 w-4" />
              Add work order
            </Button>
          </div>
        </Card>
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-5 py-8 backdrop-blur-sm">
          <div className="max-h-[88vh] w-full max-w-3xl overflow-y-auto rounded-lg border border-slate-200 bg-white text-card-foreground shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">Storage Work Order</p>
                <h2 className="mt-1 font-display text-2xl tracking-wide">Add work order</h2>
                <p className="mt-1 text-sm text-slate-500">Saved records append to the static work-orders JSON file through the Express stub.</p>
              </div>
              <button className="rounded-md p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-900" type="button" onClick={closeModal} aria-label="Close add work order modal">
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

              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
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
