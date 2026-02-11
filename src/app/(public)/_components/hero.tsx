import Link from "next/link";
import {
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  Clock3,
  Droplet,
  HeartHandshake,
  MapPin,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const trustPillars = [
  {
    icon: ShieldCheck,
    title: "Verified in minutes",
    description:
      "Every request is reviewed with coordinator checks before alerts are sent to donors.",
  },
  {
    icon: UsersRound,
    title: "Local-first routing",
    description:
      "Matching prioritizes nearby donors to reduce response time and coordination overhead.",
  },
  {
    icon: HeartHandshake,
    title: "Human follow-through",
    description:
      "Coordinators stay in the loop until donation handoff is complete and confirmed.",
  },
];

const journeySteps = [
  {
    title: "Post a request",
    description:
      "Recipients submit details once and receive status updates in a shared timeline.",
  },
  {
    title: "Activate donor circle",
    description:
      "Compatible donors near the location receive a clear request with urgency context.",
  },
  {
    title: "Close the loop",
    description:
      "Once fulfilled, the request is automatically closed with verified handoff notes.",
  },
];

const pulseBoard = [
  { type: "A+", city: "Queens", status: "Need in 2h" },
  { type: "O-", city: "Jersey City", status: "Priority" },
  { type: "B+", city: "Brooklyn", status: "Today" },
  { type: "AB-", city: "Lower Manhattan", status: "Scheduled" },
];

export function Hero() {
  return (
    <div className="relative isolate overflow-hidden pb-20">
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(circle at 88% -2%, rgba(196, 44, 43, 0.18) 0%, rgba(196, 44, 43, 0) 42%), radial-gradient(circle at 6% 34%, rgba(180, 83, 9, 0.1) 0%, rgba(180, 83, 9, 0) 28%)",
        }}
      />

      <section className="relative px-6 pb-20 pt-16 sm:px-10 sm:pt-20 lg:pb-28">
        <div className="mx-auto grid w-full max-w-6xl gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
          <div className="space-y-8">
            <p className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
              <Sparkles className="size-3.5" />
              Modern donation coordination
            </p>

            <div className="space-y-6">
              <h1 className="max-w-2xl text-balance font-heading text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                A cleaner way to move from urgent request to confirmed donation.
              </h1>
              <p className="max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
                Bloodline helps recipients, donors, and coordinators stay aligned
                in one flow, so every step is visible and no critical request
                goes cold.
              </p>
            </div>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <Button asChild size="lg" className="h-12 rounded-full px-7">
                <Link href="/auth" className="gap-2">
                  Become a donor
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 rounded-full border-border/80 bg-card/70 px-7 backdrop-blur-sm"
              >
                <Link href="/campaigns">Browse campaigns</Link>
              </Button>
            </div>

            <div className="grid max-w-xl grid-cols-3 gap-3 pt-4">
              <article className="rounded-2xl border border-border/70 bg-card/80 p-4 backdrop-blur-sm">
                <p className="text-2xl font-semibold tracking-tight">12K+</p>
                <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                  Active donors
                </p>
              </article>
              <article className="rounded-2xl border border-border/70 bg-card/80 p-4 backdrop-blur-sm">
                <p className="text-2xl font-semibold tracking-tight">7 min</p>
                <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                  Avg response
                </p>
              </article>
              <article className="rounded-2xl border border-border/70 bg-card/80 p-4 backdrop-blur-sm">
                <p className="text-2xl font-semibold tracking-tight">24/7</p>
                <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                  Coordinator desk
                </p>
              </article>
            </div>
          </div>

          <div className="relative lg:pt-5">
            <div className="absolute -left-5 -top-5 h-28 w-28 rounded-full bg-primary/10 blur-2xl [animation:var(--animate-drift)]" />
            <article className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-card/90 p-6 shadow-lg backdrop-blur-sm sm:p-8">
              <div className="pointer-events-none absolute inset-0 grid-faint opacity-25" />
              <div className="relative space-y-6">
                <header className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      Live request pulse
                    </p>
                    <p className="mt-1 font-heading text-xl font-semibold tracking-tight">
                      Nearby alerts
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    <Clock3 className="size-3.5" />
                    Updated now
                  </span>
                </header>

                <div className="space-y-3">
                  {pulseBoard.map((item) => (
                    <div
                      key={`${item.type}-${item.city}`}
                      className="flex items-center justify-between rounded-2xl border border-border/70 bg-background/80 px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex size-9 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-sm font-semibold text-primary">
                          {item.type}
                        </span>
                        <p className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="size-3.5" />
                          {item.city}
                        </p>
                      </div>
                      <p className="text-sm font-medium text-foreground">{item.status}</p>
                    </div>
                  ))}
                </div>

                <footer className="rounded-2xl border border-primary/20 bg-primary/10 p-4">
                  <p className="text-sm font-medium text-foreground">
                    91% of urgent requests in your area were matched within 30
                    minutes last week.
                  </p>
                </footer>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 sm:px-10">
        <div className="mx-auto w-full max-w-6xl">
          <div className="mb-10 max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              Why people trust it
            </p>
            <h2 className="mt-3 text-balance font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
              Minimal interface, serious operational clarity.
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {trustPillars.map(({ icon: Icon, title, description }) => (
              <article
                key={title}
                className="group rounded-3xl border border-border/70 bg-card/75 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-md"
              >
                <span className="mb-5 inline-flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="size-5" />
                </span>
                <h3 className="font-heading text-xl font-semibold tracking-tight">
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16 sm:px-10">
        <div className="mx-auto w-full max-w-6xl rounded-[2rem] border border-border/70 bg-card/70 p-6 shadow-sm backdrop-blur-sm sm:p-9">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                Request flow
              </p>
              <h2 className="mt-2 font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
                Three steps, zero confusion.
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              Designed for urgency: everyone sees who is responsible and what
              happens next.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {journeySteps.map((step, index) => (
              <article
                key={step.title}
                className="rounded-2xl border border-border/70 bg-background/85 p-5"
              >
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  Step {index + 1}
                </span>
                <h3 className="mt-3 font-heading text-lg font-semibold tracking-tight">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16 sm:px-10">
        <div className="mx-auto grid w-full max-w-6xl gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <article className="rounded-[2rem] border border-border/70 bg-card p-7 shadow-md sm:p-9">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              Real impact
            </p>
            <h2 className="mt-3 max-w-lg text-balance font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
              Built for consistent results, not one-off heroics.
            </h2>
            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-secondary/70 p-4">
                <p className="text-2xl font-semibold">58K+</p>
                <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                  Lives supported
                </p>
              </div>
              <div className="rounded-2xl bg-secondary/70 p-4">
                <p className="text-2xl font-semibold">320+</p>
                <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                  Partner clinics
                </p>
              </div>
              <div className="rounded-2xl bg-secondary/70 p-4">
                <p className="text-2xl font-semibold">4.9/5</p>
                <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                  Coordinator score
                </p>
              </div>
            </div>
          </article>

          <div className="grid gap-5">
            <article className="rounded-3xl border border-border/70 bg-card/85 p-6 shadow-sm">
              <p className="text-sm leading-relaxed text-muted-foreground">
                &quot;What used to take dozens of calls is now one flow. We can
                spot risk early and move donors faster.&quot;
              </p>
              <div className="mt-5 flex items-center gap-3">
                <span className="inline-flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <CheckCircle2 className="size-5" />
                </span>
                <div>
                  <p className="text-sm font-medium">Nina Patel</p>
                  <p className="text-xs text-muted-foreground">
                    Regional Donation Coordinator
                  </p>
                </div>
              </div>
            </article>

            <article className="rounded-3xl border border-border/70 bg-secondary/65 p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                    Next drive
                  </p>
                  <p className="mt-2 font-heading text-xl font-semibold tracking-tight">
                    Downtown Mobile Unit
                  </p>
                </div>
                <CalendarClock className="mt-1 size-5 text-primary" />
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Saturday, 10:00 AM to 4:00 PM. Open slots available for first
                time donors.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="px-6 pb-8 pt-6 sm:px-10">
        <div className="mx-auto w-full max-w-6xl rounded-[2rem] border border-primary/20 bg-primary/10 px-6 py-10 sm:px-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                Ready when needed
              </p>
              <h2 className="mt-3 text-balance font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
                Join a donor network designed for speed, trust, and follow-through.
              </h2>
            </div>
            <Button
              asChild
              size="lg"
              className="h-12 rounded-full px-7 md:mb-1"
            >
              <Link href="/auth" className="gap-2">
                Create your profile
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
