import { Star } from "lucide-react";
import { Card } from "@/components/ui";
import { testimonials } from "@/data/siteData";

export function TestimonialsSection() {
  return (
    <section className="border-t border-border bg-muted/35 py-16">
      <div className="container">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">What clients say</p>
            <h2 className="mt-2 text-3xl font-bold">Five-star service from delivery to pickup</h2>
          </div>
          <div className="flex items-center gap-1 text-amber-500" aria-label="Five star reviews">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star key={index} className="h-5 w-5 fill-current" />
            ))}
          </div>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {testimonials.map((review) => (
            <Card key={review.name} className="p-5">
              <div className="flex gap-1 text-amber-500">
                {Array.from({ length: review.rating }).map((_, index) => (
                  <Star key={index} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">"{review.quote}"</p>
              <div className="mt-5 border-t border-border pt-4">
                <p className="font-semibold">{review.name}</p>
                <p className="text-sm text-muted-foreground">{review.role}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
