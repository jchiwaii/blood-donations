"use client";

import React from "react";
import { getUsersStatistics } from "@/server-actions/users";
import {
  Users,
  Droplet,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

const DashboardStats = () => {
  const [stats, setStats] = React.useState({
    totalDonors: 0,
    totalRecipients: 0,
    totalAdmins: 0,
    totalDonations: 0,
    totalRequests: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    rejectedRequests: 0,
  });
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchStats = async () => {
      const response = await getUsersStatistics();
      if (response.success && response.data) {
        setStats(response.data);
      }
      setLoading(false);
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Total Donors",
      value: stats.totalDonors,
      icon: Users,
      color: "from-rose-500/20 to-rose-600/20",
      iconColor: "text-rose-300",
      borderColor: "border-rose-400/40",
    },
    {
      title: "Total Recipients",
      value: stats.totalRecipients,
      icon: Users,
      color: "from-fuchsia-500/20 to-fuchsia-600/20",
      iconColor: "text-fuchsia-300",
      borderColor: "border-fuchsia-400/40",
    },
    {
      title: "Total Donations",
      value: stats.totalDonations,
      icon: Droplet,
      color: "from-indigo-500/20 to-indigo-600/20",
      iconColor: "text-indigo-300",
      borderColor: "border-indigo-400/40",
    },
    {
      title: "Total Requests",
      value: stats.totalRequests,
      icon: FileText,
      color: "from-sky-500/20 to-sky-600/20",
      iconColor: "text-sky-300",
      borderColor: "border-sky-400/40",
    },
    {
      title: "Pending Requests",
      value: stats.pendingRequests,
      icon: Clock,
      color: "from-amber-500/20 to-amber-600/20",
      iconColor: "text-amber-300",
      borderColor: "border-amber-400/40",
    },
    {
      title: "Approved Requests",
      value: stats.approvedRequests,
      icon: CheckCircle,
      color: "from-emerald-500/20 to-emerald-600/20",
      iconColor: "text-emerald-300",
      borderColor: "border-emerald-400/40",
    },
    {
      title: "Rejected Requests",
      value: stats.rejectedRequests,
      icon: XCircle,
      color: "from-red-500/20 to-red-600/20",
      iconColor: "text-red-300",
      borderColor: "border-red-400/40",
    },
  ];

  if (loading) {
    return (
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[...Array(7)].map((_, i) => (
          <div
            key={i}
            className="h-32 animate-pulse rounded-2xl border border-white/10 bg-white/5"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {statCards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className={cn(
              "group relative overflow-hidden rounded-2xl border backdrop-blur transition-all hover:scale-[1.02]",
              card.borderColor,
              `bg-linear-to-br ${card.color}`
            )}
          >
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium uppercase tracking-wider text-white/70">
                    {card.title}
                  </p>
                  <p className="text-3xl font-bold text-white">{card.value}</p>
                </div>
                <div
                  className={cn(
                    "flex size-12 items-center justify-center rounded-xl bg-white/10",
                    card.iconColor
                  )}
                >
                  <Icon className="size-6" />
                </div>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-white/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
        );
      })}
    </div>
  );
};

export default DashboardStats;
