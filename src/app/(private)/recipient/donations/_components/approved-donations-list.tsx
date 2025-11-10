"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Heart, Loader2, Mail, MapPin, Phone, Calendar } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IBloodDonation } from "@/interfaces";
import { getApprovedDonations } from "@/server-actions/blood-donations";

interface ApprovedDonationsListProps {
  initialDonations?: IBloodDonation[];
}

export default function ApprovedDonationsList({
  initialDonations = [],
}: ApprovedDonationsListProps) {
  const [donations, setDonations] = useState<any[]>(initialDonations);
  const [loading, setLoading] = useState(initialDonations.length === 0);
  const [searchTerm, setSearchTerm] = useState("");
  const [bloodGroupFilter, setBloodGroupFilter] = useState("all");

  useEffect(() => {
    let isMounted = true;

    const fetchDonations = async () => {
      setLoading(true);
      const response = await getApprovedDonations();

      if (!isMounted) return;

      if (response.success && Array.isArray(response.data)) {
        setDonations(response.data);
      } else if (!response.success) {
        toast.error(response.message || "Failed to load donations");
        setDonations([]);
      }

      setLoading(false);
    };

    fetchDonations();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredDonations = useMemo(() => {
    return donations.filter((donation) => {
      const matchesSearch = [
        donation.blood_group,
        donation.address,
        donation.contact_phone,
        donation.donor?.name,
      ]
        .filter(Boolean)
        .some((value) =>
          value.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesBloodGroup =
        bloodGroupFilter === "all" || donation.blood_group === bloodGroupFilter;

      return matchesSearch && matchesBloodGroup;
    });
  }, [donations, searchTerm, bloodGroupFilter]);

  const handleRequestDonation = (donationId: number) => {
    toast.success("Request sent!", {
      description: "The donor will be notified of your request.",
    });
  };

  if (loading) {
    return (
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 py-24 text-white shadow-[0_20px_60px_rgba(15,23,42,0.45)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(244,114,182,0.22),transparent_65%)]" />
        <div className="relative z-10 flex flex-col items-center gap-3 text-sm text-white/70">
          <Loader2 className="size-5 animate-spin text-white" />
          <span>Loading available donations…</span>
        </div>
      </div>
    );
  }

  return (
    <section className="space-y-6 text-white">
      <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.4)] backdrop-blur">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-white">
            Available Donation Offers
          </h3>
          <p className="text-sm text-white/70">
            Browse approved donations from donors ready to help
          </p>
        </div>
      </div>

      <div className="grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.35)] backdrop-blur md:grid-cols-[2fr,1fr]">
        <Input
          placeholder="Search by blood group, location, or donor"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className="h-12 rounded-xl border-white/10 bg-slate-900/60 text-sm text-white placeholder:text-white/50"
        />
        <Select value={bloodGroupFilter} onValueChange={setBloodGroupFilter}>
          <SelectTrigger className="h-12 rounded-xl border-white/10 bg-slate-900/60 text-white">
            <SelectValue placeholder="Filter by blood group" />
          </SelectTrigger>
          <SelectContent className="border-white/10 bg-slate-900 text-white">
            <SelectItem
              value="all"
              className="text-white focus:bg-rose-500/20 focus:text-white"
            >
              All blood groups
            </SelectItem>
            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
              <SelectItem
                key={bg}
                value={bg}
                className="text-white focus:bg-rose-500/20 focus:text-white"
              >
                {bg}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredDonations.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-white/20 bg-white/5 py-24 text-center">
          <div className="rounded-full bg-rose-500/10 p-3 text-rose-200">
            <Heart className="h-6 w-6" />
          </div>
          <p className="text-lg font-semibold text-white">
            No donations available right now
          </p>
          <p className="max-w-md text-sm text-white/70">
            Approved donation offers will appear here. Check back soon or enable
            notifications to stay updated.
          </p>
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
                      {donation.blood_group} Blood Available
                    </h4>
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
                        Donor
                      </dt>
                      <dd className="text-sm font-medium text-white">
                        {donation.donor?.name || "Anonymous"}
                      </dd>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                      <dt className="text-xs font-semibold uppercase tracking-wide text-white/60">
                        Available
                      </dt>
                      <dd className="text-sm font-medium text-white">
                        {new Date(donation.availability_date).toLocaleDateString()}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="flex flex-col gap-3 lg:min-w-48">
                  <Button
                    className="w-full gap-2 rounded-full bg-linear-to-r from-rose-500 via-fuchsia-500 to-indigo-500 text-white shadow-lg shadow-rose-500/20 transition hover:scale-[1.01]"
                    onClick={() => handleRequestDonation(donation.id)}
                  >
                    <Heart className="h-4 w-4" />
                    Request Donation
                  </Button>
                  <div className="rounded-2xl border border-white/10 bg-white/10 p-4 text-sm text-white/80">
                    <p className="font-semibold text-white">
                      Contact information
                    </p>
                    <div className="mt-3 space-y-2">
                      <a
                        href={`tel:${donation.contact_phone}`}
                        className="flex items-center gap-2 text-white/80 transition hover:text-white"
                      >
                        <Phone className="h-4 w-4" />
                        {donation.contact_phone}
                      </a>
                      <a
                        href={`mailto:${donation.contact_email}`}
                        className="flex items-center gap-2 text-white/80 transition hover:text-white"
                      >
                        <Mail className="h-4 w-4" />
                        {donation.contact_email}
                      </a>
                      <p className="flex items-start gap-2 text-white/80">
                        <MapPin className="mt-0.5 h-4 w-4" />
                        <span>{donation.address}</span>
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
