"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Heart, Loader2, Mail, MapPin, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IBloodRequest } from "@/interfaces";
import { getApprovedBloodRequests } from "@/server-actions/blood-reqests";

interface ApprovedBloodRequestsProps {
  initialRequests?: IBloodRequest[];
}

const urgencyStyling: Record<string, string> = {
  critical: "bg-rose-100 text-rose-900 border-rose-200",
  high: "bg-orange-100 text-orange-900 border-orange-200",
  medium: "bg-amber-100 text-amber-900 border-amber-200",
  low: "bg-emerald-100 text-emerald-900 border-emerald-200",
};

export default function ApprovedBloodRequests({
  initialRequests = [],
}: ApprovedBloodRequestsProps) {
  const router = useRouter();
  const [requests, setRequests] = useState<IBloodRequest[]>(initialRequests);
  const [loading, setLoading] = useState(initialRequests.length === 0);
  const [searchTerm, setSearchTerm] = useState("");
  const [urgencyFilter, setUrgencyFilter] = useState("all");

  useEffect(() => {
    let isMounted = true;

    const fetchRequests = async () => {
      setLoading(true);
      const response = await getApprovedBloodRequests();

      if (!isMounted) return;

      if (response.success && Array.isArray(response.data)) {
        setRequests(response.data);
      } else if (!response.success) {
        toast.error(response.message || "Failed to load blood requests");
        setRequests([]);
      }

      setLoading(false);
    };

    fetchRequests();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const matchesSearch = [
        request.title,
        request.blood_group,
        request.address,
        request.contact_phone,
      ]
        .filter(Boolean)
        .some((value) =>
          value.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesUrgency =
        urgencyFilter === "all" || request.urgency === urgencyFilter;

      return matchesSearch && matchesUrgency;
    });
  }, [requests, searchTerm, urgencyFilter]);

  if (loading) {
    return (
      <div className="flex items-center justify-center rounded-2xl border border-border/60 bg-card/60 py-24">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading approved requests...</span>
        </div>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-card/70 p-5 shadow-lg shadow-primary/5 backdrop-blur-sm md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h3 className="text-xl font-semibold text-foreground">
            Opportunities to Donate
          </h3>
          <p className="text-sm text-muted-foreground">
            Browse urgent requests, reach out to recipients, and confirm your
            availability.
          </p>
        </div>
      </div>

      <div className="grid gap-4 rounded-2xl border border-border/60 bg-card/60 p-5 shadow-lg shadow-primary/5 backdrop-blur-sm md:grid-cols-[2fr,1fr]">
        <Input
          placeholder="Search by blood group, location, or contact"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className="bg-background/80"
        />
        <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
          <SelectTrigger className="bg-background/80">
            <SelectValue placeholder="Filter by urgency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All urgency levels</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredRequests.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border/70 bg-card/50 py-24 text-center">
          <div className="rounded-full bg-primary/10 p-3 text-primary">
            <Heart className="h-6 w-6" />
          </div>
          <p className="text-lg font-semibold text-foreground">
            No approved requests right now
          </p>
          <p className="max-w-md text-sm text-muted-foreground">
            All donation requests that are approved by the medical team will
            appear here. Check back soon or enable notifications to stay
            updated.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredRequests.map((request) => (
            <article
              key={request.id}
              className="relative overflow-hidden rounded-2xl border border-border/70 bg-linear-to-br from-background/90 to-background/70 p-6 shadow-lg shadow-primary/5 transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.08),transparent_60%)]" />

              <div className="relative flex flex-col gap-6 lg:flex-row lg:justify-between">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <h4 className="text-2xl font-semibold text-foreground">
                      {request.title}
                    </h4>
                    <span
                      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                        urgencyStyling[request.urgency] ||
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
                        Recipient
                      </dt>
                      <dd className="text-sm font-medium text-foreground">
                        {(request as any).recipient?.name || "Confidential"}
                      </dd>
                    </div>
                    <div className="rounded-xl bg-background/80 p-4">
                      <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Posted
                      </dt>
                      <dd className="text-sm font-medium text-foreground">
                        {request.created_at
                          ? new Date(request.created_at).toLocaleDateString()
                          : "Recently"}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="flex flex-col gap-3 lg:min-w-40">
                  <Button
                    className="w-full gap-2"
                    onClick={() =>
                      router.push(`/donor/blood-requests/${request.id}`)
                    }
                  >
                    <Heart className="h-4 w-4" />
                    Offer Donation
                  </Button>
                  <div className="rounded-2xl border border-border/60 bg-background/60 p-4 text-sm text-muted-foreground">
                    <p className="font-semibold text-foreground">
                      Contact Information
                    </p>
                    <div className="mt-3 space-y-2">
                      <a
                        href={`tel:${request.contact_phone}`}
                        className="flex items-center gap-2 transition-colors hover:text-primary"
                      >
                        <Phone className="h-4 w-4" />
                        {request.contact_phone}
                      </a>
                      <a
                        href={`mailto:${request.contact_email}`}
                        className="flex items-center gap-2 transition-colors hover:text-primary"
                      >
                        <Mail className="h-4 w-4" />
                        {request.contact_email}
                      </a>
                      <p className="flex items-start gap-2">
                        <MapPin className="mt-0.5 h-4 w-4" />
                        <span>{request.address}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
