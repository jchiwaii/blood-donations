"use client";

import React from "react";
import { getAllUsers } from "@/server-actions/users";
import { User, Mail, Calendar, Users as UsersIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import PageTitle from "@/components/ui/page-title";

type UserData = {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
};

const AdminUsersPage = () => {
  const [users, setUsers] = React.useState<UserData[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [filter, setFilter] = React.useState<"all" | "donor" | "recipient">(
    "all"
  );

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
      <div className="space-y-6">
        <div className="h-12 w-64 animate-pulse rounded-2xl border border-white/10 bg-white/5" />
        <div className="grid gap-4 sm:grid-cols-2">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="h-32 animate-pulse rounded-2xl border border-white/10 bg-white/5"
            />
          ))}
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-2xl border border-white/10 bg-white/5"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageTitle title="Users Management" />
      <p className="text-sm text-white/60">
        View and manage all donors and recipients
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur transition hover:border-white/20 hover:bg-white/10">
          <div className="flex items-center gap-4">
            <div className="flex size-14 items-center justify-center rounded-xl bg-rose-500/20 text-rose-300">
              <UsersIcon className="size-7" />
            </div>
            <div>
              <p className="text-sm uppercase tracking-wider text-white/60">
                Total Donors
              </p>
              <p className="text-3xl font-bold text-white">{donorCount}</p>
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur transition hover:border-white/20 hover:bg-white/10">
          <div className="flex items-center gap-4">
            <div className="flex size-14 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-300">
              <UsersIcon className="size-7" />
            </div>
            <div>
              <p className="text-sm uppercase tracking-wider text-white/60">
                Total Recipients
              </p>
              <p className="text-3xl font-bold text-white">{recipientCount}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">All Users</h2>
          <p className="text-sm text-white/60">
            Browse all registered donors and recipients
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 p-1">
          {["all", "donor", "recipient"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as typeof filter)}
              className={cn(
                "rounded-lg px-4 py-2 text-xs font-semibold uppercase tracking-wider transition",
                filter === f
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-white/70 hover:text-white"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
          <p className="text-white/60">No users found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur transition hover:border-white/20 hover:bg-white/10"
            >
              <div className="p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex size-12 items-center justify-center rounded-full bg-white/10 text-white">
                      <User className="size-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {user.name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-white/70">
                        <Mail className="size-3.5" />
                        <span>{user.email}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider",
                        user.role === "donor"
                          ? "border-rose-400/40 bg-rose-500/20 text-rose-300"
                          : "border-indigo-400/40 bg-indigo-500/20 text-indigo-300"
                      )}
                    >
                      {user.role}
                    </span>
                    {user.created_at && (
                      <span className="flex items-center gap-1.5 text-xs text-white/60">
                        <Calendar className="size-3.5" />
                        Joined{" "}
                        {new Date(user.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;
