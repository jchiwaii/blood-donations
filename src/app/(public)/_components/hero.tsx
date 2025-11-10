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
    <section className="relative overflow-hidden px-6 pb-24 pt-16 sm:px-8 lg:pb-32 lg:pt-24">
      <div
        className="pointer-events-none absolute inset-0 opacity-90"
        style={{
          background:
            "radial-gradient(120% 120% at 15% -10%, rgba(244,114,182,0.55) 0%, rgba(79,70,229,0.4) 45%, rgba(15,23,42,0.98) 80%)",
        }}
      />

      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMCAwSDY0VjY0SDBWMFoiIGZpbGw9ImhzbCgwLDAlLDAuMDUpIi8+PHBhdGggZD0iTTE2IDEySDE4VjE2SDE2VjEyWiIgZmlsbD0iI0ZGRiIgb3BhY2l0eT0iMC4wOCIvPjxwYXRoIGQ9Ik0zMiA4SDE0VjE2SDMyVjhMMzIgOFoiIGZpbGw9IiNGRkYiIG9wYWNpdHk9IjAuMDQiLz48L3N2Zz4=')] opacity-[0.08]" />

      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto max-w-4xl space-y-10 text-center text-white">
          {/* Badge */}
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-white/70">
            Give & receive
          </span>

          {/* Main heading */}
          <h1 className="text-4xl font-semibold leading-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Donate blood, empower
            <span className="block bg-linear-to-r from-rose-200 via-fuchsia-200 to-sky-200 bg-clip-text text-transparent">
              life-saving moments.
            </span>
          </h1>

          {/* Description */}
          <p className="mx-auto max-w-2xl text-base text-white/80 sm:text-lg md:text-xl">
            BloodConnect brings recipients, donors, and coordinators together
            under one guided experience so every urgent request finds a fast,
            trusted response.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="bg-rose-500 px-8 py-6 text-base font-semibold text-white transition hover:bg-rose-600"
              asChild
            >
              <Link href="/auth" className="flex items-center gap-2">
                <Heart className="size-5" />
                Get Started
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/30 bg-white/10 px-8 py-6 text-base font-semibold text-white backdrop-blur transition hover:bg-white/20"
              asChild
            >
              <a href="#impact">Learn More</a>
            </Button>
          </div>

          {/* Feature items */}
          <div className="grid gap-4 pt-8 sm:grid-cols-3">
            {featureItems.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="group flex flex-col items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-6 text-center backdrop-blur transition duration-300 hover:border-white/40 hover:bg-white/15"
              >
                <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white">
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

          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-8 border-t border-white/10 pt-8 text-sm text-white/75">
            <div>
              <p className="text-3xl font-semibold text-white">12K+</p>
              <p className="text-xs uppercase tracking-[0.18em] text-white/60">
                active donors
              </p>
            </div>
            <div>
              <p className="text-3xl font-semibold text-white">58K+</p>
              <p className="text-xs uppercase tracking-[0.18em] text-white/60">
                lives supported
              </p>
            </div>
            <div>
              <p className="text-3xl font-semibold text-white">
                <Heart className="mr-2 inline size-6 text-rose-200" />
                24/7
              </p>
              <p className="text-xs uppercase tracking-[0.18em] text-white/60">
                coordinator care
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
