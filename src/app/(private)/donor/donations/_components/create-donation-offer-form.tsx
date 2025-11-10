"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
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
import { createBloodDonation } from "@/server-actions/blood-donations";
import { IBloodDonation } from "@/interfaces";
import { Loader2 } from "lucide-react";

interface CreateDonationOfferFormProps {
  userId: number;
}

export default function CreateDonationOfferForm({
  userId,
}: CreateDonationOfferFormProps) {
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

      const payload = {
        ...data,
        donor_id: userId,
      };

      const response = await createBloodDonation(payload);

      if (response.success) {
        toast.success("Donation offer created!", {
          description: "Your offer is pending admin approval.",
        });
        router.push("/donor/donations");
      } else {
        toast.error("Failed to create offer", {
          description: response.message,
        });
      }
    } catch (error) {
      toast.error("An error occurred", {
        description: "Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur lg:p-8"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="blood_group" className="text-white">
            Blood Group <span className="text-rose-400">*</span>
          </Label>
          <Select
            value={bloodGroup}
            onValueChange={(value) => setValue("blood_group", value)}
          >
            <SelectTrigger className="h-12 rounded-xl border-white/10 bg-slate-900/60 text-white">
              <SelectValue placeholder="Select blood group" />
            </SelectTrigger>
            <SelectContent className="border-white/10 bg-slate-900 text-white">
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
          {errors.blood_group && (
            <p className="text-sm text-rose-400">{errors.blood_group.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="units_available" className="text-white">
            Units Available <span className="text-rose-400">*</span>
          </Label>
          <Input
            id="units_available"
            type="number"
            min="1"
            {...register("units_available", {
              required: "Units available is required",
              min: { value: 1, message: "Must be at least 1 unit" },
            })}
            className="h-12 rounded-xl border-white/10 bg-slate-900/60 text-white"
          />
          {errors.units_available && (
            <p className="text-sm text-rose-400">
              {errors.units_available.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="availability_date" className="text-white">
          Availability Date <span className="text-rose-400">*</span>
        </Label>
        <Input
          id="availability_date"
          type="date"
          {...register("availability_date", {
            required: "Availability date is required",
          })}
          min={new Date().toISOString().split("T")[0]}
          className="h-12 rounded-xl border-white/10 bg-slate-900/60 text-white"
        />
        {errors.availability_date && (
          <p className="text-sm text-rose-400">
            {errors.availability_date.message}
          </p>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contact_phone" className="text-white">
            Contact Phone <span className="text-rose-400">*</span>
          </Label>
          <Input
            id="contact_phone"
            type="tel"
            {...register("contact_phone", {
              required: "Contact phone is required",
            })}
            className="h-12 rounded-xl border-white/10 bg-slate-900/60 text-white"
          />
          {errors.contact_phone && (
            <p className="text-sm text-rose-400">
              {errors.contact_phone.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact_email" className="text-white">
            Contact Email <span className="text-rose-400">*</span>
          </Label>
          <Input
            id="contact_email"
            type="email"
            {...register("contact_email", {
              required: "Contact email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
            className="h-12 rounded-xl border-white/10 bg-slate-900/60 text-white"
          />
          {errors.contact_email && (
            <p className="text-sm text-rose-400">
              {errors.contact_email.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address" className="text-white">
          Address / Location <span className="text-rose-400">*</span>
        </Label>
        <Input
          id="address"
          {...register("address", {
            required: "Address is required",
          })}
          className="h-12 rounded-xl border-white/10 bg-slate-900/60 text-white"
        />
        {errors.address && (
          <p className="text-sm text-rose-400">{errors.address.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="medical_info" className="text-white">
          Medical Information
        </Label>
        <textarea
          id="medical_info"
          {...register("medical_info")}
          rows={3}
          placeholder="Any relevant medical information (optional)"
          className="w-full rounded-xl border border-white/10 bg-slate-900/60 p-3 text-white placeholder:text-white/50"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes" className="text-white">
          Additional Notes
        </Label>
        <textarea
          id="notes"
          {...register("notes")}
          rows={3}
          placeholder="Any additional notes or instructions (optional)"
          className="w-full rounded-xl border border-white/10 bg-slate-900/60 p-3 text-white placeholder:text-white/50"
        />
      </div>

      <div className="flex items-center gap-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="gap-2 rounded-xl bg-linear-to-r from-rose-500 via-fuchsia-500 to-indigo-500 px-6"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Creating...
            </>
          ) : (
            "Create Donation Offer"
          )}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.back()}
          className="rounded-xl border border-white/20 bg-white/10 text-white hover:bg-white/15"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
