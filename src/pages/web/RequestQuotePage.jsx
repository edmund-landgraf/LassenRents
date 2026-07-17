import { useMemo, useState } from "react";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import { Button, Card } from "@/components/ui";
import { containerSizes } from "@/data/siteData";
import { contactInterestOptions, readContactIntent } from "@/lib/contactIntent";
import { saveQuoteLead } from "@/lib/demoWorkflow";
import { PublicLayout } from "./PublicLayout";

export function RequestQuotePage() {
  const selectedContainer = new URLSearchParams(window.location.search).get("container") || "20 ft";
  const initialInterests = useMemo(() => {
    const intent = readContactIntent();
    if (contactInterestOptions.includes(intent)) return [intent];
    if (intent === "Containers") return ["Rent a container"];
    if (intent === "Delivery" || intent === "Trucking") return ["Move my container"];
    if (intent === "Modifications") return ["Modify a container"];
    if (new URLSearchParams(window.location.search).has("container")) return ["Rent a container"];
    return [];
  }, []);
  const [selectedInterests, setSelectedInterests] = useState(initialInterests);
  const isRentingContainer = selectedInterests.includes("Rent a container");
  const [submittedLead, setSubmittedLead] = useState(null);
  const [form, setForm] = useState({
    container: selectedContainer,
    name: "",
    company: "",
    phone: "",
    email: "",
    address: "",
    date: "",
    duration: "month-to-month",
    notes: ""
  });

  function toggleInterest(interest) {
    setSelectedInterests((current) => (current.includes(interest) ? current.filter((item) => item !== interest) : [...current, interest]));
  }

  function updateForm(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const lead = saveQuoteLead({
      name: form.name || "New quote contact",
      company: form.company,
      phone: form.phone,
      email: form.email,
      address: form.address,
      interests: selectedInterests.length ? selectedInterests : ["General question"],
      container: isRentingContainer ? form.container : "Customer-owned / transport only",
      date: form.date,
      duration: isRentingContainer ? form.duration : "Not renting",
      notes: form.notes
    });
    setSubmittedLead(lead);
  }

  return (
    <PublicLayout>
      <section className="container py-16">
        <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">Request Quote</p>
            <h1 className="mt-2 text-4xl font-bold">Tell us what you need moved, rented, or modified</h1>
            <p className="mt-4 text-muted-foreground">
              Rent a container, move a container you already own, ask about trucking, or request modifications. The office can confirm availability, delivery, pickup, transport, and pricing.
            </p>
            <Card className="freight-card mt-6 p-5 pl-7">
              <h2 className="font-semibold">Contact Lassen Rents</h2>
              <div className="mt-4 grid gap-3 text-sm text-muted-foreground">
                <a className="flex items-center gap-2 hover:text-foreground" href="tel:15302573865">
                  <Phone className="h-4 w-4 text-primary" />
                  530.257.3865
                </a>
                <a className="flex items-center gap-2 hover:text-foreground" href="mailto:lassenrents@gmail.com">
                  <Mail className="h-4 w-4 text-primary" />
                  lassenrents@gmail.com
                </a>
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  Serving Lassen, Plumas, and Modoc Counties
                </p>
              </div>
            </Card>
          </div>

          <Card className="field-surface overflow-hidden p-0">
            <div className="bolt-strip border-b border-border bg-primary px-6 py-3 text-sm font-black uppercase tracking-wide text-primary-foreground">
              Quote intake
            </div>
            <form className="grid gap-5 p-6" onSubmit={handleSubmit}>
              {submittedLead && (
                <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                  <p className="font-semibold">Quote request saved as {submittedLead.id}.</p>
                  <a className="mt-1 inline-flex font-semibold text-emerald-950 underline" href="/admin/leads">Open admin lead queue</a>
                </div>
              )}
              <fieldset className="grid gap-3">
                <legend className="text-sm font-medium">What are you interested in?</legend>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {contactInterestOptions.map((interest) => (
                    <label
                      key={interest}
                      className="flex min-h-11 cursor-pointer items-center gap-3 rounded-md border border-input bg-card/80 px-3 text-sm font-semibold transition hover:-translate-y-0.5 hover:border-primary/40 hover:bg-muted"
                    >
                      <input
                        className="h-4 w-4 rounded border-input accent-primary"
                        type="checkbox"
                        checked={selectedInterests.includes(interest)}
                        onChange={() => toggleInterest(interest)}
                      />
                      {interest}
                    </label>
                  ))}
                </div>
              </fieldset>

              {isRentingContainer && (
                <div className="grid gap-4 rounded-md border border-border bg-card/70 p-4 md:grid-cols-2">
                  <label className="grid gap-2 text-sm font-medium">
                    Container type
                    <select className="h-11 rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring" value={form.container} onChange={(event) => updateForm("container", event.target.value)}>
                      {containerSizes.map((container) => (
                        <option key={container.label} value={container.label}>
                          {container.label} - ${container.rate}/mo stub
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="grid gap-2 text-sm font-medium">
                    Rental duration
                    <select className="h-11 rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring" value={form.duration} onChange={(event) => updateForm("duration", event.target.value)}>
                      <option value="month-to-month">Month-to-month</option>
                      <option value="1-month">About 1 month</option>
                      <option value="3-months">About 3 months</option>
                      <option value="6-months">6+ months</option>
                      <option value="purchase">Interested in purchase</option>
                    </select>
                  </label>
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2 text-sm font-medium">
                  Name
                  <input className="h-11 rounded-md border border-input px-3 text-sm outline-none focus:ring-2 focus:ring-ring" value={form.name} onChange={(event) => updateForm("name", event.target.value)} placeholder="Your name" />
                </label>
                <label className="grid gap-2 text-sm font-medium">
                  Company
                  <input className="h-11 rounded-md border border-input px-3 text-sm outline-none focus:ring-2 focus:ring-ring" value={form.company} onChange={(event) => updateForm("company", event.target.value)} placeholder="Optional" />
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2 text-sm font-medium">
                  Phone
                  <input className="h-11 rounded-md border border-input px-3 text-sm outline-none focus:ring-2 focus:ring-ring" value={form.phone} onChange={(event) => updateForm("phone", event.target.value)} placeholder="530.257.3865" />
                </label>
                <label className="grid gap-2 text-sm font-medium">
                  Email
                  <input className="h-11 rounded-md border border-input px-3 text-sm outline-none focus:ring-2 focus:ring-ring" value={form.email} onChange={(event) => updateForm("email", event.target.value)} placeholder="you@example.com" type="email" />
                </label>
              </div>

              <label className="grid gap-2 text-sm font-medium">
                Site / transport address
                <input className="h-11 rounded-md border border-input px-3 text-sm outline-none focus:ring-2 focus:ring-ring" value={form.address} onChange={(event) => updateForm("address", event.target.value)} placeholder="Pickup site, delivery site, city, county" />
              </label>

              <div className="grid gap-4 md:grid-cols-1">
                <label className="grid gap-2 text-sm font-medium">
                  Desired service date
                  <input className="h-11 rounded-md border border-input px-3 text-sm outline-none focus:ring-2 focus:ring-ring" type="date" value={form.date} onChange={(event) => updateForm("date", event.target.value)} />
                </label>
              </div>

              <label className="grid gap-2 text-sm font-medium">
                Notes
                <textarea className="min-h-28 rounded-md border border-input px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" value={form.notes} onChange={(event) => updateForm("notes", event.target.value)} placeholder="Own your container? Include size, loaded/empty, pickup and dropoff locations, gate access, surface type, or questions." />
              </label>

              <Button className="h-11 justify-self-start" type="submit">
                Submit quote request
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          </Card>
        </div>
      </section>
    </PublicLayout>
  );
}
