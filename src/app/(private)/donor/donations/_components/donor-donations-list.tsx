"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Edit, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { deleteBloodDonation, getBloodDonations } from "@/server-actions/blood-donations";
import { IBloodDonation } from "@/interfaces";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  pending: "border-amber-300 bg-amber-100 text-amber-800",
  approved: "border-emerald-300 bg-emerald-100 text-emerald-800",
  rejected: "border-rose-300 bg-rose-100 text-rose-800",
  committed: "border-sky-300 bg-sky-100 text-sky-800",
  completed: "border-border bg-secondary text-secondary-foreground",
};

export default function DonorDonationsList({ userId, initialDonations = [] }: DonorDonationsListProps) {
  const router = useRouter();
  const [donations, setDonations] = useState<IBloodDonation[]>(initialDonations);
  const [loading, setLoading] = useState(initialDonations.length === 0);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deleteTarget, setDeleteTarget] = useState<IBloodDonation | null>(null);
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
      const matchesSearch = [donation.blood_group, donation.address, donation.contact_phone]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus = statusFilter === "all" || donation.status === statusFilter;
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
        toast.success("Donation offer deleted");
        setDonations((prev) => prev.filter((d) => d.id !== deleteTarget.id));
      } else {
        toast.error(response.message || "Failed to delete donation offer");
      }
    } catch (error) {
      toast.error("An error occurred while deleting this offer");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  if (loading) {
    return (
      <div className="rounded-3xl border border-border/70 bg-card/80 py-20 text-center shadow-sm">
        <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Loading donation offers...
        </div>
      </div>
    );
  }

  return (
    <section className="space-y-5">
      <div className="rounded-3xl border border-border/70 bg-card/80 p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
              Manage donation offers
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Track status and keep your active offers current.
            </p>
          </div>

          <Button onClick={() => router.push("/donor/donations/create")} className="rounded-xl">
            <Plus className="size-4" />
            Create offer
          </Button>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-[1.8fr_1fr]">
          <Input
            placeholder="Search by blood group or location"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="h-11 rounded-xl border-border/80 bg-background/70"
          />

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-11 w-full rounded-xl border-border/80 bg-background/70">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="committed">Committed</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredDonations.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-card/65 py-16 text-center">
          <p className="text-sm text-muted-foreground">No donation offers found.</p>
          <Button
            variant="outline"
            onClick={() => router.push("/donor/donations/create")}
            className="mt-4 rounded-xl"
          >
            <Plus className="size-4" />
            Create your first offer
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredDonations.map((donation) => (
            <article
              key={donation.id}
              className="rounded-3xl border border-border/70 bg-card/80 p-6 shadow-sm"
            >
              <div className="flex flex-col gap-6 lg:flex-row lg:justify-between">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-heading text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                      {donation.blood_group} Donation Offer
                    </h4>
                    <span
                      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${
                        badgeStyles[donation.status] ||
                        "border-border bg-secondary text-secondary-foreground"
                      }`}
                    >
                      {STATUS_LABELS[donation.status] || donation.status}
                    </span>
                  </div>

                  {donation.notes ? (
                    <p className="max-w-3xl text-sm text-muted-foreground">{donation.notes}</p>
                  ) : null}

                  <dl className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-2xl border border-border/70 bg-background/70 p-3">
                      <dt className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                        Blood group
                      </dt>
                      <dd className="text-sm font-semibold text-foreground">{donation.blood_group}</dd>
                    </div>
                    <div className="rounded-2xl border border-border/70 bg-background/70 p-3">
                      <dt className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                        Units available
                      </dt>
                      <dd className="text-sm font-semibold text-foreground">{donation.units_available}</dd>
                    </div>
                    <div className="rounded-2xl border border-border/70 bg-background/70 p-3">
                      <dt className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                        Availability
                      </dt>
                      <dd className="inline-flex items-center gap-1 text-sm font-semibold text-foreground">
                        <Calendar className="size-4 text-primary" />
                        {new Date(donation.availability_date).toLocaleDateString()}
                      </dd>
                    </div>
                    <div className="rounded-2xl border border-border/70 bg-background/70 p-3">
                      <dt className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                        Location
                      </dt>
                      <dd className="text-sm font-semibold text-foreground">{donation.address}</dd>
                    </div>
                  </dl>
                </div>

                {donation.status !== "approved" ? (
                  <div className="flex w-full flex-col gap-2 lg:max-w-44">
                    <Button variant="outline" className="rounded-xl" disabled>
                      <Edit className="size-4" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      className="rounded-xl border-rose-300 text-rose-700 hover:bg-rose-50"
                      onClick={() => setDeleteTarget(donation)}
                    >
                      <Trash2 className="size-4" />
                      Delete
                    </Button>
                  </div>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      )}

      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete donation offer?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleting}>
              {deleting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
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
