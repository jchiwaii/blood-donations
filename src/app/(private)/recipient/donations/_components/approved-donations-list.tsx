"use client";

import { useEffect, useMemo, useState } from "react";
import { Heart, Loader2, Mail, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";

import { getApprovedDonations } from "@/server-actions/blood-donations";
import { IBloodDonation } from "@/interfaces";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
        toast.error(response.message || "Failed to load approved donations");
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
        .some((value) => value.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesBloodGroup =
        bloodGroupFilter === "all" || donation.blood_group === bloodGroupFilter;

      return matchesSearch && matchesBloodGroup;
    });
  }, [donations, searchTerm, bloodGroupFilter]);

  const handleRequestDonation = () => {
    toast.success("Request sent", {
      description: "The donor will be notified.",
    });
  };

  if (loading) {
    return (
      <div className="rounded-3xl border border-border/70 bg-card/80 py-20 text-center shadow-sm">
        <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Loading available donations...
        </div>
      </div>
    );
  }

  return (
    <section className="space-y-5">
      <div className="rounded-3xl border border-border/70 bg-card/80 p-6 shadow-sm">
        <h3 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
          Approved donor offers
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Search offers by blood group, location, or donor profile.
        </p>

        <div className="mt-5 grid gap-3 md:grid-cols-[1.8fr_1fr]">
          <Input
            placeholder="Search by blood group, location, or donor"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="h-11 rounded-xl border-border/80 bg-background/70"
          />

          <Select value={bloodGroupFilter} onValueChange={setBloodGroupFilter}>
            <SelectTrigger className="h-11 w-full rounded-xl border-border/80 bg-background/70">
              <SelectValue placeholder="Filter by blood group" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All blood groups</SelectItem>
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                <SelectItem key={bg} value={bg}>
                  {bg}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredDonations.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-card/65 py-16 text-center">
          <p className="text-sm text-muted-foreground">No approved donations available right now.</p>
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
                  <h4 className="font-heading text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                    {donation.blood_group} Blood Available
                  </h4>

                  {donation.notes ? (
                    <p className="max-w-3xl text-sm text-muted-foreground">{donation.notes}</p>
                  ) : null}

                  <dl className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-2xl border border-border/70 bg-background/70 p-3">
                      <dt className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Blood group</dt>
                      <dd className="text-sm font-semibold text-foreground">{donation.blood_group}</dd>
                    </div>
                    <div className="rounded-2xl border border-border/70 bg-background/70 p-3">
                      <dt className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Units available</dt>
                      <dd className="text-sm font-semibold text-foreground">{donation.units_available}</dd>
                    </div>
                    <div className="rounded-2xl border border-border/70 bg-background/70 p-3">
                      <dt className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Donor</dt>
                      <dd className="text-sm font-semibold text-foreground">{donation.donor?.name || "Anonymous"}</dd>
                    </div>
                    <div className="rounded-2xl border border-border/70 bg-background/70 p-3">
                      <dt className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Available</dt>
                      <dd className="text-sm font-semibold text-foreground">
                        {new Date(donation.availability_date).toLocaleDateString()}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="flex w-full flex-col gap-3 lg:max-w-xs">
                  <Button className="w-full rounded-xl" onClick={() => handleRequestDonation()}>
                    <Heart className="size-4" />
                    Request donation
                  </Button>

                  <div className="space-y-2 rounded-2xl border border-border/70 bg-background/70 p-4 text-sm text-muted-foreground">
                    <a href={`tel:${donation.contact_phone}`} className="inline-flex items-center gap-2 hover:text-foreground">
                      <Phone className="size-4 text-primary" />
                      {donation.contact_phone}
                    </a>
                    <a href={`mailto:${donation.contact_email}`} className="inline-flex items-center gap-2 hover:text-foreground">
                      <Mail className="size-4 text-primary" />
                      {donation.contact_email}
                    </a>
                    <p className="inline-flex items-start gap-2">
                      <MapPin className="mt-0.5 size-4 text-primary" />
                      {donation.address}
                    </p>
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
