"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Droplet, Menu, X } from "lucide-react";

const navItems = [
  { label: "About", href: "/#about" },
  { label: "Causes", href: "/#our-programs" },
  { label: "Donations", href: "/#donations" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Blog", href: "/campaigns" },
  { label: "Contact", href: "/#contact" },
];

const PublicHeader = () => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/95 backdrop-blur-xl">
      <div className="mx-auto flex h-20 w-full max-w-[1880px] items-center justify-between px-5 md:px-8 lg:px-10">
        <Link href="/" className="group flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-2xl bg-gradient-to-b from-[#fc605c] to-[#fc3b32] text-white shadow-[0_10px_24px_-14px_rgba(252,59,50,0.8)]">
            <Droplet className="size-5 fill-current" />
          </span>
          <span className="font-brand text-xl tracking-tight">Redflow</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-foreground transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-6 md:flex">
          <Link href="/auth" className="text-sm text-foreground transition-colors hover:text-primary">
            Sign In
          </Link>

          <Button
            asChild
            className="h-10 rounded-full bg-gradient-to-r from-[#fc605c] to-[#fc3b32] px-6 text-sm text-white shadow-[0_10px_24px_-14px_rgba(252,59,50,0.8)]"
          >
            <Link href="/auth">Donate Now</Link>
          </Button>
        </div>

        <button
          type="button"
          aria-expanded={mobileOpen}
          aria-label="Toggle menu"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors md:hidden"
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      <div
        className={cn(
          "fixed inset-0 z-40 bg-background/95 pt-20 backdrop-blur-xl transition-all duration-300 md:hidden",
          mobileOpen
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0"
        )}
      >
        <div className="mx-auto flex h-full w-full max-w-[1880px] flex-col px-5 pb-8 pt-6">
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-xl px-3 py-3 text-base text-foreground transition-colors hover:bg-secondary"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-auto grid grid-cols-2 gap-2 pt-6">
            <Button variant="outline" asChild className="h-11 rounded-xl border-border/80">
              <Link href="/auth">Sign In</Link>
            </Button>
            <Button
              asChild
              className="h-11 rounded-xl bg-gradient-to-r from-[#fc605c] to-[#fc3b32] text-white"
            >
              <Link href="/auth">Donate</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default PublicHeader;
