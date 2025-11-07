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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <PrivateLayoutHeader navItems={navItems} />
      <main>{children}</main>
    </div>
  );
};

export default PrivateLayout;
