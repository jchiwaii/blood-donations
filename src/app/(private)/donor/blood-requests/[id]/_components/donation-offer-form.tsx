"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Calendar, Droplet, Heart, Loader2, MapPin, User } from "lucide-react";
import { toast } from "sonner";

import { createBloodDonation } from "@/server-actions/blood-donations";
import { IBloodRequest } from "@/interfaces";
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

export default function DonationOfferForm({ request, donorId }: DonationOfferFormProps) {
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
        status: "committed",
      });

      if (response.success) {
        toast.success("Donation offer submitted", {
          description: "Your offer has been sent to the recipient.",
        });

        setTimeout(() => {
          router.push("/donor/donations");
          router.refresh();
        }, 400);
      } else {
        toast.error("Failed to submit offer", {
          description: response.message,
        });
      }
    } catch (error) {
      toast.error("Something went wrong", {
        description: "Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      <section className="rounded-3xl border border-border/70 bg-card/80 p-6 shadow-sm">
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
                {request.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {request.description}
              </p>
            </div>
            <span className="rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-primary">
              {request.urgency}
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-border/70 bg-background/70 p-3">
              <p className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.12em] text-muted-foreground">
                <Droplet className="size-3.5 text-primary" />
                Blood group
              </p>
              <p className="mt-1 text-sm font-semibold text-foreground">{request.blood_group}</p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-background/70 p-3">
              <p className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.12em] text-muted-foreground">
                <Droplet className="size-3.5 text-primary" />
                Units needed
              </p>
              <p className="mt-1 text-sm font-semibold text-foreground">{request.units_required}</p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-background/70 p-3">
              <p className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.12em] text-muted-foreground">
                <User className="size-3.5 text-primary" />
                Recipient
              </p>
              <p className="mt-1 text-sm font-semibold text-foreground">
                {request.recipient?.name || "Confidential"}
              </p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-background/70 p-3">
              <p className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.12em] text-muted-foreground">
                <MapPin className="size-3.5 text-primary" />
                Location
              </p>
              <p className="mt-1 text-sm font-semibold text-foreground">{request.address}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-border/70 bg-card/80 p-6 shadow-sm">
        <h3 className="font-heading text-xl font-semibold tracking-tight text-foreground">
          Donation offer details
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Share your availability and contact details to complete the offer.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <FormField
                control={form.control}
                name="units_available"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Units available</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        max="10"
                        disabled={isSubmitting}
                        className="h-11 rounded-xl"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 0)}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="availability_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Availability date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        disabled={isSubmitting}
                        min={new Date().toISOString().split("T")[0]}
                        className="h-11 rounded-xl"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contact_phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact phone</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        disabled={isSubmitting}
                        className="h-11 rounded-xl"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contact_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        disabled={isSubmitting}
                        className="h-11 rounded-xl"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="City, state, or full address"
                      disabled={isSubmitting}
                      className="h-11 rounded-xl"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="medical_info"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Medical information (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any relevant medical information"
                      disabled={isSubmitting}
                      className="min-h-24 rounded-xl"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional notes (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Anything else you'd like to share"
                      disabled={isSubmitting}
                      className="min-h-24 rounded-xl"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
                className="w-full rounded-xl"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="w-full rounded-xl">
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Heart className="size-4" />
                    Submit donation offer
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </section>
    </div>
  );
}
