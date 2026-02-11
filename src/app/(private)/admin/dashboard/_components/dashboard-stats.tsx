"use client";

import React from "react";
import { CheckCircle2, Clock3, Droplet, ShieldCheck, Users, XCircle } from "lucide-react";

import { getUsersStatistics } from "@/server-actions/users";

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
      title: "Donors",
      value: stats.totalDonors,
      description: "Registered donor accounts",
      icon: Users,
    },
    {
      title: "Recipients",
      value: stats.totalRecipients,
      description: "Registered recipient accounts",
      icon: Users,
    },
    {
      title: "Admins",
      value: stats.totalAdmins,
      description: "Platform admin users",
      icon: ShieldCheck,
    },
    {
      title: "Donation offers",
      value: stats.totalDonations,
      description: "Total offers submitted",
      icon: Droplet,
    },
    {
      title: "Blood requests",
      value: stats.totalRequests,
      description: "All requests posted",
      icon: Droplet,
    },
    {
      title: "Pending",
      value: stats.pendingRequests,
      description: "Awaiting review",
      icon: Clock3,
    },
    {
      title: "Approved",
      value: stats.approvedRequests,
      description: "Approved by admins",
      icon: CheckCircle2,
    },
    {
      title: "Rejected",
      value: stats.rejectedRequests,
      description: "Rejected requests",
      icon: XCircle,
    },
  ];

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="h-36 animate-pulse rounded-2xl border border-border/70 bg-card/70"
          />
        ))}
      </div>
    );
  }

  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statCards.map(({ title, value, description, icon: Icon }) => (
        <article
          key={title}
          className="rounded-2xl border border-border/70 bg-card/80 p-5 shadow-sm"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                {title}
              </p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
                {value}
              </p>
            </div>
            <span className="inline-flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon className="size-5" />
            </span>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">{description}</p>
        </article>
      ))}
    </section>
  );
};

export default DashboardStats;
