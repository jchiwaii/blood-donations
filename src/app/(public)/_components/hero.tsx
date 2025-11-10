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
        className="pointer-events-none absolute inset-0 opacity-85"
        style={{
          background:
            "radial-gradient(120% 120% at 18% -10%, rgba(244,114,182,0.45) 0%, rgba(79,70,229,0.35) 40%, rgba(15,23,42,0.98) 75%)",
        }}
      />

      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMCAwSDY0VjY0SDBWMFoiIGZpbGw9ImhzbCgwLDAlLDAuMDUpIi8+PHBhdGggZD0iTTE2IDEySDE4VjE2SDE2VjEyWiIgZmlsbD0iI0ZGRiIgb3BhY2l0eT0iMC4wOCIvPjxwYXRoIGQ9Ik0zMiA4SDE0VjE2SDMyVjhMMzIgOFoiIGZpbGw9IiNGRkYiIG9wYWNpdHk9IjAuMDQiLz48L3N2Zz4=')] opacity-[0.05]" />

      <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-12 text-center text-white">
        <div className="space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-white/70">
            Give & receive
          </span>

          <h1 className="mx-auto max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl md:text-6xl">
            Donate blood, empower
            <span className="block bg-linear-to-r from-rose-200 via-fuchsia-200 to-sky-200 bg-clip-text text-transparent">
              life-saving moments.
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-base text-white/80 sm:text-lg">
            BloodConnect brings recipients, donors, and coordinators together
            under one guided experience so every urgent request finds a fast,
            trusted response.
          </p>

          <div className="flex flex-col items-center justify-center">
            <Button
              size="lg"
              className="h-12 rounded-full bg-rose-500 px-8 text-sm font-semibold text-white transition hover:bg-rose-600"
              asChild
            >
              <Link href="/auth" className="flex items-center gap-2">
                <Heart className="size-4" />
                Get Started
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid w-full gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm sm:grid-cols-3">
          {featureItems.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex flex-col items-center gap-3 text-center">
              <span className="flex size-12 items-center justify-center rounded-xl bg-white/10 text-white">
                <Icon className="size-6" />
              </span>
              <div className="space-y-1">
                <p className="text-sm font-semibold uppercase tracking-wide text-white/85">
                  {title}
                </p>
                <p className="text-sm text-white/70">{description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex w-full flex-wrap items-center justify-center gap-8 border-t border-white/10 pt-8 text-sm text-white/75">
          <div className="text-center">
            <p className="text-3xl font-semibold text-white">12K+</p>
            <p className="text-xs uppercase tracking-[0.18em] text-white/60">
              active donors
            </p>
          </div>

          <div className="text-center">
            <p className="text-3xl font-semibold text-white">58K+</p>
            <p className="text-xs uppercase tracking-[0.18em] text-white/60">
              lives supported
            </p>
          </div>

          <div className="text-center">
            <p className="text-3xl font-semibold text-white">
              <Heart className="mr-2 inline size-5 text-rose-200" />
              24/7
            </p>
            <p className="text-xs uppercase tracking-[0.18em] text-white/60">
              coordinator care
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
