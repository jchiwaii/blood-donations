"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  createBloodDonation,
  updateBloodDonation,
} from "@/server-actions/blood-donations";
import { currentUser } from "@/server-actions/users";
import { IBloodDonation } from "@/interfaces";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const donationResponseSchema = z.object({
  blood_group: z.string().min(1, "Blood group is required"),
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

type DonationResponseFormData = z.infer<typeof donationResponseSchema>;

interface DonationResponseFormProps {
  editData?: Partial<IBloodDonation>;
  requestId?: number;
  onSuccess?: () => void;
}

export default function DonationResponseForm({
  editData,
  requestId,
  onSuccess,
}: DonationResponseFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [unitsAvailableFocused, setUnitsAvailableFocused] = useState(false);
  const [availabilityDateFocused, setAvailabilityDateFocused] = useState(false);
  const [contactPhoneFocused, setContactPhoneFocused] = useState(false);
  const [contactEmailFocused, setContactEmailFocused] = useState(false);
  const [addressFocused, setAddressFocused] = useState(false);
  const [medicalInfoFocused, setMedicalInfoFocused] = useState(false);
  const [notesFocused, setNotesFocused] = useState(false);
  const router = useRouter();

  const isEditMode = !!editData?.id;

  const form = useForm<DonationResponseFormData>({
    resolver: zodResolver(donationResponseSchema),
    defaultValues: {
      blood_group: editData?.blood_group || "",
      units_available: editData?.units_available || 1,
      availability_date: editData?.availability_date || "",
      contact_phone: editData?.contact_phone || "",
      contact_email: editData?.contact_email || "",
      address: editData?.address || "",
      medical_info: editData?.medical_info || "",
      notes: editData?.notes || "",
    },
  });

  useEffect(() => {
    if (editData) {
      form.reset({
        blood_group: editData.blood_group || "",
        units_available: editData.units_available || 1,
        availability_date: editData.availability_date || "",
        contact_phone: editData.contact_phone || "",
        contact_email: editData.contact_email || "",
        address: editData.address || "",
        medical_info: editData.medical_info || "",
        notes: editData.notes || "",
      });
    }
  }, [editData, form]);

  const onSubmit = async (data: DonationResponseFormData) => {
    setIsLoading(true);
    try {
      if (isEditMode && editData?.id) {
        // Update existing donation
        const response = await updateBloodDonation(editData.id, {
          blood_group: data.blood_group,
          units_available: data.units_available,
          availability_date: data.availability_date,
          contact_phone: data.contact_phone,
          contact_email: data.contact_email,
          address: data.address,
          medical_info: data.medical_info,
          notes: data.notes,
        });

        if (response.success) {
          toast.success("Donation updated successfully!");
          if (onSuccess) {
            onSuccess();
          } else {
            router.refresh();
          }
        } else {
          toast.error(response.message || "Failed to update donation.");
        }
      } else {
        // Create new donation
        const user = await currentUser();

        if (!user) {
          toast.error("You must be logged in to submit a donation response.");
          return;
        }

        const response = await createBloodDonation({
          donor_id: user.id,
          request_id: requestId,
          blood_group: data.blood_group,
          units_available: data.units_available,
          availability_date: data.availability_date,
          contact_phone: data.contact_phone,
          contact_email: data.contact_email,
          address: data.address,
          medical_info: data.medical_info,
          notes: data.notes,
          status: "available",
        });

        if (response.success) {
          toast.success("Donation response submitted successfully!");
          form.reset();
          if (onSuccess) {
            onSuccess();
          } else {
            router.refresh();
          }
        } else {
          toast.error(
            response.message || "Failed to submit donation response."
          );
        }
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="blood_group"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">
                  Blood Group
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isLoading}
                >
                  <FormControl>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select blood group" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {BLOOD_GROUPS.map((group) => (
                      <SelectItem key={group} value={group}>
                        {group}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="units_available"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">
                  Units Available
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={unitsAvailableFocused ? "" : "1"}
                    disabled={isLoading}
                    className="h-11"
                    min={1}
                    max={10}
                    onFocus={() => setUnitsAvailableFocused(true)}
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value) || 0)
                    }
                    onBlur={() => {
                      setUnitsAvailableFocused(false);
                      field.onBlur();
                    }}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="availability_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">
                Availability Date
              </FormLabel>
              <FormControl>
                <Input
                  type="date"
                  disabled={isLoading}
                  className="h-11"
                  onFocus={() => setAvailabilityDateFocused(true)}
                  {...field}
                  onBlur={() => {
                    setAvailabilityDateFocused(false);
                    field.onBlur();
                  }}
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="contact_phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">
                  Contact Phone
                </FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    placeholder={contactPhoneFocused ? "" : "+1 (555) 123-4567"}
                    disabled={isLoading}
                    className="h-11"
                    onFocus={() => setContactPhoneFocused(true)}
                    {...field}
                    onBlur={() => {
                      setContactPhoneFocused(false);
                      field.onBlur();
                    }}
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
                <FormLabel className="text-sm font-medium">
                  Contact Email
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder={contactEmailFocused ? "" : "donor@example.com"}
                    disabled={isLoading}
                    className="h-11"
                    onFocus={() => setContactEmailFocused(true)}
                    {...field}
                    onBlur={() => {
                      setContactEmailFocused(false);
                      field.onBlur();
                    }}
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
              <FormLabel className="text-sm font-medium">
                Your Address
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder={
                    addressFocused
                      ? ""
                      : "Enter your address for coordination..."
                  }
                  disabled={isLoading}
                  className="min-h-20 resize-none"
                  onFocus={() => setAddressFocused(true)}
                  {...field}
                  onBlur={() => {
                    setAddressFocused(false);
                    field.onBlur();
                  }}
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
              <FormLabel className="text-sm font-medium">
                Medical Information (Optional)
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder={
                    medicalInfoFocused
                      ? ""
                      : "Any relevant medical information, recent tests, etc..."
                  }
                  disabled={isLoading}
                  className="min-h-20 resize-none"
                  onFocus={() => setMedicalInfoFocused(true)}
                  {...field}
                  onBlur={() => {
                    setMedicalInfoFocused(false);
                    field.onBlur();
                  }}
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
              <FormLabel className="text-sm font-medium">
                Additional Notes (Optional)
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder={
                    notesFocused
                      ? ""
                      : "Any additional information or special conditions..."
                  }
                  disabled={isLoading}
                  className="min-h-20 resize-none"
                  onFocus={() => setNotesFocused(true)}
                  {...field}
                  onBlur={() => {
                    setNotesFocused(false);
                    field.onBlur();
                  }}
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-11 text-base font-medium"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEditMode ? "Updating Donation..." : "Submitting Response..."}
            </>
          ) : isEditMode ? (
            "Update Donation"
          ) : (
            "Submit Donation Response"
          )}
        </Button>
      </form>
    </Form>
  );
}
