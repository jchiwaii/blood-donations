"use client";

import Link from "next/link";
import { Droplet, Heart, Shield, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const featureItems = [
  {
    icon: Droplet,
    title: "Smart matching",
    description: "Connect with donors nearby who share the right blood type.",
  },
  {
    icon: Shield,
    title: "Verified requests",
    description: "Every request is screened so volunteers feel confident.",
  },
  {
    icon: Users,
    title: "Community first",
    description:
      "Coordinators, donors, and recipients stay aligned in real time.",
  },
];

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden px-6 py-24 sm:px-10">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(220, 38, 38, 0.15) 0%, rgba(15, 23, 42, 0) 50%)",
        }}
      />

      <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-12 text-center text-foreground">
        <div className="space-y-8 animate-fade-in">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-primary shadow-glow">
            Give & receive
          </span>

          <h1 className="mx-auto max-w-4xl text-5xl font-bold leading-tight sm:text-6xl md:text-7xl font-heading tracking-tight">
            Donate blood, empower
            <span className="block bg-gradient-to-r from-primary via-red-400 to-orange-400 bg-clip-text text-transparent pb-2">
              life-saving moments.
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed">
            Bloodline brings recipients, donors, and coordinators together under
            one guided experience so every urgent request finds a fast, trusted
            response.
          </p>

          <div className="flex flex-col items-center justify-center pt-4">
            <Button
              size="lg"
              variant="premium"
              className="h-14 rounded-full px-10 text-base font-semibold transition-all hover:scale-105 bg-gradient-to-r from-primary to-red-600 shadow-glow"
              asChild
            >
              <Link href="/auth" className="flex items-center gap-2">
                <Heart className="size-5 fill-white/20" />
                Get Started Now
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid w-full gap-6 rounded-3xl border border-border/50 bg-card/30 p-8 backdrop-blur-md sm:grid-cols-3 shadow-2xl animate-slide-up">
          {featureItems.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="flex flex-col items-center gap-4 text-center group"
            >
              <span className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-glow">
                <Icon className="size-7" />
              </span>
              <div className="space-y-2">
                <p className="text-base font-semibold uppercase tracking-wide text-foreground font-heading">
                  {title}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex w-full flex-wrap items-center justify-center gap-12 border-t border-border/40 pt-12">
          <div className="text-center">
            <p className="text-4xl font-bold text-foreground font-heading">12K+</p>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mt-1">
              active donors
            </p>
          </div>

          <div className="text-center">
            <p className="text-4xl font-bold text-foreground font-heading">58K+</p>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mt-1">
              lives supported
            </p>
          </div>

          <div className="text-center">
            <p className="text-4xl font-bold text-foreground font-heading flex items-center justify-center gap-2">
              <Heart className="size-6 text-primary fill-primary/20" />
              24/7
            </p>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mt-1">
              coordinator care
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
