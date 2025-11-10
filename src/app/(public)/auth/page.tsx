"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import LoginForm from "../_components/login-form";
import RegisterForm from "../_components/register-form";

type AuthMode = "login" | "register";

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>("login");

  return (
    <main className="relative min-h-screen overflow-hidden px-6 py-24 sm:px-8">
      {/* Background gradient */}
      <div
        className="pointer-events-none absolute inset-0 opacity-90"
        style={{
          background:
            "radial-gradient(120% 120% at 15% -10%, rgba(244,114,182,0.55) 0%, rgba(79,70,229,0.4) 45%, rgba(15,23,42,0.98) 80%)",
        }}
      />

      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMCAwSDY0VjY0SDBWMFoiIGZpbGw9ImhzbCgwLDAlLDAuMDUpIi8+PHBhdGggZD0iTTE2IDEySDE4VjE2SDE2VjEyWiIgZmlsbD0iI0ZGRiIgb3BhY2l0eT0iMC4wOCIvPjxwYXRoIGQ9Ik0zMiA4SDE0VjE2SDMyVjhMMzIgOFoiIGZpbGw9IiNGRkYiIG9wYWNpdHk9IjAuMDQiLz48L3N2Zz4=')] opacity-[0.08]" />

      {/* Auth form container */}
      <div className="relative mx-auto w-full max-w-xl">
        <div className="absolute inset-0 -z-10 rounded-4xl bg-linear-to-br from-white/25 via-white/10 to-transparent blur-3xl" />
        <div className="relative overflow-hidden rounded-[28px] border border-white/15 bg-slate-950/80 p-8 shadow-[0_20px_120px_rgba(15,23,42,0.6)] backdrop-blur">
          {/* Mode toggle */}
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
            {/* Header */}
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

            {/* Form */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              {mode === "login" ? (
                <LoginForm variant="dark" />
              ) : (
                <RegisterForm variant="dark" />
              )}
            </div>

            {/* Security notice */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-white/70">
              <p>
                We use secure protocols to keep your information encrypted.
                Coordinators only receive the details necessary to manage your
                donation or request.
              </p>
            </div>

            {/* Legacy UI button */}
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
    </main>
  );
}
