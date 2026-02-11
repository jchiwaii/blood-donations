"use client";

import React from "react";
import {
  AlertCircle,
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
  getAllBloodRequestsForAdmin,
  updateBloodRequestStatus,
} from "@/server-actions/blood-reqests";
import { IBloodRequest } from "@/interfaces";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type BloodRequestWithRecipient = IBloodRequest & {
  recipient: {
    id: number;
    name: string;
    email: string;
  };
};

const filters = ["all", "pending", "approved", "rejected"] as const;

const BloodRequestsManagement = () => {
  const [requests, setRequests] = React.useState<BloodRequestWithRecipient[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [updatingId, setUpdatingId] = React.useState<number | null>(null);
  const [filter, setFilter] = React.useState<(typeof filters)[number]>("all");
  const [searchTerm, setSearchTerm] = React.useState("");

  const fetchRequests = async () => {
    setLoading(true);
    const response = await getAllBloodRequestsForAdmin();
    if (response.success && response.data) {
      setRequests(response.data as BloodRequestWithRecipient[]);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    fetchRequests();
  }, []);

  const handleStatusUpdate = async (
    id: number,
    status: "approved" | "rejected" | "pending"
  ) => {
    setUpdatingId(id);
    const response = await updateBloodRequestStatus(id, { status });

    if (response.success) {
      toast.success(`Request marked ${status}`);
      fetchRequests();
    } else {
      toast.error("Failed to update request status");
    }
    setUpdatingId(null);
  };

  const filteredRequests = requests.filter((req) => {
    const matchesStatus = filter === "all" || req.status === filter;
    const matchesSearch =
      searchTerm === "" ||
      req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.blood_group.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.recipient?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.recipient?.email.toLowerCase().includes(searchTerm.toLowerCase());

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

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case "low":
        return "border-emerald-300 bg-emerald-100 text-emerald-800";
      case "medium":
        return "border-amber-300 bg-amber-100 text-amber-800";
      case "high":
        return "border-orange-300 bg-orange-100 text-orange-800";
      case "critical":
        return "border-rose-300 bg-rose-100 text-rose-800";
      default:
        return "border-border bg-secondary text-secondary-foreground";
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="h-48 animate-pulse rounded-2xl border border-border/70 bg-card/70"
          />
        ))}
      </div>
    );
  }

  return (
    <section className="space-y-5">
      <div className="rounded-3xl border border-border/70 bg-card/80 p-6 shadow-sm">
        <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
          Blood Requests Management
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Review incoming requests, set status, and confirm urgency data.
        </p>

        <div className="mt-5 grid gap-3 md:grid-cols-[1.6fr_1fr]">
          <Input
            placeholder="Search by title, blood group, recipient name or email"
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
      </div>

      {filteredRequests.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-card/65 p-12 text-center text-sm text-muted-foreground">
          No blood requests found for this filter.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <article
              key={request.id}
              className="rounded-3xl border border-border/70 bg-card/80 p-6 shadow-sm"
            >
              <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-2">
                  <h3 className="font-heading text-xl font-semibold tracking-tight text-foreground">
                    {request.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em]",
                        getStatusBadge(request.status)
                      )}
                    >
                      {request.status === "pending" ? (
                        <Clock className="size-3.5" />
                      ) : request.status === "approved" ? (
                        <CheckCircle className="size-3.5" />
                      ) : (
                        <XCircle className="size-3.5" />
                      )}
                      {request.status}
                    </span>

                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em]",
                        getUrgencyBadge(request.urgency)
                      )}
                    >
                      <AlertCircle className="size-3.5" />
                      {request.urgency}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {request.status !== "approved" ? (
                    <Button
                      size="sm"
                      onClick={() => handleStatusUpdate(request.id, "approved")}
                      disabled={updatingId === request.id}
                      className="rounded-lg"
                    >
                      <CheckCircle className="size-4" />
                      Approve
                    </Button>
                  ) : null}

                  {request.status !== "rejected" ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusUpdate(request.id, "rejected")}
                      disabled={updatingId === request.id}
                      className="rounded-lg border-rose-300 text-rose-700 hover:bg-rose-50"
                    >
                      <XCircle className="size-4" />
                      Reject
                    </Button>
                  ) : null}

                  {request.status !== "pending" ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusUpdate(request.id, "pending")}
                      disabled={updatingId === request.id}
                      className="rounded-lg border-amber-300 text-amber-700 hover:bg-amber-50"
                    >
                      <Clock className="size-4" />
                      Set pending
                    </Button>
                  ) : null}
                </div>
              </div>

              <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
                {request.description}
              </p>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-2xl border border-border/70 bg-background/70 p-3">
                  <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                    Blood Group
                  </p>
                  <p className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-foreground">
                    <Droplet className="size-4 text-primary" />
                    {request.blood_group}
                  </p>
                </div>

                <div className="rounded-2xl border border-border/70 bg-background/70 p-3">
                  <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                    Units Required
                  </p>
                  <p className="mt-1 text-sm font-medium text-foreground">
                    {request.units_required} units
                  </p>
                </div>

                <div className="rounded-2xl border border-border/70 bg-background/70 p-3">
                  <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                    Recipient
                  </p>
                  <p className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-foreground">
                    <User className="size-4 text-primary" />
                    {request.recipient?.name || "Unknown"}
                  </p>
                </div>

                <div className="rounded-2xl border border-border/70 bg-background/70 p-3">
                  <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                    Phone
                  </p>
                  <p className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-foreground">
                    <Phone className="size-4 text-primary" />
                    {request.contact_phone}
                  </p>
                </div>

                <div className="rounded-2xl border border-border/70 bg-background/70 p-3">
                  <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                    Email
                  </p>
                  <p className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-foreground">
                    <Mail className="size-4 text-primary" />
                    {request.contact_email}
                  </p>
                </div>

                <div className="rounded-2xl border border-border/70 bg-background/70 p-3">
                  <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                    Address
                  </p>
                  <p className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-foreground">
                    <MapPin className="size-4 text-primary" />
                    {request.address}
                  </p>
                </div>
              </div>

              {request.created_at ? (
                <p className="mt-4 inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="size-3.5" />
                  Created {new Date(request.created_at).toLocaleDateString()}
                </p>
              ) : null}
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default BloodRequestsManagement;
