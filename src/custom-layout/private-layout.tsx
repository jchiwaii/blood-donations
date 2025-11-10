"use client";

import React from "react";
import PrivateLayoutHeader, { NavItem } from "./header";
import useUsersStore, { IUserStore } from "@/store/users-store";
import { currentUser } from "@/server-actions/users";
import { useRouter } from "next/navigation";

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
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-80"
          style={{
            background:
              "radial-gradient(120% 140% at 20% 0%, rgba(244,114,182,0.35) 0%, rgba(79,70,229,0.28) 45%, rgba(15,23,42,0.95) 100%)",
          }}
        />
        <div className="relative z-10 text-center">
          <div className="mx-auto mb-6 flex size-14 items-center justify-center rounded-full border border-white/20 bg-white/10">
            <div className="size-8 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          </div>
          <p className="text-sm font-medium uppercase tracking-[0.35em] text-white/60">
            Preparing dashboard
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          background:
            "radial-gradient(140% 160% at 10% -20%, rgba(244,114,182,0.35) 0%, rgba(79,70,229,0.25) 40%, rgba(15,23,42,0.9) 100%)",
        }}
      />
      <div className="pointer-events-none absolute -bottom-20 left-[-15%] h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -top-24 right-[-10%] h-80 w-80 rounded-full bg-rose-500/25 blur-3xl" />

      <div className="relative z-10 flex min-h-screen flex-col">
        <PrivateLayoutHeader navItems={navItems} />
        <main className="relative flex-1 pb-16 pt-10 lg:pt-12">{children}</main>
      </div>
    </div>
  );
};

export default PrivateLayout;
