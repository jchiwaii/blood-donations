"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, Loader2, Mail, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";

import { getApprovedBloodRequests } from "@/server-actions/blood-reqests";
import { IBloodRequest } from "@/interfaces";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ApprovedBloodRequestsProps {
  initialRequests?: IBloodRequest[];
}

const urgencyStyling: Record<string, string> = {
  low: "border-emerald-300 bg-emerald-100 text-emerald-800",
  medium: "border-amber-300 bg-amber-100 text-amber-800",
  high: "border-orange-300 bg-orange-100 text-orange-800",
  critical: "border-rose-300 bg-rose-100 text-rose-800",
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
        toast.error(response.message || "Failed to load approved requests");
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
        .some((value) => value.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesUrgency = urgencyFilter === "all" || request.urgency === urgencyFilter;

      return matchesSearch && matchesUrgency;
    });
  }, [requests, searchTerm, urgencyFilter]);

  if (loading) {
    return (
      <div className="rounded-3xl border border-border/70 bg-card/80 py-20 text-center shadow-sm">
        <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Loading approved requests...
        </div>
      </div>
    );
  }

  return (
    <section className="space-y-5">
      <div className="rounded-3xl border border-border/70 bg-card/80 p-6 shadow-sm">
        <h3 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
          Donation opportunities
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          View approved requests and offer support where your blood group is needed.
        </p>

        <div className="mt-5 grid gap-3 md:grid-cols-[1.8fr_1fr]">
          <Input
            placeholder="Search by blood group, location, or contact"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="h-11 rounded-xl border-border/80 bg-background/70"
          />

          <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
            <SelectTrigger className="h-11 w-full rounded-xl border-border/80 bg-background/70">
              <SelectValue placeholder="Filter by urgency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All urgency levels</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredRequests.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-card/65 py-16 text-center">
          <p className="text-sm text-muted-foreground">No approved requests match this filter.</p>
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
                        urgencyStyling[request.urgency] ||
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
                      <dd className="text-sm font-semibold text-foreground">
                        {request.blood_group}
                      </dd>
                    </div>
                    <div className="rounded-2xl border border-border/70 bg-background/70 p-3">
                      <dt className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                        Units needed
                      </dt>
                      <dd className="text-sm font-semibold text-foreground">
                        {request.units_required}
                      </dd>
                    </div>
                    <div className="rounded-2xl border border-border/70 bg-background/70 p-3">
                      <dt className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                        Recipient
                      </dt>
                      <dd className="text-sm font-semibold text-foreground">
                        {(request as any).recipient?.name || "Confidential"}
                      </dd>
                    </div>
                    <div className="rounded-2xl border border-border/70 bg-background/70 p-3">
                      <dt className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                        Posted
                      </dt>
                      <dd className="text-sm font-semibold text-foreground">
                        {request.created_at
                          ? new Date(request.created_at).toLocaleDateString()
                          : "Recently"}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="flex w-full flex-col gap-3 lg:max-w-xs">
                  <Button
                    className="w-full rounded-xl"
                    onClick={() => router.push(`/donor/blood-requests/${request.id}`)}
                  >
                    <Heart className="size-4" />
                    Offer donation
                  </Button>

                  <div className="rounded-2xl border border-border/70 bg-background/70 p-4 text-sm">
                    <p className="font-medium text-foreground">Contact information</p>
                    <div className="mt-3 space-y-2 text-muted-foreground">
                      <a
                        href={`tel:${request.contact_phone}`}
                        className="inline-flex items-center gap-2 hover:text-foreground"
                      >
                        <Phone className="size-4 text-primary" />
                        {request.contact_phone}
                      </a>
                      <a
                        href={`mailto:${request.contact_email}`}
                        className="inline-flex items-center gap-2 hover:text-foreground"
                      >
                        <Mail className="size-4 text-primary" />
                        {request.contact_email}
                      </a>
                      <p className="inline-flex items-start gap-2">
                        <MapPin className="mt-0.5 size-4 text-primary" />
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
