"use client";

import { useState } from "react";
import { Droplet, Heart, Shield, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import LoginForm from "./login-form";
import RegisterForm from "./register-form";

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

type AuthMode = "login" | "register";

export function AuthHero() {
  const [mode, setMode] = useState<AuthMode>("login");

  return (
    <section
      id="auth"
      className="relative overflow-hidden px-6 pb-24 pt-16 sm:px-8 lg:pb-32 lg:pt-24"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-90"
        style={{
          background:
            "radial-gradient(120% 120% at 15% -10%, rgba(244,114,182,0.55) 0%, rgba(79,70,229,0.4) 45%, rgba(15,23,42,0.98) 80%)",
        }}
      />

      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMCAwSDY0VjY0SDBWMFoiIGZpbGw9ImhzbCgwLDAlLDAuMDUpIi8+PHBhdGggZD0iTTE2IDEySDE4VjE2SDE2VjEyWiIgZmlsbD0iI0ZGRiIgb3BhY2l0eT0iMC4wOCIvPjxwYXRoIGQ9Ik0zMiA4SDE0VjE2SDMyVjhMMzIgOFoiIGZpbGw9IiNGRkYiIG9wYWNpdHk9IjAuMDQiLz48L3N2Zz4=')] opacity-[0.08]" />

      <div className="relative mx-auto flex max-w-7xl flex-col gap-12 lg:grid lg:grid-cols-[1.15fr_minmax(0,1fr)] lg:items-start">
        <div className="space-y-10 text-white">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-white/70">
              Give & receive
            </span>
            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl md:text-6xl">
              Donate blood, empower
              <span className="block bg-linear-to-r from-rose-200 via-fuchsia-200 to-sky-200 bg-clip-text text-transparent">
                life-saving moments.
              </span>
            </h1>
            <p className="max-w-xl text-base text-white/80 sm:text-lg">
              Bloodline brings recipients, donors, and coordinators together
              under one guided experience so every urgent request finds a fast,
              trusted response.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {featureItems.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="group flex items-start gap-3 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur transition duration-300 hover:border-white/40 hover:bg-white/15"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white">
                  <Icon className="size-5" />
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

          <div className="flex flex-wrap items-center gap-8 border-t border-white/10 pt-8 text-sm text-white/75">
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

        <div className="relative mx-auto w-full max-w-xl lg:ml-auto">
          <div className="absolute inset-0 -z-10 rounded-4xl bg-linear-to-br from-white/25 via-white/10 to-transparent blur-3xl" />
          <div className="relative overflow-hidden rounded-[28px] border border-white/15 bg-slate-950/80 p-8 shadow-[0_20px_120px_rgba(15,23,42,0.6)] backdrop-blur">
            <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 p-1 text-xs font-semibold text-white/70">
              <button
                type="button"
                onClick={() => setMode("login")}
                className={cn(
                  "flex-1 rounded-full px-4 py-2 transition",
                  mode === "login"
                    ? "bg-white text-slate-900 shadow-lg"
                    : "bg-transparent text-white/70 hover:text-white"
                )}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setMode("register")}
                className={cn(
                  "flex-1 rounded-full px-4 py-2 transition",
                  mode === "register"
                    ? "bg-white text-slate-900 shadow-lg"
                    : "bg-transparent text-white/70 hover:text-white"
                )}
              >
                Register
              </button>
            </div>

            <div className="mt-8 space-y-6">
              <div className="space-y-2 text-white">
                <h2 className="text-2xl font-semibold">
                  {mode === "login" ? "Welcome back" : "Create your account"}
                </h2>
                <p className="text-sm text-white/70">
                  {mode === "login"
                    ? "Access personalised dashboards and keep your profile up to date."
                    : "Join the network in minutes and get guided through every request."}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                {mode === "login" ? (
                  <LoginForm variant="dark" />
                ) : (
                  <RegisterForm variant="dark" />
                )}
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-white/70">
                <p>
                  We use secure protocols to keep your information encrypted.
                  Coordinators only receive the details necessary to manage your
                  donation or request.
                </p>
              </div>

              <Button
                size="lg"
                variant="ghost"
                className="w-full rounded-xl border border-white/20 bg-white/10 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
              >
                Prefer the classic experience? Switch to the legacy UI
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
