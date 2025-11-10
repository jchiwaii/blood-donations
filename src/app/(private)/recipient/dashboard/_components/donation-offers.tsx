"use client";

import { useEffect, useState } from "react";
import { getDonationsForRequest } from "@/server-actions/blood-donations";
import { IBloodDonation } from "@/interfaces";
import {
  User,
  Heart,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Loader2,
} from "lucide-react";
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

export default function DonationOffers({
  requestId,
  requestTitle,
}: DonationOffersProps) {
  const [donations, setDonations] = useState<DonationWithDonor[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchDonations();
    }
  }, [isOpen, requestId]);

  const fetchDonations = async () => {
    setLoading(true);
    const response = await getDonationsForRequest(requestId);
    if (response.success && response.data) {
      setDonations(response.data as DonationWithDonor[]);
    }
    setLoading(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="w-full gap-2 rounded-full border border-blue-400/40 bg-blue-500/10 text-blue-100 transition hover:bg-blue-500/20 hover:text-white"
        >
          <Heart className="h-4 w-4" />
          View Donation Offers
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-full max-w-2xl overflow-y-auto border-l border-white/10 bg-slate-950/95 text-white sm:max-w-2xl"
      >
        <SheetHeader className="mb-6 text-left">
          <SheetTitle className="text-xl font-semibold text-white">
            Donation Offers
          </SheetTitle>
          <p className="text-sm text-white/60">{requestTitle}</p>
        </SheetHeader>

        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-12">
            <Loader2 className="size-5 animate-spin text-white" />
            <span className="text-sm text-white/70">Loading offers...</span>
          </div>
        ) : donations.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-white/20 bg-white/5 py-12 text-center">
            <div className="rounded-full bg-blue-500/10 p-3 text-blue-200">
              <Heart className="h-6 w-6" />
            </div>
            <p className="font-semibold text-white">No offers yet</p>
            <p className="max-w-md text-sm text-white/60">
              When donors offer to help with this request, they will appear
              here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {donations.map((donation) => (
              <div
                key={donation.id}
                className="relative overflow-hidden rounded-2xl border border-white/15 bg-white/5 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.4)] backdrop-blur transition hover:border-white/25"
              >
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.15),transparent_65%)]" />

                <div className="relative space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex size-12 items-center justify-center rounded-xl bg-blue-500/20 text-blue-200">
                        <User className="size-6" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">
                          {donation.donor?.name || "Anonymous Donor"}
                        </h4>
                        <p className="text-xs text-white/60">
                          {donation.donor?.email || "Email not provided"}
                        </p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-300">
                      <Heart className="size-3" />
                      Committed
                    </span>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-white/10 bg-white/10 p-3">
                      <p className="text-xs uppercase tracking-wider text-white/60">
                        Units Offered
                      </p>
                      <p className="mt-1 text-lg font-semibold text-white">
                        {donation.units_available} units
                      </p>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/10 p-3">
                      <p className="text-xs uppercase tracking-wider text-white/60">
                        Blood Group
                      </p>
                      <p className="mt-1 text-lg font-semibold text-white">
                        {donation.blood_group}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 rounded-xl border border-white/10 bg-white/5 p-4 text-sm">
                    <p className="font-semibold text-white">
                      Contact Information
                    </p>
                    <div className="space-y-2 text-white/80">
                      <a
                        href={`tel:${donation.contact_phone}`}
                        className="flex items-center gap-2 transition hover:text-white"
                      >
                        <Phone className="size-4" />
                        {donation.contact_phone}
                      </a>
                      <a
                        href={`mailto:${donation.contact_email}`}
                        className="flex items-center gap-2 transition hover:text-white"
                      >
                        <Mail className="size-4" />
                        {donation.contact_email}
                      </a>
                      <div className="flex items-start gap-2">
                        <MapPin className="mt-0.5 size-4" />
                        <span>{donation.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="size-4" />
                        <span>
                          Available:{" "}
                          {new Date(
                            donation.availability_date
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {donation.notes && (
                    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wider text-white/60">
                        Notes from Donor
                      </p>
                      <p className="mt-2 text-sm text-white/80">
                        {donation.notes}
                      </p>
                    </div>
                  )}

                  {donation.medical_info && (
                    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wider text-white/60">
                        Medical Information
                      </p>
                      <p className="mt-2 text-sm text-white/80">
                        {donation.medical_info}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
