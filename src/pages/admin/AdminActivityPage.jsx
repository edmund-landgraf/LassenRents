import { Activity, ArrowRight, Bell, ClipboardList } from "lucide-react";
import { Badge, Card } from "@/components/ui";
import { demoWorkflow } from "@/data/siteData";
import { AdminLayout } from "./AdminLayout";

function activityTone(type) {
  if (type === "Lead" || type === "Match") return "success";
  if (type === "Invoice") return "warn";
  if (type === "Inspection") return "danger";
  return "default";
}

export function AdminActivityPage() {
  const nextActions = [
    { label: "Review new quote", href: "/admin/leads", owner: "Office" },
    { label: "Assign high-cube truck", href: "/admin/dispatch", owner: "Dispatch" },
    { label: "Record open payment", href: "/admin/invoices", owner: "Billing" },
    { label: "Finish service checklist", href: "/admin/inspection", owner: "Driver" }
  ];

  return (
    <AdminLayout>
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">Activity</p>
        <h1 className="mt-2 text-3xl font-bold">Business activity feed</h1>
        <p className="mt-3 max-w-3xl text-muted-foreground">One demo timeline tying together lead intake, matching, billing, dispatch, and inspection work.</p>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
        <Card className="p-5">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">Timeline</h2>
          </div>
          <div className="mt-5 space-y-4">
            {demoWorkflow.activity.map((item) => (
              <div key={`${item.time}-${item.text}`} className="grid gap-3 rounded-md border border-border p-4 sm:grid-cols-[84px_1fr]">
                <p className="text-sm font-semibold text-muted-foreground">{item.time}</p>
                <div>
                  <Badge tone={activityTone(item.type)}>{item.type}</Badge>
                  <p className="mt-2 text-sm leading-6">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">Next best actions</h2>
          </div>
          <div className="mt-4 space-y-3">
            {nextActions.map((action) => (
              <a key={action.href} className="flex items-center justify-between gap-3 rounded-md border border-border p-3 text-sm hover:bg-muted" href={action.href}>
                <span>
                  <span className="block font-semibold">{action.label}</span>
                  <span className="text-muted-foreground">{action.owner}</span>
                </span>
                <ArrowRight className="h-4 w-4 text-primary" />
              </a>
            ))}
          </div>
          <div className="mt-5 rounded-md border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
            <div className="flex items-center gap-2 font-semibold">
              <ClipboardList className="h-4 w-4" />
              Demo loop
            </div>
            <p className="mt-2 text-sm">Quote request, lead review, rental creation, dispatch, invoice, payment, inspection, and closeout are now all represented.</p>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
