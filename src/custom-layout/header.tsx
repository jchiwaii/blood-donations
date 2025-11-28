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

  const homePath =
    users.role === "donor" ? "/donor/dashboard" : "/recipient/dashboard";
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="relative mx-auto flex h-20 max-w-7xl items-center justify-between px-4 md:px-6">
        <button
          type="button"
          onClick={() => router.push(homePath)}
          className="group flex items-center gap-3 rounded-full border border-primary/10 bg-primary/5 px-3 py-1.5 text-left transition hover:border-primary/30 hover:bg-primary/10"
        >
          <span className="flex size-10 items-center justify-center rounded-full bg-primary/20 text-primary transition group-hover:bg-primary/30 group-hover:text-primary shadow-glow">
            <Droplet className="size-5" />
          </span>
          <div className="leading-tight">
            <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
              Bloodline
            </p>
            <p className="text-sm font-semibold text-foreground font-heading">Donations Portal</p>
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
                    "relative overflow-hidden rounded-full border border-transparent px-4 py-2 text-sm font-medium text-muted-foreground transition hover:text-foreground hover:bg-accent",
                    active &&
                    "border-primary/20 bg-primary/10 text-primary shadow-sm"
                  )}
                >
                  <Icon className="size-4" />
                  <span>{item.label}</span>
                </Button>
              );
            })}

          <div className="ml-4 flex items-center gap-3 rounded-full border border-border bg-card/50 px-3 py-1.5 text-foreground">
            <div className="text-right leading-tight">
              <p className="text-sm font-semibold font-heading">{users.name}</p>
              <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                {users.role}
              </p>
            </div>
            <span className="flex size-10 items-center justify-center rounded-full bg-accent text-accent-foreground">
              <User className="size-5" />
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="size-9 rounded-full border border-border/50 text-muted-foreground transition hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive"
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
                className="size-10 rounded-xl border border-border bg-card/50 text-foreground"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-full max-w-sm border-l border-border bg-background/95 backdrop-blur-xl"
            >
              <SheetHeader className="mb-6 text-left">
                <SheetTitle className="text-lg font-semibold text-foreground font-heading">
                  Quick actions
                </SheetTitle>
              </SheetHeader>
              <div className="space-y-6">
                <div className="flex items-center gap-3 rounded-2xl border border-border bg-card/50 p-4">
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
                    <User className="size-6" />
                  </span>
                  <div className="space-y-1 text-sm">
                    <p className="font-semibold text-foreground font-heading">{users.name}</p>
                    <p className="text-muted-foreground">{users.email}</p>
                    <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
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
                            "justify-start gap-3 rounded-2xl border border-transparent px-4 py-3 text-muted-foreground transition hover:bg-accent hover:text-foreground",
                            active &&
                            "border-primary/20 bg-primary/10 text-primary"
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
                  className="w-full justify-start gap-3 rounded-2xl border border-destructive/30 bg-destructive/10 text-destructive transition hover:bg-destructive/20"
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
