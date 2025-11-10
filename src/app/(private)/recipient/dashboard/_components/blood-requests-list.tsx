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
  pending: "bg-amber-100 text-amber-900 border-amber-200",
  approved: "bg-sky-100 text-sky-900 border-sky-200",
  fulfilled: "bg-emerald-100 text-emerald-900 border-emerald-200",
  cancelled: "bg-rose-100 text-rose-900 border-rose-200",
  in_progress: "bg-purple-100 text-purple-900 border-purple-200",
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
      <div className="flex items-center justify-center rounded-2xl border border-border/60 bg-card/60 py-24">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading blood requests...</span>
        </div>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-card/70 p-5 shadow-lg shadow-primary/5 backdrop-blur-sm md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h3 className="text-xl font-semibold text-foreground">
            Manage Blood Requests
          </h3>
          <p className="text-sm text-muted-foreground">
            Keep track of every request, update their status, or submit a new
            one in seconds.
          </p>
        </div>
        <Button
          onClick={() => router.push("/recipient/blood-requests")}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Request
        </Button>
      </div>

      <div className="grid gap-4 rounded-2xl border border-border/60 bg-card/60 p-5 shadow-lg shadow-primary/5 backdrop-blur-sm md:grid-cols-[2fr,1fr]">
        <Input
          placeholder="Search by title, blood group, or contact"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className="bg-background/80"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="bg-background/80">
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

      {filteredRequests.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border/70 bg-card/50 py-24 text-center">
          <div className="rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
            No blood requests yet
          </div>
          <p className="max-w-md text-sm text-muted-foreground">
            When you create a request, it will appear here. Monitor its status
            and keep donors updated in real time.
          </p>
          <Button
            variant="outline"
            onClick={() => router.push("/recipient/blood-requests")}
            className="gap-2"
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
              className="relative overflow-hidden rounded-2xl border border-border/70 bg-linear-to-br from-background/90 to-background/70 p-6 shadow-lg shadow-primary/5 transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(239,68,68,0.08),transparent_60%)]" />

              <div className="relative flex flex-col gap-6 lg:flex-row lg:justify-between">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <h4 className="text-2xl font-semibold text-foreground">
                      {request.title}
                    </h4>
                    <span
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                        badgeStyles[request.status] ||
                        "bg-slate-100 text-slate-900 border-slate-200"
                      }`}
                    >
                      {STATUS_LABELS[request.status] || request.status}
                    </span>
                    <span
                      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-wide ${
                        urgencyStyles[request.urgency] ||
                        "bg-slate-100 text-slate-900 border-slate-200"
                      }`}
                    >
                      {request.urgency} urgency
                    </span>
                  </div>

                  <p className="max-w-2xl text-sm text-muted-foreground">
                    {request.description}
                  </p>

                  <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-xl bg-background/80 p-4">
                      <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Blood Group
                      </dt>
                      <dd className="text-lg font-semibold text-foreground">
                        {request.blood_group}
                      </dd>
                    </div>
                    <div className="rounded-xl bg-background/80 p-4">
                      <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Units Needed
                      </dt>
                      <dd className="text-lg font-semibold text-foreground">
                        {request.units_required}
                      </dd>
                    </div>
                    <div className="rounded-xl bg-background/80 p-4">
                      <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Contact
                      </dt>
                      <dd className="text-sm font-medium text-foreground">
                        {request.contact_phone}
                      </dd>
                    </div>
                    <div className="rounded-xl bg-background/80 p-4">
                      <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Location
                      </dt>
                      <dd className="text-sm font-medium text-foreground">
                        {request.address}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="flex flex-col gap-3 lg:min-w-40">
                  <Button
                    variant="outline"
                    className="w-full gap-2"
                    onClick={() =>
                      router.push(
                        `/recipient/blood-requests/edit/${request.id}`
                      )
                    }
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full gap-2 text-destructive hover:text-destructive"
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

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={() => setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete blood request</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The request will be permanently
              removed from the platform and donors will no longer see it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
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
