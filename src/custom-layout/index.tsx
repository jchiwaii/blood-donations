"use client";
import { usePathname } from "next/navigation";
import React from "react";
import PrivateLayout from "./private-layout";
import { NavItem } from "./header";
import {
  LayoutDashboard,
  FileText,
  Heart,
  UserCircle,
  Users,
  Settings,
} from "lucide-react";

const CustomLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  const isRecipient = pathname.startsWith("/recipient");
  const isDonor = pathname.startsWith("/donor");
  const isAdmin = pathname.startsWith("/admin");

  // Recipient Navigation
  const recipientNavItems: NavItem[] = [
    { label: "Dashboard", path: "/recipient/dashboard", icon: LayoutDashboard },
    {
      label: "Blood Requests",
      path: "/recipient/blood-requests",
      icon: FileText,
    },
    { label: "Donations Received", path: "/recipient/donations", icon: Heart },
    { label: "Profile", path: "/recipient/profile", icon: UserCircle },
  ];

  // Donor Navigation
  const donorNavItems: NavItem[] = [
    { label: "Dashboard", path: "/donor/dashboard", icon: LayoutDashboard },
    { label: "Donate Blood", path: "/donor/donations", icon: Heart },
    { label: "Profile", path: "/donor/profile", icon: UserCircle },
  ];

  // Admin Navigation
  const adminNavItems: NavItem[] = [
    { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Users", path: "/admin/users", icon: Users },
    { label: "Settings", path: "/admin/settings", icon: Settings },
  ];

  if (isRecipient) {
    return (
      <PrivateLayout navItems={recipientNavItems}>{children}</PrivateLayout>
    );
  }

  if (isDonor) {
    return <PrivateLayout navItems={donorNavItems}>{children}</PrivateLayout>;
  }

  if (isAdmin) {
    return <PrivateLayout navItems={adminNavItems}>{children}</PrivateLayout>;
  }

  return <>{children}</>;
};

export default CustomLayout;
