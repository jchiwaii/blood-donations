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
import { Menu, LogOut, User, LucideIcon } from "lucide-react";
import { toast } from "sonner";

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

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 md:px-8 max-w-full">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-destructive flex items-center justify-center">
              <span className="text-white font-bold text-sm">BD</span>
            </div>
            <h1 className="text-xl font-bold text-foreground">
              Blood Donations
            </h1>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.length > 0 &&
            navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Button
                  key={item.path}
                  variant="ghost"
                  onClick={() => router.push(item.path)}
                  className={`text-sm font-medium gap-2 transition-all ${
                    active
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                  size="sm"
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Button>
              );
            })}

          <div className="flex items-center gap-3 pl-4 ml-2 border-l border-border">
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">
                {users.name}
              </p>
              <p className="text-xs text-muted-foreground capitalize">
                {users.role}
              </p>
            </div>
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 mt-6">
                {/* User Info */}
                <div className="flex items-center gap-3 pb-4 border-b border-border">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {users.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {users.email}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {users.role}
                    </p>
                  </div>
                </div>

                {/* Navigation */}
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
                        className={`justify-start gap-2 ${
                          active
                            ? "bg-primary text-primary-foreground hover:bg-primary/90"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </Button>
                    );
                  })}

                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="justify-start text-destructive hover:text-destructive hover:bg-destructive/10 mt-4"
                >
                  <LogOut className="h-4 w-4 mr-2" />
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
