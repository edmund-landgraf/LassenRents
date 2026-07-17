import { cn } from "@/lib/utils";

export function Button({ className, variant = "default", children, ...props }) {
  return (
    <button
      className={cn(
        "inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        variant === "default" && "border border-primary/20 bg-primary text-primary-foreground hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-md",
        variant === "outline" && "border border-border bg-card text-foreground hover:-translate-y-0.5 hover:border-primary/40 hover:bg-muted hover:shadow-md",
        variant === "ghost" && "text-foreground shadow-none hover:bg-muted",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function Card({ className, children }) {
  return <div className={cn("rounded-lg border border-border bg-card text-card-foreground shadow-soft", className)}>{children}</div>;
}

export function Badge({ children, tone = "default" }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-sm border px-2 py-1 text-xs font-black uppercase tracking-wide shadow-sm",
        tone === "default" && "border-secondary/80 bg-secondary text-secondary-foreground",
        tone === "success" && "border-emerald-200 bg-emerald-100 text-emerald-800",
        tone === "warn" && "border-amber-200 bg-amber-100 text-amber-900",
        tone === "danger" && "border-rose-200 bg-rose-100 text-rose-800"
      )}
    >
      {children}
    </span>
  );
}
