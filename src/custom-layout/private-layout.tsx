"use client";

import React from "react";
import { useRouter } from "next/navigation";

import PrivateLayoutHeader, { NavItem } from "./header";
import useUsersStore, { IUserStore } from "@/store/users-store";
import { currentUser } from "@/server-actions/users";

interface PrivateLayoutProps {
  children: React.ReactNode;
  navItems?: NavItem[];
}

const PrivateLayout = ({ children, navItems }: PrivateLayoutProps) => {
  const { users, setUsers } = useUsersStore() as IUserStore;
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await currentUser();
        if (user) {
          setUsers(user as any);
        } else {
          router.push("/");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        router.push("/");
      } finally {
        setIsLoading(false);
      }
    };

    if (!users) {
      fetchUser();
    } else {
      setIsLoading(false);
    }
  }, [users, setUsers, router]);

  if (isLoading) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background text-foreground">
        <div className="pointer-events-none absolute inset-0 opacity-75" style={{ background: "radial-gradient(circle at 15% -10%, rgba(196,44,43,0.14), transparent 35%), radial-gradient(circle at 90% 10%, rgba(180,83,9,0.1), transparent 28%)" }} />
        <div className="relative z-10 text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full border border-border bg-card">
            <div className="size-7 animate-spin rounded-full border-2 border-border border-t-primary" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Loading workspace
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div
        className="pointer-events-none absolute inset-0 opacity-75"
        style={{
          background:
            "radial-gradient(circle at 8% -12%, rgba(196,44,43,0.14), transparent 34%), radial-gradient(circle at 92% 8%, rgba(180,83,9,0.1), transparent 26%)",
        }}
      />
      <div className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,rgba(24,28,35,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(24,28,35,0.035)_1px,transparent_1px)] [background-size:34px_34px] opacity-20" />

      <div className="relative z-10 flex min-h-screen flex-col">
        <PrivateLayoutHeader navItems={navItems} />
        <main className="relative flex-1 pb-16 pt-8 sm:pt-10">{children}</main>
      </div>
    </div>
  );
};

export default PrivateLayout;
