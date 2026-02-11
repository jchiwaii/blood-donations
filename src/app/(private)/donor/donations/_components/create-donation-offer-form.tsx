"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { createBloodDonation } from "@/server-actions/blood-donations";
import { IBloodDonation } from "@/interfaces";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CreateDonationOfferFormProps {
  userId: number;
}

export default function CreateDonationOfferForm({ userId }: CreateDonationOfferFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<Partial<IBloodDonation>>({
    defaultValues: {
      donor_id: userId,
      blood_group: "",
      units_available: 1,
      availability_date: "",
      contact_phone: "",
      contact_email: "",
      address: "",
      medical_info: "",
      notes: "",
    },
  });

  const bloodGroup = watch("blood_group");

  const onSubmit = async (data: Partial<IBloodDonation>) => {
    try {
      setIsSubmitting(true);
      const response = await createBloodDonation({ ...data, donor_id: userId });

      if (response.success) {
        toast.success("Donation offer created", {
          description: "Your offer is pending admin review.",
        });
        router.push("/donor/donations");
      } else {
        toast.error("Failed to create offer", {
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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5 rounded-3xl border border-border/70 bg-card/80 p-6 shadow-sm sm:p-8"
    >
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="blood_group">Blood group</Label>
          <Select value={bloodGroup} onValueChange={(value) => setValue("blood_group", value)}>
            <SelectTrigger className="h-11 w-full rounded-xl">
              <SelectValue placeholder="Select blood group" />
            </SelectTrigger>
            <SelectContent>
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                <SelectItem key={bg} value={bg}>
                  {bg}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.blood_group ? <p className="text-xs text-destructive">{errors.blood_group.message}</p> : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="units_available">Units available</Label>
          <Input
            id="units_available"
            type="number"
            min="1"
            className="h-11 rounded-xl"
            {...register("units_available", {
              required: "Units available is required",
              min: { value: 1, message: "Must be at least 1 unit" },
            })}
          />
          {errors.units_available ? (
            <p className="text-xs text-destructive">{errors.units_available.message}</p>
          ) : null}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="availability_date">Availability date</Label>
        <Input
          id="availability_date"
          type="date"
          min={new Date().toISOString().split("T")[0]}
          className="h-11 rounded-xl"
          {...register("availability_date", { required: "Availability date is required" })}
        />
        {errors.availability_date ? (
          <p className="text-xs text-destructive">{errors.availability_date.message}</p>
        ) : null}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contact_phone">Contact phone</Label>
          <Input
            id="contact_phone"
            type="tel"
            className="h-11 rounded-xl"
            {...register("contact_phone", { required: "Contact phone is required" })}
          />
          {errors.contact_phone ? (
            <p className="text-xs text-destructive">{errors.contact_phone.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact_email">Contact email</Label>
          <Input
            id="contact_email"
            type="email"
            className="h-11 rounded-xl"
            {...register("contact_email", {
              required: "Contact email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
          />
          {errors.contact_email ? (
            <p className="text-xs text-destructive">{errors.contact_email.message}</p>
          ) : null}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address or location</Label>
        <Input
          id="address"
          className="h-11 rounded-xl"
          {...register("address", { required: "Address is required" })}
        />
        {errors.address ? <p className="text-xs text-destructive">{errors.address.message}</p> : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="medical_info">Medical information</Label>
        <textarea
          id="medical_info"
          rows={3}
          placeholder="Any relevant information (optional)"
          className="w-full rounded-xl border border-border bg-background/70 p-3 text-sm"
          {...register("medical_info")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Additional notes</Label>
        <textarea
          id="notes"
          rows={3}
          placeholder="Any extra notes (optional)"
          className="w-full rounded-xl border border-border bg-background/70 p-3 text-sm"
          {...register("notes")}
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button type="submit" disabled={isSubmitting} className="w-full rounded-xl sm:w-auto">
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Creating...
            </>
          ) : (
            "Create donation offer"
          )}
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="w-full rounded-xl sm:w-auto"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
