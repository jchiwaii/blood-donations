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
  const closeMobileMenu = () => setMobileOpen(false);

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
    <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background">
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
          "fixed inset-x-0 bottom-0 top-20 z-40 transition-opacity duration-300 md:hidden",
          mobileOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        )}
      >
        <button
          type="button"
          aria-label="Close menu"
          onClick={closeMobileMenu}
          className="absolute inset-0 backdrop-blur-2xl"
        />

        <aside
          role="dialog"
          aria-modal="true"
          onClick={(event) => {
            if (event.target === event.currentTarget) closeMobileMenu();
          }}
          className="absolute inset-0 flex flex-col px-6 pb-8 pt-24 text-white"
        >
          <nav className="mx-auto mt-12 w-full max-w-lg space-y-5 text-center">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMobileMenu}
                className="pointer-events-auto block text-[clamp(2.4rem,11vw,4.9rem)] font-semibold leading-[0.95] text-white transition-opacity hover:opacity-80"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-auto pt-8 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-white/60">Get In Touch</p>
            <p className="mt-4 text-4xl text-white">+1 800 123 4567</p>
            <p className="mt-2 text-xl text-white/70">Midtown</p>

            <div className="mt-7 grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                asChild
                className="pointer-events-auto h-12 rounded-xl border-white/50 !bg-transparent text-base text-white hover:opacity-80"
              >
                <Link href="/auth" onClick={closeMobileMenu}>
                  Login
                </Link>
              </Button>
              <Button
                variant="outline"
                asChild
                className="pointer-events-auto h-12 rounded-xl border-white/50 !bg-transparent text-base text-white hover:opacity-80"
              >
                <Link href="/auth" onClick={closeMobileMenu}>
                  Register
                </Link>
              </Button>
            </div>
          </div>
        </aside>
      </div>
    </header>
  );
};

export default PublicHeader;
