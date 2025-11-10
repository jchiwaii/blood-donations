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
  critical: "bg-rose-200 text-rose-900 border-rose-300",
  high: "bg-orange-200 text-orange-900 border-orange-300",
  medium: "bg-amber-200 text-amber-900 border-amber-300",
  low: "bg-emerald-200 text-emerald-900 border-emerald-300",
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
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 py-24 text-white shadow-[0_20px_60px_rgba(15,23,42,0.45)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.22),transparent_65%)]" />
        <div className="relative z-10 flex flex-col items-center gap-3 text-sm text-white/70">
          <Loader2 className="size-5 animate-spin text-white" />
          <span>Loading approved requests…</span>
        </div>
      </div>
    );
  }

  return (
    <section className="space-y-6 text-white">
      <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.4)] backdrop-blur">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-white">
            Opportunities to donate
          </h3>
          <p className="text-sm text-white/70">
            Browse urgent requests, reach out to recipients, and confirm your
            availability.
          </p>
        </div>
      </div>

      <div className="grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.35)] backdrop-blur md:grid-cols-[minmax(0,1.8fr)_minmax(0,1fr)]">
        <Input
          placeholder="Search by blood group, location, or contact"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className="h-12 rounded-xl border-white/10 bg-slate-900/60 text-sm text-white placeholder:text-white/50"
        />
        <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
          <SelectTrigger className="h-12 rounded-xl border-white/10 bg-slate-900/60 text-white">
            <SelectValue placeholder="Filter by urgency" />
          </SelectTrigger>
          <SelectContent className="border-white/10 bg-slate-900 text-white">
            <SelectItem
              value="all"
              className="text-white focus:bg-blue-500/20 focus:text-white"
            >
              All urgency levels
            </SelectItem>
            <SelectItem
              value="critical"
              className="text-white focus:bg-blue-500/20 focus:text-white"
            >
              Critical
            </SelectItem>
            <SelectItem
              value="high"
              className="text-white focus:bg-blue-500/20 focus:text-white"
            >
              High
            </SelectItem>
            <SelectItem
              value="medium"
              className="text-white focus:bg-blue-500/20 focus:text-white"
            >
              Medium
            </SelectItem>
            <SelectItem
              value="low"
              className="text-white focus:bg-blue-500/20 focus:text-white"
            >
              Low
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredRequests.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-white/20 bg-white/5 py-24 text-center">
          <div className="rounded-full bg-blue-500/10 p-3 text-blue-200">
            <Heart className="h-6 w-6" />
          </div>
          <p className="text-lg font-semibold text-white">
            No approved requests right now
          </p>
          <p className="max-w-md text-sm text-white/70">
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
              className="relative overflow-hidden rounded-3xl border border-white/15 bg-white/5 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.4)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_25px_70px_rgba(59,130,246,0.2)]"
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.2),transparent_65%)]" />

              <div className="relative flex flex-col gap-6 lg:flex-row lg:justify-between">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <h4 className="text-2xl font-semibold text-white">
                      {request.title}
                    </h4>
                    <span
                      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-900 ${
                        urgencyStyling[request.urgency] ||
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
                        Recipient
                      </dt>
                      <dd className="text-sm font-medium text-white">
                        {(request as any).recipient?.name || "Confidential"}
                      </dd>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                      <dt className="text-xs font-semibold uppercase tracking-wide text-white/60">
                        Posted
                      </dt>
                      <dd className="text-sm font-medium text-white">
                        {request.created_at
                          ? new Date(request.created_at).toLocaleDateString()
                          : "Recently"}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="flex flex-col gap-3 lg:min-w-48">
                  <Button
                    className="w-full gap-2 rounded-full bg-linear-to-r from-blue-500 via-indigo-500 to-rose-500 text-white shadow-lg shadow-blue-500/20 transition hover:scale-[1.01]"
                    onClick={() =>
                      router.push(`/donor/blood-requests/${request.id}`)
                    }
                  >
                    <Heart className="h-4 w-4" />
                    Offer donation
                  </Button>
                  <div className="rounded-2xl border border-white/10 bg-white/10 p-4 text-sm text-white/80">
                    <p className="font-semibold text-white">
                      Contact information
                    </p>
                    <div className="mt-3 space-y-2">
                      <a
                        href={`tel:${request.contact_phone}`}
                        className="flex items-center gap-2 text-white/80 transition hover:text-white"
                      >
                        <Phone className="h-4 w-4" />
                        {request.contact_phone}
                      </a>
                      <a
                        href={`mailto:${request.contact_email}`}
                        className="flex items-center gap-2 text-white/80 transition hover:text-white"
                      >
                        <Mail className="h-4 w-4" />
                        {request.contact_email}
                      </a>
                      <p className="flex items-start gap-2 text-white/80">
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
