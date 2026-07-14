import { useMemo, useState } from "react";
import { ArrowRight, MapPinned, Truck } from "lucide-react";
import { Badge, Button, Card } from "@/components/ui";
import { demoWorkflow } from "@/data/siteData";
import { AdminLayout } from "./AdminLayout";

const lanes = ["Unassigned", "Assigned", "In Route", "Complete"];

function laneTone(lane) {
  if (lane === "Unassigned") return "warn";
  if (lane === "Complete") return "success";
  return "default";
}

export function AdminDispatchPage() {
  const [jobs, setJobs] = useState(demoWorkflow.dispatchBoard);
  const summary = useMemo(() => lanes.map((lane) => ({ lane, count: jobs.filter((job) => job.lane === lane).length })), [jobs]);

  function advanceJob(jobId) {
    setJobs((current) => current.map((job) => {
      if (job.id !== jobId) return job;
      const nextLane = lanes[Math.min(lanes.length - 1, lanes.indexOf(job.lane) + 1)];
      return {
        ...job,
        lane: nextLane,
        truck: job.truck === "Needs high-cube truck" ? "Landoll High Cube" : job.truck,
        driver: job.driver === "Unassigned" ? "Ray" : job.driver
      };
    }));
  }

  return (
    <AdminLayout>
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">Dispatch</p>
        <h1 className="mt-2 text-3xl font-bold">Delivery and pickup board</h1>
        <p className="mt-3 max-w-3xl text-muted-foreground">Track jobs from unassigned request to assigned truck, active route, and completed site work.</p>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-4">
        {summary.map((item) => (
          <Card key={item.lane} className="p-4">
            <p className="text-sm text-muted-foreground">{item.lane}</p>
            <p className="mt-1 text-3xl font-bold">{item.count}</p>
          </Card>
        ))}
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-4">
        {lanes.map((lane) => (
          <Card key={lane} className="min-h-[420px] p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">{lane}</h2>
              <Badge tone={laneTone(lane)}>{jobs.filter((job) => job.lane === lane).length}</Badge>
            </div>
            <div className="mt-4 space-y-3">
              {jobs.filter((job) => job.lane === lane).map((job) => (
                <div key={job.id} className="rounded-md border border-border bg-background p-3 text-sm shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Badge tone={job.type === "Pickup" ? "warn" : job.type === "Service" ? "danger" : "success"}>{job.type}</Badge>
                      <h3 className="mt-2 font-semibold">{job.customer}</h3>
                    </div>
                    <span className="text-xs text-muted-foreground">{job.id}</span>
                  </div>
                  <p className="mt-2 text-muted-foreground">{job.time}</p>
                  <div className="mt-3 grid gap-2 rounded-md bg-muted p-3">
                    <p className="flex items-center gap-2"><Truck className="h-4 w-4 text-primary" />{job.truck} - {job.driver}</p>
                    <p className="flex items-start gap-2"><MapPinned className="mt-0.5 h-4 w-4 text-primary" />{job.address}</p>
                  </div>
                  <p className="mt-3 text-xs leading-5 text-muted-foreground">{job.note}</p>
                  {lane !== "Complete" && (
                    <Button className="mt-3 h-9 w-full" variant="outline" onClick={() => advanceJob(job.id)}>
                      Advance
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </AdminLayout>
  );
}
