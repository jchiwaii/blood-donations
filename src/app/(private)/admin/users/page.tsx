"use client";

import React from "react";
import { Calendar, Mail, User, Users as UsersIcon } from "lucide-react";

import { getAllUsers } from "@/server-actions/users";
import { cn } from "@/lib/utils";
import PageTitle from "@/components/ui/page-title";

type UserData = {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
};

const tabs = ["all", "donor", "recipient"] as const;

const AdminUsersPage = () => {
  const [users, setUsers] = React.useState<UserData[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [filter, setFilter] = React.useState<(typeof tabs)[number]>("all");

  const fetchUsers = async () => {
    setLoading(true);
    const response = await getAllUsers();
    if (response.success && response.data) {
      setUsers(response.data as UserData[]);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    if (filter === "all") return true;
    return user.role === filter;
  });

  const donorCount = users.filter((u) => u.role === "donor").length;
  const recipientCount = users.filter((u) => u.role === "recipient").length;

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-7xl space-y-6 px-4 pb-16 sm:px-6 lg:px-8">
        <div className="h-12 w-56 animate-pulse rounded-2xl border border-border/70 bg-card/70" />
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="h-32 animate-pulse rounded-2xl border border-border/70 bg-card/70"
            />
          ))}
        </div>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-2xl border border-border/70 bg-card/70"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 pb-16 sm:px-6 lg:px-8">
      <PageTitle
        eyebrow="Admin"
        title="Users"
        subtitle="Review registered donor and recipient accounts."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <article className="rounded-2xl border border-border/70 bg-card/80 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="inline-flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <UsersIcon className="size-5" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Donors
              </p>
              <p className="text-3xl font-semibold tracking-tight text-foreground">
                {donorCount}
              </p>
            </div>
          </div>
        </article>

        <article className="rounded-2xl border border-border/70 bg-card/80 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="inline-flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <UsersIcon className="size-5" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Recipients
              </p>
              <p className="text-3xl font-semibold tracking-tight text-foreground">
                {recipientCount}
              </p>
            </div>
          </div>
        </article>
      </div>

      <section className="rounded-3xl border border-border/70 bg-card/80 p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground">
            Registered users
          </h2>

          <div className="flex items-center gap-1 rounded-xl border border-border/80 bg-background/70 p-1">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] transition",
                  filter === tab
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="mt-5 rounded-2xl border border-dashed border-border bg-background/70 p-10 text-center text-sm text-muted-foreground">
            No users found.
          </div>
        ) : (
          <div className="mt-5 space-y-3">
            {filteredUsers.map((user) => (
              <article
                key={user.id}
                className="rounded-2xl border border-border/70 bg-background/70 p-4"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex size-10 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
                      <User className="size-4" />
                    </span>
                    <div>
                      <p className="font-medium text-foreground">{user.name}</p>
                      <p className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                        <Mail className="size-3.5" />
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={cn(
                        "rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em]",
                        user.role === "donor"
                          ? "border-emerald-300 bg-emerald-100 text-emerald-800"
                          : "border-primary/25 bg-primary/10 text-primary"
                      )}
                    >
                      {user.role}
                    </span>
                    {user.created_at ? (
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="size-3.5" />
                        {new Date(user.created_at).toLocaleDateString()}
                      </span>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminUsersPage;
