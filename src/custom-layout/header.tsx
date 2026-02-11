"use client";

import React from "react";
import Cookies from "js-cookie";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Droplet,
  LogOut,
  LucideIcon,
  Menu,
  ShieldCheck,
  User,
  X,
} from "lucide-react";

import useUsersStore, { IUserStore } from "@/store/users-store";
import { Button } from "@/components/ui/button";
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
  const [mobileOpen, setMobileOpen] = React.useState(false);

  if (!users) {
    return null;
  }

  const handleLogout = () => {
    Cookies.remove("auth_token");
    toast.success("Logged out", {
      description: "You have been signed out successfully.",
      duration: 2500,
    });

    setTimeout(() => {
      router.push("/");
      router.refresh();
    }, 250);
  };

  const isActive = (path: string) => pathname === path;

  const homePath =
    users.role === "donor"
      ? "/donor/dashboard"
      : users.role === "admin"
      ? "/admin/dashboard"
      : "/recipient/dashboard";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/85 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 md:px-6">
        <button
          type="button"
          onClick={() => {
            router.push(homePath);
            setMobileOpen(false);
          }}
          className="group flex items-center gap-3"
        >
          <span className="flex size-10 items-center justify-center rounded-2xl border border-primary/25 bg-primary/10 text-primary transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105">
            <Droplet className="size-5 fill-current" />
          </span>
          <div className="text-left leading-tight">
            <p className="font-heading text-base font-semibold tracking-tight text-foreground">
              Bloodline
            </p>
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              {users.role} workspace
            </p>
          </div>
        </button>

        <nav className="hidden items-center gap-1 xl:flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Button
                key={item.path}
                variant="ghost"
                size="sm"
                onClick={() => router.push(item.path)}
                className={cn(
                  "rounded-full border border-transparent px-4 text-sm font-medium text-muted-foreground transition",
                  active
                    ? "border-primary/20 bg-primary/10 text-primary"
                    : "hover:border-border hover:bg-card hover:text-foreground"
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Button>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 xl:flex">
          <div className="flex items-center gap-3 rounded-full border border-border/80 bg-card/70 px-3 py-1.5">
            <span className="flex size-9 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
              <User className="size-4" />
            </span>
            <div className="leading-tight">
              <p className="text-sm font-medium text-foreground">{users.name}</p>
              <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                {users.role}
              </p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="ml-1 inline-flex size-8 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-destructive/40 hover:text-destructive"
              aria-label="Logout"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        </div>

        <button
          type="button"
          aria-expanded={mobileOpen}
          aria-label="Toggle navigation"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-primary/30 hover:text-primary xl:hidden"
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      <div
        className={cn(
          "overflow-hidden border-t border-border/70 transition-all duration-300 xl:hidden",
          mobileOpen ? "max-h-[34rem] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="mx-auto grid w-full max-w-7xl gap-2 px-4 py-5 md:px-6">
          <div className="mb-2 flex items-center gap-3 rounded-2xl border border-border/70 bg-card/70 p-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
              <ShieldCheck className="size-5" />
            </span>
            <div>
              <p className="text-sm font-medium text-foreground">{users.name}</p>
              <p className="text-xs text-muted-foreground">{users.email}</p>
            </div>
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <button
                key={item.path}
                type="button"
                onClick={() => {
                  router.push(item.path);
                  setMobileOpen(false);
                }}
                className={cn(
                  "flex items-center gap-3 rounded-xl border px-3 py-2.5 text-left text-sm transition",
                  active
                    ? "border-primary/20 bg-primary/10 text-primary"
                    : "border-transparent bg-card/40 text-muted-foreground hover:border-border hover:bg-card hover:text-foreground"
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </button>
            );
          })}

          <Button
            variant="outline"
            onClick={handleLogout}
            className="mt-2 justify-start rounded-xl border-destructive/30 text-destructive hover:bg-destructive/10"
          >
            <LogOut className="size-4" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default PrivateLayoutHeader;
