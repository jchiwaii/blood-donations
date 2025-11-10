"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Edit, Loader2, Plus, Trash2 } from "lucide-react";

import { IBloodRequest } from "@/interfaces";
import {
  deleteBloodRequest,
  getAllBloodRequests,
} from "@/server-actions/blood-reqests";
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
  { value: "in_progress", label: "In Progress" },
  { value: "approved", label: "Approved" },
  { value: "fulfilled", label: "Fulfilled" },
  { value: "cancelled", label: "Cancelled" },
];

const badgeStyles: Record<string, string> = {
  pending: "bg-amber-200 text-amber-900 border-amber-300",
  approved: "bg-sky-200 text-sky-900 border-sky-300",
  fulfilled: "bg-emerald-200 text-emerald-900 border-emerald-300",
  cancelled: "bg-rose-200 text-rose-900 border-rose-300",
  in_progress: "bg-purple-200 text-purple-900 border-purple-300",
};

const urgencyStyles: Record<string, string> = {
  critical: "bg-rose-100 text-rose-900 border-rose-200",
  high: "bg-orange-100 text-orange-900 border-orange-200",
  medium: "bg-amber-100 text-amber-900 border-amber-200",
  low: "bg-emerald-100 text-emerald-900 border-emerald-200",
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
        .some((value) =>
          value.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesStatus =
        statusFilter === "all" || request.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [requests, searchTerm, statusFilter]);

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      setDeleting(true);
      const response = await deleteBloodRequest(deleteTarget.id);

      if (response.success) {
        toast.success("Blood request deleted successfully");
        setRequests((prev) =>
          prev.filter((request) => request.id !== deleteTarget.id)
        );
      } else {
        toast.error(response.message || "Failed to delete blood request");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the request");
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
          <span>Loading blood requests…</span>
        </div>
      </div>
    );
  }

  return (
    <section className="space-y-6 text-white">
      <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.4)] backdrop-blur md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-white">Manage blood requests</h3>
          <p className="text-sm text-white/70">
            Track the status of each case, update details, or submit a new request in seconds.
          </p>
        </div>
        <Button
          onClick={() => router.push("/recipient/blood-requests")}
          className="gap-2 rounded-full bg-linear-to-r from-rose-500 via-fuchsia-500 to-indigo-500 px-5"
        >
          <Plus className="h-4 w-4" />
          Create request
        </Button>
      </div>

      <div className="grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.35)] backdrop-blur md:grid-cols-[2fr,1fr]">
        <Input
          placeholder="Search by title, blood group, or contact"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className="h-12 rounded-xl border-white/10 bg-slate-900/60 text-sm text-white placeholder:text-white/50"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-12 rounded-xl border-white/10 bg-slate-900/60 text-white">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="border-white/10 bg-slate-900 text-white">
            {STATUS_OPTIONS.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="text-white focus:bg-rose-500/20 focus:text-white"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredRequests.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-white/20 bg-white/5 py-24 text-center">
          <div className="rounded-full bg-rose-500/10 px-4 py-1 text-sm font-medium text-rose-200">
            No blood requests yet
          </div>
          <p className="max-w-md text-sm text-white/70">
            Your requests will appear here as soon as you create them. Keep donors updated with accurate details and urgency levels.
          </p>
          <Button
            variant="ghost"
            onClick={() => router.push("/recipient/blood-requests")}
            className="gap-2 rounded-full border border-white/20 bg-white/10 px-5 text-white transition hover:border-white/30 hover:bg-white/15"
          >
            <Plus className="h-4 w-4" />
            Create your first request
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredRequests.map((request) => (
            <article
              key={request.id}
              className="relative overflow-hidden rounded-3xl border border-white/15 bg-white/5 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.4)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_25px_70px_rgba(244,114,182,0.2)]"
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(244,114,182,0.2),transparent_65%)]" />

              <div className="relative flex flex-col gap-6 lg:flex-row lg:justify-between">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <h4 className="text-2xl font-semibold text-white">
                      {request.title}
                    </h4>
                    <span
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-900 ${
                        badgeStyles[request.status] ||
                        "bg-white text-slate-900 border-white/60"
                      }`}
                    >
                      {STATUS_LABELS[request.status] || request.status}
                    </span>
                    <span
                      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-wide text-slate-900 ${
                        urgencyStyles[request.urgency] ||
                        "bg-white text-slate-900 border-white/60"
                      }`}
                    >
                      {request.urgency} urgency
                    </span>
                  </div>

                  <p className="max-w-2xl text-sm text-white/70">
                    {request.description}
                  </p>

                  <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                      <dt className="text-xs font-semibold uppercase tracking-wide text-white/60">
                        Blood group
                      </dt>
                      <dd className="text-lg font-semibold text-white">
                        {request.blood_group}
                      </dd>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                      <dt className="text-xs font-semibold uppercase tracking-wide text-white/60">
                        Units needed
                      </dt>
                      <dd className="text-lg font-semibold text-white">
                        {request.units_required}
                      </dd>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                      <dt className="text-xs font-semibold uppercase tracking-wide text-white/60">
                        Contact
                      </dt>
                      <dd className="text-sm font-medium text-white">
                        {request.contact_phone}
                      </dd>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                      <dt className="text-xs font-semibold uppercase tracking-wide text-white/60">
                        Location
                      </dt>
                      <dd className="text-sm font-medium text-white">
                        {request.address}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="flex flex-col gap-3 lg:min-w-48">
                  <Button
                    variant="ghost"
                    className="w-full gap-2 rounded-full border border-white/20 bg-white/10 text-white transition hover:border-white/30 hover:bg-white/15"
                    onClick={() =>
                      router.push(`/recipient/blood-requests/edit/${request.id}`)
                    }
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full gap-2 rounded-full border border-rose-400/40 bg-rose-500/10 text-rose-100 transition hover:bg-rose-500/20 hover:text-white"
                    onClick={() => setDeleteTarget(request)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent className="border-white/10 bg-slate-950/95 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete blood request</AlertDialogTitle>
            <AlertDialogDescription className="text-white/70">
              This action cannot be undone. The request will be permanently removed from the platform and donors will no longer see it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting} className="rounded-full border border-white/20 bg-white/10 text-white hover:bg-white/15">
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
