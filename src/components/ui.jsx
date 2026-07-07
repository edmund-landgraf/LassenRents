import { cn } from "@/lib/utils";

export function Button({ className, variant = "default", children, ...props }) {
  return (
    <button
      className={cn(
        "inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        variant === "default" && "bg-primary text-primary-foreground hover:bg-primary/90",
        variant === "outline" && "border border-border bg-background text-foreground hover:bg-muted",
        variant === "ghost" && "text-foreground hover:bg-muted",
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
        "inline-flex rounded-sm px-2 py-1 text-xs font-semibold",
        tone === "default" && "bg-secondary text-secondary-foreground",
        tone === "success" && "bg-emerald-100 text-emerald-800",
        tone === "warn" && "bg-amber-100 text-amber-900",
        tone === "danger" && "bg-rose-100 text-rose-800"
      )}
    >
      {children}
    </span>
  );
}
