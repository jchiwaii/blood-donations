"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Droplet, Menu, X } from "lucide-react";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Campaigns", href: "/campaigns" },
];

const PublicHeader = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/85 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-20 w-full max-w-6xl items-center justify-between px-6 md:px-8">
        <Link
          href="/"
          onClick={() => setMobileOpen(false)}
          className="group flex items-center gap-3"
        >
          <span className="flex size-10 items-center justify-center rounded-2xl border border-primary/25 bg-primary/10 text-primary transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105">
            <Droplet className="size-5 fill-current" />
          </span>
          <span className="font-heading text-lg font-semibold tracking-tight text-foreground">
            Bloodline
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Button variant="ghost" asChild className="rounded-full text-sm">
            <Link href="/auth">Sign in</Link>
          </Button>
          <Button asChild className="rounded-full px-5 shadow-glow">
            <Link href="/auth" className="gap-2">
              Start donating
              <ArrowUpRight className="size-4" />
            </Link>
          </Button>
        </div>

        <button
          type="button"
          aria-expanded={mobileOpen}
          aria-label="Toggle menu"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-primary/30 hover:text-primary md:hidden"
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      <div
        className={cn(
          "overflow-hidden border-t border-border/60 transition-all duration-300 md:hidden",
          mobileOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-6 py-5">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="rounded-xl px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
          <div className="mt-1 grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              asChild
              className="w-full rounded-xl border-border/80"
            >
              <Link href="/auth" onClick={() => setMobileOpen(false)}>
                Sign in
              </Link>
            </Button>
            <Button asChild className="w-full rounded-xl">
              <Link href="/auth" onClick={() => setMobileOpen(false)}>
                Start
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default PublicHeader;
