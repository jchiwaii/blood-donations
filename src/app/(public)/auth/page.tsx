"use client";

import Link from "next/link";
import { useState } from "react";
import { Droplet } from "lucide-react";

import { cn } from "@/lib/utils";
import LoginForm from "../_components/login-form";
import RegisterForm from "../_components/register-form";

type AuthMode = "login" | "register";

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>("login");

  return (
    <main className="relative isolate flex min-h-screen flex-col overflow-hidden bg-slate-950 text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-85"
        style={{
          background:
            "radial-gradient(120% 120% at 18% -10%, rgba(244,114,182,0.45) 0%, rgba(79,70,229,0.35) 45%, rgba(15,23,42,0.98) 75%)",
        }}
      />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMCAwSDY0VjY0SDBWMFoiIGZpbGw9ImhzbCgwLDAlLDAuMDUpIi8+PHBhdGggZD0iTTE2IDEySDE4VjE2SDE2VjEyWiIgZmlsbD0iI0ZGRiIgb3BhY2l0eT0iMC4wOCIvPjxwYXRoIGQ9Ik0zMiA4SDE0VjE2SDMyVjhMMzIgOFoiIGZpbGw9IiNGRkYiIG9wYWNpdHk9IjAuMDQiLz48L3N2Zz4=')] opacity-[0.05]" />

      <header className="relative z-10 flex items-center justify-between px-6 py-6 sm:px-10">
        <Link
          href="/"
          className="flex items-center gap-2 text-white/80 transition hover:text-white"
        >
          <span className="flex size-9 items-center justify-center rounded-2xl bg-white/10">
            <Droplet className="size-5 text-rose-200" />
          </span>
          <span className="text-base font-semibold tracking-wide">
            Bloodline
          </span>
        </Link>
        <Link
          href="/"
          className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60 transition hover:text-white"
        >
          Back to home
        </Link>
      </header>

      <section className="relative z-10 flex flex-1 items-center justify-center px-6 pb-16 pt-4 sm:px-10">
        <div className="relative w-full max-w-lg">
          <div className="absolute inset-0 -z-10 rounded-3xl bg-linear-to-br from-white/20 via-white/10 to-transparent blur-3xl" />
          <div className="relative overflow-hidden rounded-3xl border border-white/12 bg-slate-950/75 p-8 shadow-[0_18px_120px_rgba(15,23,42,0.5)] backdrop-blur">
            <div className="flex flex-col gap-7">
              <div className="space-y-2 text-left">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/50">
                  Account access
                </p>
                <h1 className="text-3xl font-semibold">
                  {mode === "login" ? "Welcome back" : "Join Bloodline"}
                </h1>
                <p className="text-sm text-white/65">
                  {mode === "login"
                    ? "Access personalised dashboards and keep your details current."
                    : "Create your profile and follow guided steps for every request."}
                </p>
              </div>

              <div className="flex w-full items-center gap-2 self-start rounded-full border border-white/15 bg-white/5 p-1 text-xs font-semibold text-white/70">
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className={cn(
                    "flex-1 rounded-full px-4 py-2 transition",
                    mode === "login"
                      ? "bg-white text-slate-900 shadow-sm"
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
                      ? "bg-white text-slate-900 shadow-sm"
                      : "bg-transparent text-white/70 hover:text-white"
                  )}
                >
                  Register
                </button>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                {mode === "login" ? (
                  <LoginForm variant="dark" />
                ) : (
                  <RegisterForm variant="dark" />
                )}
              </div>

              <p className="text-center text-xs text-white/60">
                We encrypt every submission so coordinators only receive the
                details required to help.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
