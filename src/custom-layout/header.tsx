"use client";

import React from "react";
import useUsersStore, { IUserStore } from "@/store/users-store";
import { useRouter, usePathname } from "next/navigation";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, LogOut, User, LucideIcon, Droplet } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
}

interface PrivateLayoutHeaderProps {
  navItems?: NavItem[];
}

const PrivateLayoutHeader = ({ navItems = [] }: PrivateLayoutHeaderProps) => {
  const { users } = useUsersStore() as IUserStore;
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleLogout = () => {
    Cookies.remove("auth_token");
    toast.success("Logout successful!", {
      description: "You have been logged out successfully.",
      duration: 3000,
    });
    setTimeout(() => {
      router.push("/");
      router.refresh();
    }, 500);
  };

  if (!users) {
    return null;
  }

  const isActive = (path: string) => pathname === path;

  const homePath = users.role === "donor" ? "/donor/dashboard" : "/recipient/dashboard";
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-slate-950/80 backdrop-blur">
      <div
        className="pointer-events-none absolute inset-0 opacity-90"
        style={{
          background:
            "radial-gradient(120% 180% at 0% -20%, rgba(244,114,182,0.22) 0%, rgba(129,140,248,0.18) 38%, rgba(15,23,42,0.85) 100%)",
        }}
      />
      <div className="relative mx-auto flex h-20 max-w-6xl items-center justify-between px-4 md:px-6">
        <button
          type="button"
          onClick={() => router.push(homePath)}
          className="group flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-left text-white transition hover:border-white/30 hover:bg-white/10"
        >
          <span className="flex size-10 items-center justify-center rounded-full bg-rose-500/20 text-rose-200 transition group-hover:bg-rose-400/30 group-hover:text-white">
            <Droplet className="size-5" />
          </span>
          <div className="leading-tight">
            <p className="text-xs uppercase tracking-[0.22em] text-white/60">
              Bloodline
            </p>
            <p className="text-sm font-semibold text-white">Donations Portal</p>
          </div>
        </button>

        <nav className="hidden items-center gap-2 md:flex">
          {navItems.length > 0 &&
            navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Button
                  key={item.path}
                  size="sm"
                  variant="ghost"
                  onClick={() => router.push(item.path)}
                  className={cn(
                    "relative overflow-hidden rounded-full border border-transparent bg-white/5 px-4 py-2 text-sm font-medium text-white/70 transition hover:border-white/20 hover:bg-white/10 hover:text-white",
                    active &&
                      "border-white/30 bg-linear-to-r from-rose-500/70 via-fuchsia-500/60 to-indigo-500/70 text-white shadow-lg shadow-rose-500/25"
                  )}
                >
                  <Icon className="size-4" />
                  <span>{item.label}</span>
                  {active && (
                    <span className="pointer-events-none absolute inset-0 bg-linear-to-r from-white/20 via-white/5 to-transparent" />
                  )}
                </Button>
              );
            })}

          <div className="ml-4 flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-white/80">
            <div className="text-right leading-tight">
              <p className="text-sm font-semibold text-white">{users.name}</p>
              <p className="text-[11px] uppercase tracking-[0.2em] text-white/60">{users.role}</p>
            </div>
            <span className="flex size-10 items-center justify-center rounded-full bg-white/10 text-white">
              <User className="size-5" />
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="size-9 rounded-full border border-white/10 text-rose-200 transition hover:border-rose-400/40 hover:bg-rose-500/10 hover:text-white"
            >
              <LogOut className="size-5" />
            </Button>
          </div>
        </nav>

        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-10 rounded-xl border border-white/20 bg-white/10 text-white"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-full max-w-sm border-l border-white/10 bg-slate-950/95 text-white"
            >
              <SheetHeader className="mb-6 text-left">
                <SheetTitle className="text-lg font-semibold text-white">
                  Quick actions
                </SheetTitle>
              </SheetHeader>
              <div className="space-y-6">
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-white/10 text-white">
                    <User className="size-6" />
                  </span>
                  <div className="space-y-1 text-sm">
                    <p className="font-semibold text-white">{users.name}</p>
                    <p className="text-white/70">{users.email}</p>
                    <p className="text-xs uppercase tracking-[0.25em] text-white/60">
                      {users.role}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {navItems.length > 0 &&
                    navItems.map((item) => {
                      const Icon = item.icon;
                      const active = isActive(item.path);
                      return (
                        <Button
                          key={item.path}
                          variant="ghost"
                          onClick={() => {
                            router.push(item.path);
                            setIsOpen(false);
                          }}
                          className={cn(
                            "justify-start gap-3 rounded-2xl border border-transparent bg-white/5 px-4 py-3 text-white/70 transition hover:border-white/20 hover:bg-white/10 hover:text-white",
                            active &&
                              "border-white/30 bg-linear-to-r from-rose-500/70 via-fuchsia-500/60 to-indigo-500/70 text-white shadow-lg shadow-rose-500/25"
                          )}
                        >
                          <Icon className="size-4" />
                          {item.label}
                        </Button>
                      );
                    })}
                </div>

                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="w-full justify-start gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 text-rose-100 transition hover:bg-rose-500/20 hover:text-white"
                >
                  <LogOut className="size-4" />
                  Logout
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default PrivateLayoutHeader;
