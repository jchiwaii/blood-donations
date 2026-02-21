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
  const [mobileContentVisible, setMobileContentVisible] = useState(false);
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

  useEffect(() => {
    if (!mobileOpen) {
      setMobileContentVisible(false);
      return;
    }

    const timer = window.setTimeout(() => setMobileContentVisible(true), 130);
    return () => window.clearTimeout(timer);
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
          "fixed inset-x-0 bottom-0 top-20 z-40 transition-opacity duration-300 ease-out md:hidden",
          mobileOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        )}
      >
        <button
          type="button"
          aria-label="Close menu"
          onClick={closeMobileMenu}
          className={cn(
            "absolute inset-0 bg-transparent transition-opacity duration-300 ease-out will-change-[opacity]",
            mobileOpen ? "opacity-100 backdrop-blur-lg" : "opacity-0 backdrop-blur-none"
          )}
        />

        <aside
          role="dialog"
          aria-modal="true"
          onClick={(event) => {
            if (event.target === event.currentTarget) closeMobileMenu();
          }}
          className="absolute inset-0 flex flex-col px-7 pb-7 pt-8 text-foreground"
        >
          <div
            className={cn(
              "mx-auto flex h-full w-full max-w-md flex-col transition-all duration-300 ease-out",
              mobileContentVisible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
            )}
          >
            <nav className="mt-6 w-full space-y-2 text-center">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className="font-heading pointer-events-auto block rounded-2xl border border-border/80 bg-background/78 px-4 py-3 text-[clamp(2rem,9.6vw,3.25rem)] font-medium leading-[1.04] tracking-[-0.015em] text-foreground/95 shadow-[0_14px_34px_-26px_rgba(15,23,42,0.9)] backdrop-blur-sm transition-colors hover:bg-background/92"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mt-auto border-t border-border/70 pt-8 text-center">
              <p className="text-[0.72rem] font-medium uppercase tracking-[0.28em] text-white/80">
                Get In Touch
              </p>
              <p className="font-heading mt-3 text-[1.8rem] font-semibold leading-tight text-white">
                +1 800 123 4567
              </p>
              <p className="mt-1 text-base font-medium text-white/85">Midtown</p>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  asChild
                  className="pointer-events-auto h-11 rounded-xl border-border bg-card/85 text-sm text-foreground hover:bg-card"
                >
                  <Link href="/auth" onClick={closeMobileMenu}>
                    Login
                  </Link>
                </Button>
                <Button
                  asChild
                  className="pointer-events-auto h-11 rounded-xl bg-gradient-to-r from-[#fc605c] to-[#fc3b32] text-sm text-white"
                >
                  <Link href="/auth" onClick={closeMobileMenu}>
                    Register
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </header>
  );
};

export default PublicHeader;
