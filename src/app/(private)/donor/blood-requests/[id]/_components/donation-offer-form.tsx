"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import {
  Calendar,
  Droplet,
  Heart,
  Loader2,
  MapPin,
  Phone,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { createBloodDonation } from "@/server-actions/blood-donations";
import { IBloodRequest } from "@/interfaces";

const donationOfferSchema = z.object({
  units_available: z
    .number()
    .min(1, "At least 1 unit required")
    .max(10, "Maximum 10 units allowed"),
  availability_date: z.string().min(1, "Availability date is required"),
  contact_phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^[0-9+\-\s()]+$/, "Invalid phone number format"),
  contact_email: z.string().email("Invalid email address"),
  address: z.string().min(10, "Address must be at least 10 characters"),
  medical_info: z.string().optional(),
  notes: z.string().optional(),
});

type DonationOfferFormValues = z.infer<typeof donationOfferSchema>;

interface DonationOfferFormProps {
  request: IBloodRequest & { recipient?: { name: string; email: string } };
  donorId: number;
}

export default function DonationOfferForm({
  request,
  donorId,
}: DonationOfferFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<DonationOfferFormValues>({
    resolver: zodResolver(donationOfferSchema),
    defaultValues: {
      units_available: 1,
      availability_date: "",
      contact_phone: "",
      contact_email: "",
      address: "",
      medical_info: "",
      notes: "",
    },
  });

  const onSubmit = async (data: DonationOfferFormValues) => {
    setIsSubmitting(true);

    try {
      const response = await createBloodDonation({
        donor_id: donorId,
        request_id: request.id,
        blood_group: request.blood_group,
        units_available: data.units_available,
        availability_date: data.availability_date,
        contact_phone: data.contact_phone,
        contact_email: data.contact_email,
        address: data.address,
        medical_info: data.medical_info,
        notes: data.notes,
        status: "committed", // Set as committed when offering for a specific request
      });

      if (response.success) {
        toast.success("Donation offer submitted!", {
          description: "Your offer has been sent to the recipient.",
          duration: 3000,
        });

        setTimeout(() => {
          router.push("/donor/donations");
          router.refresh();
        }, 500);
      } else {
        toast.error("Failed to submit offer", {
          description: response.message,
          duration: 5000,
        });
      }
    } catch (error) {
      toast.error("An error occurred", {
        description: "Please try again later.",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Request Details Card */}
      <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-white/5 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.4)] backdrop-blur">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.2),transparent_65%)]" />

        <div className="relative space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-white">
                {request.title}
              </h2>
              <p className="text-sm text-white/70">
                {request.description}
              </p>
            </div>
            <span
              className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                request.urgency === "critical"
                  ? "border-rose-300 bg-rose-200 text-rose-900"
                  : request.urgency === "high"
                  ? "border-orange-300 bg-orange-200 text-orange-900"
                  : request.urgency === "medium"
                  ? "border-amber-300 bg-amber-200 text-amber-900"
                  : "border-emerald-300 bg-emerald-200 text-emerald-900"
              }`}
            >
              {request.urgency} urgency
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-white/60">
                <Droplet className="size-4" />
                Blood group
              </div>
              <div className="mt-1 text-lg font-semibold text-white">
                {request.blood_group}
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-white/60">
                <Droplet className="size-4" />
                Units needed
              </div>
              <div className="mt-1 text-lg font-semibold text-white">
                {request.units_required}
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-white/60">
                <User className="size-4" />
                Recipient
              </div>
              <div className="mt-1 text-sm font-medium text-white">
                {request.recipient?.name || "Confidential"}
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-white/60">
                <MapPin className="size-4" />
                Location
              </div>
              <div className="mt-1 text-sm font-medium text-white">
                {request.address}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Donation Offer Form */}
      <div className="rounded-3xl border border-white/15 bg-white/5 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.4)] backdrop-blur">
        <div className="mb-6 space-y-2">
          <h3 className="text-xl font-semibold text-white">
            Offer your donation
          </h3>
          <p className="text-sm text-white/70">
            Fill in your details to offer a donation for this request
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="units_available"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-white/90">
                      Units you can donate
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        max="10"
                        disabled={isSubmitting}
                        className="h-12 rounded-xl border-white/10 bg-slate-900/60 text-white placeholder:text-white/50"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-rose-200" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="availability_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-white/90">
                      When can you donate?
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        disabled={isSubmitting}
                        min={new Date().toISOString().split("T")[0]}
                        className="h-12 rounded-xl border-white/10 bg-slate-900/60 text-white placeholder:text-white/50"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-rose-200" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contact_phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-white/90">
                      Contact phone
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        disabled={isSubmitting}
                        className="h-12 rounded-xl border-white/10 bg-slate-900/60 text-white placeholder:text-white/50"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-rose-200" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contact_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-white/90">
                      Contact email
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        disabled={isSubmitting}
                        className="h-12 rounded-xl border-white/10 bg-slate-900/60 text-white placeholder:text-white/50"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-rose-200" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-white/90">
                    Your location
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="City, State or full address"
                      disabled={isSubmitting}
                      className="h-12 rounded-xl border-white/10 bg-slate-900/60 text-white placeholder:text-white/50"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-rose-200" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="medical_info"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-white/90">
                    Medical information (optional)
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any relevant medical information..."
                      disabled={isSubmitting}
                      className="min-h-24 rounded-xl border-white/10 bg-slate-900/60 text-white placeholder:text-white/50"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-rose-200" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-white/90">
                    Additional notes (optional)
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any additional information you'd like to share..."
                      disabled={isSubmitting}
                      className="min-h-24 rounded-xl border-white/10 bg-slate-900/60 text-white placeholder:text-white/50"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-rose-200" />
                </FormItem>
              )}
            />

            <div className="flex gap-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.back()}
                disabled={isSubmitting}
                className="w-full rounded-full border border-white/20 bg-white/10 text-white hover:bg-white/15"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full gap-2 rounded-full bg-linear-to-r from-rose-500 via-fuchsia-500 to-indigo-500 text-white shadow-lg shadow-rose-500/20 transition hover:scale-[1.01]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Heart className="size-4" />
                    Submit Donation Offer
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
