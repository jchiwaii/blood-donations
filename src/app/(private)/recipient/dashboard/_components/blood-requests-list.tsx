"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Edit, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { deleteBloodRequest, getAllBloodRequests } from "@/server-actions/blood-reqests";
import { IBloodRequest } from "@/interfaces";
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
import DonationOffers from "./donation-offers";

interface BloodRequestsListProps {
  userId: number;
  initialRequests?: IBloodRequest[];
}

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending Review",
  approved: "Approved",
  fulfilled: "Fulfilled",
  cancelled: "Cancelled",
  in_progress: "In Progress",
};

const STATUS_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "in_progress", label: "In Progress" },
  { value: "fulfilled", label: "Fulfilled" },
  { value: "cancelled", label: "Cancelled" },
];

const badgeStyles: Record<string, string> = {
  pending: "border-amber-300 bg-amber-100 text-amber-800",
  approved: "border-emerald-300 bg-emerald-100 text-emerald-800",
  rejected: "border-rose-300 bg-rose-100 text-rose-800",
  fulfilled: "border-sky-300 bg-sky-100 text-sky-800",
  cancelled: "border-border bg-secondary text-secondary-foreground",
  in_progress: "border-primary/25 bg-primary/10 text-primary",
};

const urgencyStyles: Record<string, string> = {
  low: "border-emerald-300 bg-emerald-100 text-emerald-800",
  medium: "border-amber-300 bg-amber-100 text-amber-800",
  high: "border-orange-300 bg-orange-100 text-orange-800",
  critical: "border-rose-300 bg-rose-100 text-rose-800",
};

export default function BloodRequestsList({
  userId,
  initialRequests = [],
}: BloodRequestsListProps) {
  const router = useRouter();
  const [requests, setRequests] = useState<IBloodRequest[]>(initialRequests);
  const [loading, setLoading] = useState(initialRequests.length === 0);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deleteTarget, setDeleteTarget] = useState<IBloodRequest | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchRequests = async () => {
      setLoading(true);
      const response = await getAllBloodRequests(userId);

      if (!isMounted) return;

      if (response.success && Array.isArray(response.data)) {
        setRequests(response.data);
      } else {
        toast.error(response.message || "Failed to load blood requests");
        setRequests([]);
      }
      setLoading(false);
    };

    fetchRequests();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const matchesSearch = [
        request.title,
        request.blood_group,
        request.contact_phone,
        request.address,
      ]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus = statusFilter === "all" || request.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [requests, searchTerm, statusFilter]);

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      setDeleting(true);
      const response = await deleteBloodRequest(deleteTarget.id);

      if (response.success) {
        toast.success("Blood request deleted");
        setRequests((prev) => prev.filter((request) => request.id !== deleteTarget.id));
      } else {
        toast.error(response.message || "Failed to delete blood request");
      }
    } catch (error) {
      toast.error("An error occurred while deleting this request");
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
          Loading blood requests...
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
              Manage blood requests
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Track status, edit request details, and review matching offers.
            </p>
          </div>

          <Button onClick={() => router.push("/recipient/blood-requests")} className="rounded-xl">
            <Plus className="size-4" />
            Create request
          </Button>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-[1.8fr_1fr]">
          <Input
            placeholder="Search by title, blood group, or contact"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="h-11 rounded-xl border-border/80 bg-background/70"
          />

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-11 w-full rounded-xl border-border/80 bg-background/70">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredRequests.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-card/65 py-16 text-center">
          <p className="text-sm text-muted-foreground">No requests found for this filter.</p>
          <Button
            variant="outline"
            onClick={() => router.push("/recipient/blood-requests")}
            className="mt-4 rounded-xl"
          >
            <Plus className="size-4" />
            Create your first request
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <article
              key={request.id}
              className="rounded-3xl border border-border/70 bg-card/80 p-6 shadow-sm"
            >
              <div className="flex flex-col gap-6 lg:flex-row lg:justify-between">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-heading text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                      {request.title}
                    </h4>
                    <span
                      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${
                        badgeStyles[request.status] ||
                        "border-border bg-secondary text-secondary-foreground"
                      }`}
                    >
                      {STATUS_LABELS[request.status] || request.status}
                    </span>
                    <span
                      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${
                        urgencyStyles[request.urgency] ||
                        "border-border bg-secondary text-secondary-foreground"
                      }`}
                    >
                      {request.urgency}
                    </span>
                  </div>

                  <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
                    {request.description}
                  </p>

                  <dl className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-2xl border border-border/70 bg-background/70 p-3">
                      <dt className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                        Blood group
                      </dt>
                      <dd className="text-sm font-semibold text-foreground">{request.blood_group}</dd>
                    </div>
                    <div className="rounded-2xl border border-border/70 bg-background/70 p-3">
                      <dt className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                        Units needed
                      </dt>
                      <dd className="text-sm font-semibold text-foreground">{request.units_required}</dd>
                    </div>
                    <div className="rounded-2xl border border-border/70 bg-background/70 p-3">
                      <dt className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                        Contact
                      </dt>
                      <dd className="text-sm font-semibold text-foreground">{request.contact_phone}</dd>
                    </div>
                    <div className="rounded-2xl border border-border/70 bg-background/70 p-3">
                      <dt className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                        Location
                      </dt>
                      <dd className="text-sm font-semibold text-foreground">{request.address}</dd>
                    </div>
                  </dl>
                </div>

                <div className="flex w-full flex-col gap-2 lg:max-w-56">
                  {request.status === "approved" ? (
                    <DonationOffers requestId={request.id} requestTitle={request.title} />
                  ) : null}

                  <Button
                    variant="outline"
                    className="rounded-xl"
                    onClick={() => router.push(`/recipient/blood-requests/edit/${request.id}`)}
                    disabled={request.status === "approved"}
                  >
                    <Edit className="size-4" />
                    {request.status === "approved" ? "Approved - Locked" : "Edit"}
                  </Button>

                  <Button
                    variant="outline"
                    className="rounded-xl border-rose-300 text-rose-700 hover:bg-rose-50"
                    onClick={() => setDeleteTarget(request)}
                    disabled={request.status === "approved"}
                  >
                    <Trash2 className="size-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete blood request?</AlertDialogTitle>
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
