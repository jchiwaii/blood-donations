"use client";

import React from "react";
import PrivateLayout from "@/custom-layout/private-layout";
import { LayoutDashboard, Users, FileText, Settings } from "lucide-react";

const navItems = [
  {
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Users",
    path: "/admin/users",
    icon: Users,
  },
  {
    label: "Requests",
    path: "/admin/requests",
    icon: FileText,
  },
  {
    label: "Settings",
    path: "/admin/settings",
    icon: Settings,
  },
];

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return <PrivateLayout navItems={navItems}>{children}</PrivateLayout>;
};

export default AdminLayout;
