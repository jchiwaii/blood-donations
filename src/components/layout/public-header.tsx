"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Droplet, Menu, Search, X } from "lucide-react";

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
  const [scrolled, setScrolled] = useState(false);

  const isHome = pathname === "/";
  const useSolidChrome = !isHome || scrolled || mobileOpen;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        useSolidChrome
          ? "border-b border-border/70 bg-background/95 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <div className="mx-auto flex h-20 w-full max-w-[1880px] items-center justify-between px-5 md:px-8 lg:px-10">
        <Link
          href="/"
          className={cn(
            "group flex items-center gap-3",
            !useSolidChrome && "text-white"
          )}
        >
          <span className="flex size-10 items-center justify-center rounded-2xl bg-gradient-to-b from-[#fc605c] to-[#fc3b32] text-white shadow-[0_10px_24px_-14px_rgba(252,59,50,0.8)]">
            <Droplet className="size-5 fill-current" />
          </span>
          <span className="font-heading text-xl font-semibold tracking-tight">
            Redflow
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm transition-colors",
                useSolidChrome
                  ? "text-foreground hover:text-primary"
                  : "text-white/90 hover:text-white"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-6 md:flex">
          <button
            type="button"
            aria-label="Search"
            className={cn(
              "transition-colors",
              useSolidChrome
                ? "text-foreground hover:text-primary"
                : "text-white/90 hover:text-white"
            )}
          >
            <Search className="size-5" />
          </button>

          <Link
            href="/auth"
            className={cn(
              "text-sm transition-colors",
              useSolidChrome
                ? "text-foreground hover:text-primary"
                : "text-white/90 hover:text-white"
            )}
          >
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
          className={cn(
            "inline-flex size-10 items-center justify-center rounded-full border transition-colors md:hidden",
            useSolidChrome
              ? "border-border bg-card text-foreground"
              : "border-white/30 bg-black/20 text-white backdrop-blur-sm"
          )}
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      <div
        className={cn(
          "overflow-hidden border-t transition-all duration-300 md:hidden",
          mobileOpen
            ? "max-h-[420px] border-border/60 bg-background/95 opacity-100"
            : "max-h-0 border-transparent bg-transparent opacity-0"
        )}
      >
        <div className="mx-auto w-full max-w-[1880px] space-y-3 px-5 py-5">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-xl px-3 py-2 text-sm text-foreground transition-colors hover:bg-secondary"
            >
              {item.label}
            </Link>
          ))}

          <div className="grid grid-cols-2 gap-2 pt-2">
            <Button
              variant="outline"
              asChild
              className="h-10 rounded-xl border-border/80"
            >
              <Link href="/auth">Sign In</Link>
            </Button>
            <Button
              asChild
              className="h-10 rounded-xl bg-gradient-to-r from-[#fc605c] to-[#fc3b32] text-white"
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
