"use client";

import React from "react";
import {
  Calendar,
  CheckCircle,
  Clock,
  Droplet,
  Mail,
  MapPin,
  Phone,
  User,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import {
  getAllBloodDonationsForAdmin,
  updateBloodDonationStatus,
} from "@/server-actions/blood-donations";
import { IBloodDonation } from "@/interfaces";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PageTitle from "@/components/ui/page-title";
import { cn } from "@/lib/utils";

type BloodDonationWithDonor = IBloodDonation & {
  donor: {
    id: number;
    name: string;
    email: string;
  };
};

const filters = ["all", "pending", "approved", "rejected"] as const;

const AdminDonationsPage = () => {
  const [donations, setDonations] = React.useState<BloodDonationWithDonor[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [updatingId, setUpdatingId] = React.useState<number | null>(null);
  const [filter, setFilter] = React.useState<(typeof filters)[number]>("all");
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
      toast.success(`Donation marked ${status}`);
      fetchDonations();
    } else {
      toast.error("Failed to update donation status");
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
        return "border-amber-300 bg-amber-100 text-amber-800";
      case "approved":
        return "border-emerald-300 bg-emerald-100 text-emerald-800";
      case "rejected":
        return "border-rose-300 bg-rose-100 text-rose-800";
      default:
        return "border-border bg-secondary text-secondary-foreground";
    }
  };

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-7xl space-y-5 px-4 pb-16 sm:px-6 lg:px-8">
        <div className="h-14 w-72 animate-pulse rounded-2xl border border-border/70 bg-card/70" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-48 animate-pulse rounded-2xl border border-border/70 bg-card/70"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 pb-16 sm:px-6 lg:px-8">
      <PageTitle
        eyebrow="Admin"
        title="Donation Offers"
        subtitle="Approve or reject donor offers and verify availability details."
      />

      <section className="rounded-3xl border border-border/70 bg-card/80 p-6 shadow-sm">
        <div className="grid gap-3 md:grid-cols-[1.6fr_1fr]">
          <Input
            placeholder="Search by blood group, donor name, or email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-11 rounded-xl border-border/80 bg-background/70"
          />

          <div className="flex items-center gap-1 rounded-xl border border-border/80 bg-background/70 p-1">
            {filters.map((option) => (
              <button
                key={option}
                onClick={() => setFilter(option)}
                className={cn(
                  "flex-1 rounded-lg px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] transition",
                  filter === option
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </section>

      {filteredDonations.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-card/65 p-12 text-center text-sm text-muted-foreground">
          No donation offers found for this filter.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredDonations.map((donation) => (
            <article
              key={donation.id}
              className="rounded-3xl border border-border/70 bg-card/80 p-6 shadow-sm"
            >
              <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-2">
                  <h3 className="font-heading text-xl font-semibold tracking-tight text-foreground">
                    {donation.blood_group} Donation Offer
                  </h3>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em]",
                      getStatusBadge(donation.status)
                    )}
                  >
                    {donation.status === "pending" ? (
                      <Clock className="size-3.5" />
                    ) : donation.status === "approved" ? (
                      <CheckCircle className="size-3.5" />
                    ) : (
                      <XCircle className="size-3.5" />
                    )}
                    {donation.status}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {donation.status !== "approved" ? (
                    <Button
                      size="sm"
                      onClick={() => handleStatusUpdate(donation.id, "approved")}
                      disabled={updatingId === donation.id}
                      className="rounded-lg"
                    >
                      <CheckCircle className="size-4" />
                      Approve
                    </Button>
                  ) : null}

                  {donation.status !== "rejected" ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusUpdate(donation.id, "rejected")}
                      disabled={updatingId === donation.id}
                      className="rounded-lg border-rose-300 text-rose-700 hover:bg-rose-50"
                    >
                      <XCircle className="size-4" />
                      Reject
                    </Button>
                  ) : null}

                  {donation.status !== "pending" ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusUpdate(donation.id, "pending")}
                      disabled={updatingId === donation.id}
                      className="rounded-lg border-amber-300 text-amber-700 hover:bg-amber-50"
                    >
                      <Clock className="size-4" />
                      Set pending
                    </Button>
                  ) : null}
                </div>
              </div>

              {donation.notes ? (
                <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
                  {donation.notes}
                </p>
              ) : null}

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-2xl border border-border/70 bg-background/70 p-3">
                  <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                    Blood Group
                  </p>
                  <p className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-foreground">
                    <Droplet className="size-4 text-primary" />
                    {donation.blood_group}
                  </p>
                </div>

                <div className="rounded-2xl border border-border/70 bg-background/70 p-3">
                  <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                    Units Available
                  </p>
                  <p className="mt-1 text-sm font-medium text-foreground">
                    {donation.units_available} units
                  </p>
                </div>

                <div className="rounded-2xl border border-border/70 bg-background/70 p-3">
                  <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                    Donor
                  </p>
                  <p className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-foreground">
                    <User className="size-4 text-primary" />
                    {donation.donor?.name || "Unknown"}
                  </p>
                </div>

                <div className="rounded-2xl border border-border/70 bg-background/70 p-3">
                  <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                    Phone
                  </p>
                  <p className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-foreground">
                    <Phone className="size-4 text-primary" />
                    {donation.contact_phone}
                  </p>
                </div>

                <div className="rounded-2xl border border-border/70 bg-background/70 p-3">
                  <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                    Email
                  </p>
                  <p className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-foreground">
                    <Mail className="size-4 text-primary" />
                    {donation.contact_email}
                  </p>
                </div>

                <div className="rounded-2xl border border-border/70 bg-background/70 p-3">
                  <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                    Address
                  </p>
                  <p className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-foreground">
                    <MapPin className="size-4 text-primary" />
                    {donation.address}
                  </p>
                </div>
              </div>

              {donation.created_at ? (
                <p className="mt-4 inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="size-3.5" />
                  Created {new Date(donation.created_at).toLocaleDateString()}
                </p>
              ) : null}
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDonationsPage;
