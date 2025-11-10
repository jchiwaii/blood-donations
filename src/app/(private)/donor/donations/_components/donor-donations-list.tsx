"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Heart,
  Loader2,
  Plus,
  Calendar,
  Droplet,
  Edit,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { IBloodDonation } from "@/interfaces";
import {
  getBloodDonations,
  deleteBloodDonation,
} from "@/server-actions/blood-donations";
import { cn } from "@/lib/utils";

interface DonorDonationsListProps {
  userId: number;
  initialDonations?: IBloodDonation[];
}

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending Approval",
  approved: "Approved",
  rejected: "Rejected",
  committed: "Committed",
  completed: "Completed",
};

const badgeStyles: Record<string, string> = {
  pending: "bg-amber-200 text-amber-900 border-amber-300",
  approved: "bg-emerald-200 text-emerald-900 border-emerald-300",
  rejected: "bg-rose-200 text-rose-900 border-rose-300",
  committed: "bg-blue-200 text-blue-900 border-blue-300",
  completed: "bg-slate-200 text-slate-900 border-slate-300",
};

export default function DonorDonationsList({
  userId,
  initialDonations = [],
}: DonorDonationsListProps) {
  const router = useRouter();
  const [donations, setDonations] =
    useState<IBloodDonation[]>(initialDonations);
  const [loading, setLoading] = useState(initialDonations.length === 0);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deleteTarget, setDeleteTarget] = useState<IBloodDonation | null>(
    null
  );
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchDonations = async () => {
      setLoading(true);
      const response = await getBloodDonations(userId);

      if (!isMounted) return;

      if (response.success && Array.isArray(response.data)) {
        setDonations(response.data);
      } else {
        toast.error(response.message || "Failed to load donations");
        setDonations([]);
      }
      setLoading(false);
    };

    fetchDonations();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  const filteredDonations = useMemo(() => {
    return donations.filter((donation) => {
      const matchesSearch = [
        donation.blood_group,
        donation.address,
        donation.contact_phone,
      ]
        .filter(Boolean)
        .some((value) =>
          value.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesStatus =
        statusFilter === "all" || donation.status === statusFilter;

      // Hide rejected donations
      const isNotRejected = donation.status !== "rejected";

      return matchesSearch && matchesStatus && isNotRejected;
    });
  }, [donations, searchTerm, statusFilter]);

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      setDeleting(true);
      const response = await deleteBloodDonation(deleteTarget.id);

      if (response.success) {
        toast.success("Donation offer deleted successfully");
        setDonations((prev) =>
          prev.filter((donation) => donation.id !== deleteTarget.id)
        );
      } else {
        toast.error(response.message || "Failed to delete donation offer");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the donation offer");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  if (loading) {
    return (
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 py-24 text-white shadow-[0_20px_60px_rgba(15,23,42,0.45)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(244,114,182,0.22),transparent_65%)]" />
        <div className="relative z-10 flex flex-col items-center gap-3 text-sm text-white/70">
          <Loader2 className="size-5 animate-spin text-white" />
          <span>Loading donation offers…</span>
        </div>
      </div>
    );
  }

  return (
    <section className="space-y-6 text-white">
      <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.4)] backdrop-blur md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-white">
            Manage donation offers
          </h3>
          <p className="text-sm text-white/70">
            Create new offers and track their approval status
          </p>
        </div>
        <Button
          onClick={() => router.push("/donor/donations/create")}
          className="gap-2 rounded-full bg-linear-to-r from-rose-500 via-fuchsia-500 to-indigo-500 px-5"
        >
          <Plus className="h-4 w-4" />
          Create offer
        </Button>
      </div>

      <div className="grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.35)] backdrop-blur md:grid-cols-[2fr,1fr]">
        <Input
          placeholder="Search by blood group or location"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className="h-12 rounded-xl border-white/10 bg-slate-900/60 text-sm text-white placeholder:text-white/50"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-12 rounded-xl border-white/10 bg-slate-900/60 text-white">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="border-white/10 bg-slate-900 text-white">
            <SelectItem
              value="all"
              className="text-white focus:bg-rose-500/20 focus:text-white"
            >
              All statuses
            </SelectItem>
            <SelectItem
              value="pending"
              className="text-white focus:bg-rose-500/20 focus:text-white"
            >
              Pending
            </SelectItem>
            <SelectItem
              value="approved"
              className="text-white focus:bg-rose-500/20 focus:text-white"
            >
              Approved
            </SelectItem>
            <SelectItem
              value="committed"
              className="text-white focus:bg-rose-500/20 focus:text-white"
            >
              Committed
            </SelectItem>
            <SelectItem
              value="completed"
              className="text-white focus:bg-rose-500/20 focus:text-white"
            >
              Completed
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredDonations.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-white/20 bg-white/5 py-24 text-center">
          <div className="rounded-full bg-rose-500/10 px-4 py-1 text-sm font-medium text-rose-200">
            No donation offers yet
          </div>
          <p className="max-w-md text-sm text-white/70">
            Your donation offers will appear here. Create your first offer to
            help those in need.
          </p>
          <Button
            variant="ghost"
            onClick={() => router.push("/donor/donations/create")}
            className="gap-2 rounded-full border border-white/20 bg-white/10 px-5 text-white transition hover:border-white/30 hover:bg-white/15"
          >
            <Plus className="h-4 w-4" />
            Create your first offer
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredDonations.map((donation) => (
            <article
              key={donation.id}
              className="relative overflow-hidden rounded-3xl border border-white/15 bg-white/5 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.4)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_25px_70px_rgba(244,114,182,0.2)]"
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(244,114,182,0.2),transparent_65%)]" />

              <div className="relative flex flex-col gap-6 lg:flex-row lg:justify-between">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <h4 className="text-2xl font-semibold text-white">
                      {donation.blood_group} Blood Donation Offer
                    </h4>
                    <span
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-900 ${
                        badgeStyles[donation.status] ||
                        "bg-white text-slate-900 border-white/60"
                      }`}
                    >
                      {STATUS_LABELS[donation.status] || donation.status}
                    </span>
                  </div>

                  {donation.notes && (
                    <p className="max-w-2xl text-sm text-white/70">
                      {donation.notes}
                    </p>
                  )}

                  <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                      <dt className="text-xs font-semibold uppercase tracking-wide text-white/60">
                        Blood group
                      </dt>
                      <dd className="text-lg font-semibold text-white">
                        {donation.blood_group}
                      </dd>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                      <dt className="text-xs font-semibold uppercase tracking-wide text-white/60">
                        Units available
                      </dt>
                      <dd className="text-lg font-semibold text-white">
                        {donation.units_available}
                      </dd>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                      <dt className="text-xs font-semibold uppercase tracking-wide text-white/60">
                        Availability
                      </dt>
                      <dd className="flex items-center gap-1 text-sm font-medium text-white">
                        <Calendar className="size-4" />
                        {new Date(
                          donation.availability_date
                        ).toLocaleDateString()}
                      </dd>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                      <dt className="text-xs font-semibold uppercase tracking-wide text-white/60">
                        Location
                      </dt>
                      <dd className="text-sm font-medium text-white">
                        {donation.address}
                      </dd>
                    </div>
                  </dl>
                </div>

                {donation.status !== "approved" && (
                  <div className="flex flex-col gap-3 lg:min-w-48">
                    <Button
                      variant="ghost"
                      className="w-full gap-2 rounded-full border border-white/20 bg-white/10 text-white transition hover:border-white/30 hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={donation.status === "approved"}
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full gap-2 rounded-full border border-rose-400/40 bg-rose-500/10 text-rose-100 transition hover:bg-rose-500/20 hover:text-white"
                      onClick={() => setDeleteTarget(donation)}
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={() => setDeleteTarget(null)}
      >
        <AlertDialogContent className="border-white/10 bg-slate-950/95 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              Delete donation offer
            </AlertDialogTitle>
            <AlertDialogDescription className="text-white/70">
              This action cannot be undone. The offer will be permanently
              removed from the platform.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={deleting}
              className="rounded-full border border-white/20 bg-white/10 text-white hover:bg-white/15"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="rounded-full bg-rose-500 text-white hover:bg-rose-400"
            >
              {deleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
