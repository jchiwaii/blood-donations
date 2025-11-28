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
    <main className="relative isolate flex min-h-screen flex-col overflow-hidden bg-background text-foreground">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(220, 38, 38, 0.15) 0%, rgba(15, 23, 42, 0) 50%)",
        }}
      />

      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(220, 38, 38, 0.15) 0%, rgba(15, 23, 42, 0) 50%)",
        }}
      />

      <section className="relative z-10 flex flex-1 items-center justify-center px-6 pb-16 pt-4 sm:px-10">
        <div className="relative w-full max-w-lg">
          <div className="absolute inset-0 -z-10 rounded-3xl bg-primary/5 blur-3xl" />
          <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-card/50 p-8 shadow-2xl backdrop-blur-md animate-slide-up">
            <div className="flex flex-col gap-7">
              <div className="space-y-2 text-left">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                  Account access
                </p>
                <h1 className="text-3xl font-bold font-heading">
                  {mode === "login" ? "Welcome back" : "Join Bloodline"}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {mode === "login"
                    ? "Access personalised dashboards and keep your details current."
                    : "Create your profile and follow guided steps for every request."}
                </p>
              </div>

              <div className="flex w-full items-center gap-2 self-start rounded-full border border-border/50 bg-secondary/50 p-1 text-xs font-semibold text-muted-foreground">
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className={cn(
                    "flex-1 rounded-full px-4 py-2 transition-all duration-300",
                    mode === "login"
                      ? "bg-background text-foreground shadow-sm"
                      : "bg-transparent hover:text-foreground"
                  )}
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => setMode("register")}
                  className={cn(
                    "flex-1 rounded-full px-4 py-2 transition-all duration-300",
                    mode === "register"
                      ? "bg-background text-foreground shadow-sm"
                      : "bg-transparent hover:text-foreground"
                  )}
                >
                  Register
                </button>
              </div>

              <div className="rounded-2xl border border-border/50 bg-background/30 p-6 backdrop-blur-sm">
                {mode === "login" ? (
                  <LoginForm />
                ) : (
                  <RegisterForm />
                )}
              </div>

              <p className="text-center text-xs text-muted-foreground">
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
