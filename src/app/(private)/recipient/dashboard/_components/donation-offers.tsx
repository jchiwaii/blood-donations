"use client";

import { useEffect, useState } from "react";
import { Calendar, Heart, Loader2, Mail, MapPin, Phone, User } from "lucide-react";

import { getDonationsForRequest } from "@/server-actions/blood-donations";
import { IBloodDonation } from "@/interfaces";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface DonationOffersProps {
  requestId: number;
  requestTitle: string;
}

type DonationWithDonor = IBloodDonation & {
  donor?: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
};

export default function DonationOffers({ requestId, requestTitle }: DonationOffersProps) {
  const [donations, setDonations] = useState<DonationWithDonor[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const fetchDonations = async () => {
      setLoading(true);
      const response = await getDonationsForRequest(requestId);
      if (response.success && response.data) {
        setDonations(response.data as DonationWithDonor[]);
      }
      setLoading(false);
    };

    fetchDonations();
  }, [isOpen, requestId]);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="w-full rounded-xl border-primary/30 text-primary hover:bg-primary/10">
          <Heart className="size-4" />
          View donation offers
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-full max-w-2xl overflow-y-auto">
        <SheetHeader className="text-left">
          <SheetTitle className="font-heading text-2xl font-semibold tracking-tight text-foreground">
            Donation offers
          </SheetTitle>
          <p className="text-sm text-muted-foreground">{requestTitle}</p>
        </SheetHeader>

        <div className="mt-6">
          {loading ? (
            <div className="py-12 text-center">
              <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                Loading offers...
              </span>
            </div>
          ) : donations.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-card/70 py-12 text-center">
              <p className="font-medium text-foreground">No offers yet</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Donor offers for this request will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {donations.map((donation) => (
                <article
                  key={donation.id}
                  className="rounded-2xl border border-border/70 bg-card/80 p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <User className="size-4" />
                      </span>
                      <div>
                        <p className="font-medium text-foreground">
                          {donation.donor?.name || "Anonymous donor"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {donation.donor?.email || "Email not provided"}
                        </p>
                      </div>
                    </div>
                    <span className="rounded-full border border-emerald-300 bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-emerald-800">
                      Committed
                    </span>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-border/70 bg-background/70 p-3">
                      <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                        Units offered
                      </p>
                      <p className="text-sm font-semibold text-foreground">{donation.units_available} units</p>
                    </div>
                    <div className="rounded-xl border border-border/70 bg-background/70 p-3">
                      <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                        Blood group
                      </p>
                      <p className="text-sm font-semibold text-foreground">{donation.blood_group}</p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2 rounded-xl border border-border/70 bg-background/70 p-3 text-sm text-muted-foreground">
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
                    <p className="inline-flex items-center gap-2">
                      <Calendar className="size-4 text-primary" />
                      Available on {new Date(donation.availability_date).toLocaleDateString()}
                    </p>
                  </div>

                  {donation.notes ? (
                    <div className="mt-3 rounded-xl border border-border/70 bg-background/70 p-3">
                      <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Notes</p>
                      <p className="mt-1 text-sm text-foreground">{donation.notes}</p>
                    </div>
                  ) : null}

                  {donation.medical_info ? (
                    <div className="mt-3 rounded-xl border border-border/70 bg-background/70 p-3">
                      <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                        Medical info
                      </p>
                      <p className="mt-1 text-sm text-foreground">{donation.medical_info}</p>
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
