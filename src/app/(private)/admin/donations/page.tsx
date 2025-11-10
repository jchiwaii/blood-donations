"use client";

import React from "react";
import {
  getAllBloodDonationsForAdmin,
  updateBloodDonationStatus,
} from "@/server-actions/blood-donations";
import { IBloodDonation } from "@/interfaces";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PageTitle from "@/components/ui/page-title";
import {
  CheckCircle,
  XCircle,
  Clock,
  User,
  Droplet,
  Phone,
  Mail,
  MapPin,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type BloodDonationWithDonor = IBloodDonation & {
  donor: {
    id: number;
    name: string;
    email: string;
  };
};

const AdminDonationsPage = () => {
  const [donations, setDonations] = React.useState<BloodDonationWithDonor[]>(
    []
  );
  const [loading, setLoading] = React.useState(true);
  const [updatingId, setUpdatingId] = React.useState<number | null>(null);
  const [filter, setFilter] = React.useState<
    "all" | "pending" | "approved" | "rejected"
  >("all");
  const [searchTerm, setSearchTerm] = React.useState("");

  const fetchDonations = async () => {
    setLoading(true);
    const response = await getAllBloodDonationsForAdmin();
    if (response.success && response.data) {
      setDonations(response.data as BloodDonationWithDonor[]);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    fetchDonations();
  }, []);

  const handleStatusUpdate = async (
    id: number,
    status: "approved" | "rejected" | "pending"
  ) => {
    setUpdatingId(id);
    const response = await updateBloodDonationStatus(id, { status });

    if (response.success) {
      toast.success(`Donation ${status}`, {
        description: `Blood donation offer has been ${status} successfully.`,
      });
      fetchDonations();
    } else {
      toast.error("Update failed", {
        description: "Failed to update donation status.",
      });
    }
    setUpdatingId(null);
  };

  const filteredDonations = donations.filter((donation) => {
    const matchesStatus = filter === "all" || donation.status === filter;
    const matchesSearch =
      searchTerm === "" ||
      donation.blood_group.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.donor?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.donor?.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return {
          bg: "bg-amber-500/20",
          border: "border-amber-400/40",
          text: "text-amber-300",
          icon: Clock,
        };
      case "approved":
        return {
          bg: "bg-emerald-500/20",
          border: "border-emerald-400/40",
          text: "text-emerald-300",
          icon: CheckCircle,
        };
      case "rejected":
        return {
          bg: "bg-red-500/20",
          border: "border-red-400/40",
          text: "text-red-300",
          icon: XCircle,
        };
      default:
        return {
          bg: "bg-slate-500/20",
          border: "border-slate-400/40",
          text: "text-slate-300",
          icon: Clock,
        };
    }
  };

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-7xl space-y-6 px-4 pb-16 sm:px-6 lg:px-8">
        <div className="h-12 w-64 animate-pulse rounded-2xl border border-white/10 bg-white/5" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-48 animate-pulse rounded-2xl border border-white/10 bg-white/5"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 px-4 pb-16 sm:px-6 lg:px-8">
      <PageTitle title="Donation Offers Management" />
      <p className="text-sm text-white/60">
        Review and approve blood donation offers from donors
      </p>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">Donation Offers</h2>
          <p className="text-sm text-white/60">
            Approve or reject donation offers
          </p>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto rounded-xl border border-white/15 bg-white/5 p-1">
          {["all", "pending", "approved", "rejected"].map((f) => (
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

      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <Input
          placeholder="Search by blood group, donor name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="h-12 rounded-xl border-white/10 bg-slate-900/60 text-sm text-white placeholder:text-white/50"
        />
      </div>

      {filteredDonations.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
          <p className="text-white/60">No donation offers found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredDonations.map((donation) => {
            const statusBadge = getStatusBadge(donation.status);
            const StatusIcon = statusBadge.icon;

            return (
              <div
                key={donation.id}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur transition hover:border-white/20 hover:bg-white/10"
              >
                <div className="p-6">
                  <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold text-white">
                        {donation.blood_group} Blood Donation Offer
                      </h3>
                      <div className="flex flex-wrap items-center gap-3">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider",
                            statusBadge.bg,
                            statusBadge.border,
                            statusBadge.text
                          )}
                        >
                          <StatusIcon className="size-3.5" />
                          {donation.status}
                        </span>
                      </div>
                    </div>

                    {donation.status === "pending" && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() =>
                            handleStatusUpdate(donation.id, "approved")
                          }
                          disabled={updatingId === donation.id}
                          className="rounded-xl border border-emerald-400/40 bg-emerald-500/20 text-emerald-300 transition hover:bg-emerald-500/30"
                        >
                          <CheckCircle className="size-4" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          onClick={() =>
                            handleStatusUpdate(donation.id, "rejected")
                          }
                          disabled={updatingId === donation.id}
                          className="rounded-xl border border-red-400/40 bg-red-500/20 text-red-300 transition hover:bg-red-500/30"
                        >
                          <XCircle className="size-4" />
                          Reject
                        </Button>
                      </div>
                    )}

                    {donation.status !== "pending" && (
                      <Button
                        size="sm"
                        onClick={() =>
                          handleStatusUpdate(donation.id, "pending")
                        }
                        disabled={updatingId === donation.id}
                        className="rounded-xl border border-amber-400/40 bg-amber-500/20 text-amber-300 transition hover:bg-amber-500/30"
                      >
                        <Clock className="size-4" />
                        Set Pending
                      </Button>
                    )}
                  </div>

                  {donation.notes && (
                    <p className="mb-6 text-sm text-white/70">
                      {donation.notes}
                    </p>
                  )}

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
                      <div className="flex size-10 items-center justify-center rounded-lg bg-rose-500/20 text-rose-300">
                        <Droplet className="size-5" />
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wider text-white/60">
                          Blood Group
                        </p>
                        <p className="font-semibold text-white">
                          {donation.blood_group}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
                      <div className="flex size-10 items-center justify-center rounded-lg bg-fuchsia-500/20 text-fuchsia-300">
                        <Droplet className="size-5" />
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wider text-white/60">
                          Units Available
                        </p>
                        <p className="font-semibold text-white">
                          {donation.units_available} units
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
                      <div className="flex size-10 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-300">
                        <User className="size-5" />
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wider text-white/60">
                          Donor
                        </p>
                        <p className="font-semibold text-white">
                          {donation.donor?.name || "Unknown"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
                      <div className="flex size-10 items-center justify-center rounded-lg bg-sky-500/20 text-sky-300">
                        <Phone className="size-5" />
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wider text-white/60">
                          Phone
                        </p>
                        <p className="font-semibold text-white">
                          {donation.contact_phone}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
                      <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-300">
                        <Mail className="size-5" />
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wider text-white/60">
                          Email
                        </p>
                        <p className="truncate font-semibold text-white">
                          {donation.contact_email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
                      <div className="flex size-10 items-center justify-center rounded-lg bg-amber-500/20 text-amber-300">
                        <MapPin className="size-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs uppercase tracking-wider text-white/60">
                          Location
                        </p>
                        <p className="truncate font-semibold text-white">
                          {donation.address}
                        </p>
                      </div>
                    </div>
                  </div>

                  {donation.created_at && (
                    <div className="mt-4 flex items-center gap-2 text-xs text-white/60">
                      <Calendar className="size-3.5" />
                      <span>
                        Created on{" "}
                        {new Date(donation.created_at).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminDonationsPage;
