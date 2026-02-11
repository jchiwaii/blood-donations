import Link from "next/link";
import {
  ArrowRight,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const values = [
  {
    icon: ShieldCheck,
    title: "Verified coordination",
    description:
      "Requests are reviewed before they reach donors, so people can respond with confidence.",
  },
  {
    icon: UsersRound,
    title: "Local communities first",
    description:
      "Matching prioritizes nearby donors and hospitals to reduce delays where every minute matters.",
  },
  {
    icon: HeartHandshake,
    title: "Human support",
    description:
      "Coordinators stay involved from first alert to confirmed donation handoff.",
  },
];

export default function AboutPage() {
  return (
    <div className="relative overflow-hidden pb-16 text-foreground">
      <div
        className="pointer-events-none absolute inset-0 opacity-75"
        style={{
          background:
            "radial-gradient(circle at 88% -8%, rgba(196,44,43,0.15), transparent 30%), radial-gradient(circle at 6% 18%, rgba(180,83,9,0.1), transparent 24%)",
        }}
      />

      <section className="relative px-6 pb-16 pt-16 sm:px-10 sm:pt-20">
        <div className="mx-auto w-full max-w-6xl rounded-[2rem] border border-border/70 bg-card/80 p-7 shadow-sm backdrop-blur-sm sm:p-10">
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            <Sparkles className="size-3.5" />
            Why Bloodline exists
          </p>
          <h1 className="mt-4 max-w-3xl text-balance font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
            We built Bloodline to make blood donation coordination calm, fast, and accountable.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
            The goal is simple: remove the chaos around urgent requests so
            recipients, donors, and coordinators can move through one clear
            workflow.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <article className="rounded-2xl border border-border/70 bg-background/80 p-4">
              <p className="text-2xl font-semibold">58K+</p>
              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                Lives supported
              </p>
            </article>
            <article className="rounded-2xl border border-border/70 bg-background/80 p-4">
              <p className="text-2xl font-semibold">12K+</p>
              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                Active donors
              </p>
            </article>
            <article className="rounded-2xl border border-border/70 bg-background/80 p-4">
              <p className="text-2xl font-semibold">24/7</p>
              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                Coordinator support
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="px-6 py-8 sm:px-10">
        <div className="mx-auto grid w-full max-w-6xl gap-4 md:grid-cols-3">
          {values.map(({ icon: Icon, title, description }) => (
            <article
              key={title}
              className="rounded-3xl border border-border/70 bg-card/75 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30"
            >
              <span className="mb-5 inline-flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Icon className="size-5" />
              </span>
              <h2 className="font-heading text-xl font-semibold tracking-tight">
                {title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="px-6 pb-4 pt-12 sm:px-10">
        <div className="mx-auto w-full max-w-6xl rounded-[2rem] border border-primary/20 bg-primary/10 px-6 py-10 sm:px-10">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                Join the network
              </p>
              <h2 className="mt-3 text-balance font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
                Become part of a donor community designed around real-world urgency.
              </h2>
            </div>
            <Button asChild size="lg" className="h-12 rounded-full px-7">
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
