"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { LucideIcon } from "lucide-react";
import {
  Clock,
  Droplets,
  Loader2,
  MapPin,
  ShieldCheck,
  UploadCloud,
} from "lucide-react";
import { toast } from "sonner";

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
  createBloodRequest,
  updateBloodRequest,
} from "@/server-actions/blood-reqests";
import { currentUser } from "@/server-actions/users";
import { uploadMultipleMedia } from "@/server-actions/media";
import { IBloodRequest } from "@/interfaces";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const URGENCY_LEVELS = ["Low", "Medium", "High", "Critical"];

type HighlightCard = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const overviewHighlights: HighlightCard[] = [
  {
    icon: Droplets,
    title: "Blood group match",
    description: "We prioritise donors that align with the group you choose.",
  },
  {
    icon: Clock,
    title: "Urgency aware",
    description:
      "Critical cases are boosted across donor dashboards instantly.",
  },
  {
    icon: ShieldCheck,
    title: "Trusted requests",
    description: "Attach proofs so volunteers feel confident responding.",
  },
];

const bloodRequestSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  blood_group: z.string().min(1, "Blood group is required"),
  units_required: z
    .number()
    .min(1, "At least 1 unit required")
    .max(10, "Maximum 10 units allowed"),
  urgency: z.string().min(1, "Urgency level is required"),
  contact_phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^[0-9+\-\s()]+$/, "Invalid phone number format"),
  contact_email: z.string().email("Invalid email address"),
  address: z.string().min(10, "Address must be at least 10 characters"),
  proofs: z.any().optional(), // File upload field
});

type BloodRequestFormData = z.infer<typeof bloodRequestSchema>;

interface CreateRequestFormProps {
  editData?: Partial<IBloodRequest>;
  onSuccess?: () => void;
}

export default function CreateRequestForm({
  editData,
  onSuccess,
}: CreateRequestFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const router = useRouter();

  const isEditMode = !!editData?.id;

  const form = useForm<BloodRequestFormData>({
    resolver: zodResolver(bloodRequestSchema),
    defaultValues: {
      title: editData?.title || "",
      description: editData?.description || "",
      blood_group: editData?.blood_group || "",
      units_required: editData?.units_required || 1,
      urgency: editData?.urgency || "",
      contact_phone: editData?.contact_phone || "",
      contact_email: editData?.contact_email || "",
      address: editData?.address || "",
      proofs: undefined,
    },
  });

  useEffect(() => {
    if (editData) {
      form.reset({
        title: editData.title || "",
        description: editData.description || "",
        blood_group: editData.blood_group || "",
        units_required: editData.units_required || 1,
        urgency: editData.urgency || "",
        contact_phone: editData.contact_phone || "",
        contact_email: editData.contact_email || "",
        address: editData.address || "",
        proofs: undefined,
      });
    }
  }, [editData, form]);

  const onSubmit = async (data: BloodRequestFormData) => {
    setIsLoading(true);
    try {
      if (isEditMode && editData?.id) {
        // Update existing request
        const response = await updateBloodRequest(editData.id, {
          title: data.title,
          description: data.description,
          blood_group: data.blood_group,
          units_required: data.units_required,
          urgency: data.urgency,
          contact_phone: data.contact_phone,
          contact_email: data.contact_email,
          address: data.address,
        });

        if (response.success) {
          // Upload new files if any were selected
          if (uploadedFiles.length > 0) {
            // Convert Files to base64 for serialization
            const filesDataPromises = uploadedFiles.map(async (file) => {
              const arrayBuffer = await file.arrayBuffer();
              const buffer = Buffer.from(arrayBuffer);
              return {
                buffer: buffer.toString("base64"),
                fileName: file.name,
                fileType: file.type,
              };
            });

            const filesData = await Promise.all(filesDataPromises);

            const uploadResponse = await uploadMultipleMedia(
              filesData,
              "blood_request",
              editData.id
            );

            if (!uploadResponse.success) {
              toast.warning("Request updated but some files failed to upload");
            }
          }

          toast.success("Blood request updated successfully!");
          setUploadedFiles([]);

          // Redirect to dashboard
          if (onSuccess) {
            onSuccess();
          } else {
            router.push("/recipient/dashboard");
          }
        } else {
          toast.error(response.message || "Failed to update blood request.");
        }
      } else {
        // Create new request
        const user = await currentUser();

        if (!user) {
          toast.error("You must be logged in to create a request.");
          return;
        }

        const response = await createBloodRequest({
          recipient_id: user.id,
          title: data.title,
          description: data.description,
          blood_group: data.blood_group,
          units_required: data.units_required,
          urgency: data.urgency,
          contact_phone: data.contact_phone,
          contact_email: data.contact_email,
          address: data.address,
          status: "pending",
        });

        if (response.success) {
          // Upload files if any were selected
          if (uploadedFiles.length > 0 && response.data?.id) {
            // Convert Files to base64 for serialization
            const filesDataPromises = uploadedFiles.map(async (file) => {
              const arrayBuffer = await file.arrayBuffer();
              const buffer = Buffer.from(arrayBuffer);
              return {
                buffer: buffer.toString("base64"),
                fileName: file.name,
                fileType: file.type,
              };
            });

            const filesData = await Promise.all(filesDataPromises);

            const uploadResponse = await uploadMultipleMedia(
              filesData,
              "blood_request",
              response.data.id
            );

            if (!uploadResponse.success) {
              toast.warning("Request created but some files failed to upload");
            }
          }

          toast.success("Blood request created successfully!");
          form.reset();
          setUploadedFiles([]);

          // Redirect to dashboard
          if (onSuccess) {
            onSuccess();
          } else {
            router.push("/recipient/dashboard");
          }
        } else {
          const errorMessage = response.error
            ? `${response.message}: ${response.error}`
            : response.message || "Failed to create blood request.";
          toast.error(errorMessage);
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
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950/70 p-8 shadow-[0_16px_80px_rgba(15,23,42,0.6)] transition duration-300 sm:p-10"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-80"
          style={{
            background:
              "radial-gradient(120% 120% at 20% 0%, rgba(244,114,182,0.4) 0%, rgba(79,70,229,0.35) 45%, rgba(15,23,42,0.95) 100%)",
          }}
        />

        <div className="relative z-10 space-y-10">
          <header className="space-y-6">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                Guided form
              </span>
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-white sm:text-3xl">
                  Request overview
                </h2>
                <p className="max-w-2xl text-sm text-white/75 sm:text-base">
                  Complete each section so we can flag your request to nearby
                  donors and prioritise urgent cases.
                </p>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              {overviewHighlights.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="flex gap-3 rounded-2xl border border-white/10 bg-white/10 p-3 text-sm text-white/80 backdrop-blur"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white">
                    <Icon className="size-5" />
                  </span>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-white">{title}</p>
                    <p className="text-xs leading-relaxed text-white/70">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </header>

          <section className="rounded-2xl border border-white/10 bg-slate-950/60 p-6 backdrop-blur sm:p-8">
            <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Medical need
                </h3>
                <p className="text-sm text-white/70">
                  Explain what is happening so volunteers understand the urgency
                  and context.
                </p>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium uppercase text-white/70">
                Step 1
              </span>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="text-sm font-semibold text-white">
                      Request title
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Urgent: O+ units needed for surgery"
                        disabled={isLoading}
                        className="h-12 rounded-xl border-white/10 bg-slate-900/60 text-base text-white placeholder:text-white/50 focus-visible:ring-rose-400/60"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-rose-200" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="blood_group"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-white">
                      Blood group
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger className="h-12 rounded-xl border-white/10 bg-slate-900/60 text-white">
                          <SelectValue placeholder="Select blood group" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="border-white/10 bg-slate-900 text-white">
                        {BLOOD_GROUPS.map((group) => (
                          <SelectItem
                            key={group}
                            value={group}
                            className="text-white focus:bg-rose-500/20 focus:text-white"
                          >
                            {group}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs text-rose-200" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="urgency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-white">
                      Urgency level
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger className="h-12 rounded-xl border-white/10 bg-slate-900/60 text-white">
                          <SelectValue placeholder="Select urgency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="border-white/10 bg-slate-900 text-white">
                        {URGENCY_LEVELS.map((level) => (
                          <SelectItem
                            key={level}
                            value={level.toLowerCase()}
                            className="text-white capitalize focus:bg-rose-500/20 focus:text-white"
                          >
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs text-rose-200" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="units_required"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-white">
                      Units required
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="2"
                        disabled={isLoading}
                        className="h-12 rounded-xl border-white/10 bg-slate-900/60 text-base text-white placeholder:text-white/50 focus-visible:ring-rose-400/60"
                        min={1}
                        max={10}
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value, 10) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-rose-200" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="text-sm font-semibold text-white">
                      Detailed description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Provide the medical background, patient status, and any timing constraints."
                        disabled={isLoading}
                        className="min-h-32 rounded-xl border-white/10 bg-slate-900/60 text-base text-white placeholder:text-white/50 focus-visible:ring-rose-400/60"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-rose-200" />
                  </FormItem>
                )}
              />
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-slate-950/60 p-6 backdrop-blur sm:p-8">
            <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Contact & logistics
                </h3>
                <p className="text-sm text-white/70">
                  Share how donors or hospitals should coordinate with you for
                  the transfusion.
                </p>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium uppercase text-white/70">
                Step 2
              </span>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="contact_phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-sm font-semibold text-white">
                      <span>Primary phone</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        disabled={isLoading}
                        className="h-12 rounded-xl border-white/10 bg-slate-900/60 text-base text-white placeholder:text-white/50 focus-visible:ring-rose-400/60"
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
                    <FormLabel className="text-sm font-semibold text-white">
                      Contact email
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="coordinator@hospital.org"
                        disabled={isLoading}
                        className="h-12 rounded-xl border-white/10 bg-slate-900/60 text-base text-white placeholder:text-white/50 focus-visible:ring-rose-400/60"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-rose-200" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="flex items-center gap-2 text-sm font-semibold text-white">
                      <MapPin className="size-4" />
                      <span>Hospital or collection point</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Provide the full address, ward, and any check-in instructions for donors."
                        disabled={isLoading}
                        className="min-h-28 rounded-xl border-white/10 bg-slate-900/60 text-base text-white placeholder:text-white/50 focus-visible:ring-rose-400/60"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-rose-200" />
                  </FormItem>
                )}
              />
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-slate-950/60 p-6 backdrop-blur sm:p-8">
            <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Supporting documents
                </h3>
                <p className="text-sm text-white/70">
                  Upload prescriptions, hospital letters, or lab reports to
                  verify the need (images only).
                </p>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium uppercase text-white/70">
                Optional
              </span>
            </div>

            <FormField
              control={form.control}
              name="proofs"
              render={({ field: { onChange, value, ...field } }) => (
                <FormItem>
                  <FormControl>
                    <div className="space-y-4">
                      <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-dashed border-white/20 bg-white/5 px-4 py-6 transition hover:border-rose-300/60 hover:bg-white/10">
                        <div className="flex items-center gap-3 text-left text-sm text-white/80">
                          <span className="flex size-11 items-center justify-center rounded-xl bg-white/10 text-white">
                            <UploadCloud className="size-5" />
                          </span>
                          <div className="space-y-1">
                            <p className="font-medium text-white">
                              Drag & drop or click to upload
                            </p>
                            <p className="text-xs text-white/60">
                              Accepted formats: JPG, PNG. Maximum 10MB per file.
                            </p>
                          </div>
                        </div>
                        <Input
                          type="file"
                          accept="image/*"
                          multiple
                          disabled={isLoading}
                          className="hidden"
                          onChange={(e) => {
                            const files = Array.from(e.target.files || []);
                            setUploadedFiles(files);
                            onChange(files);
                          }}
                          {...field}
                        />
                      </label>

                      {uploadedFiles.length > 0 && (
                        <div className="space-y-2 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/80">
                          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/60">
                            Selected files
                          </p>
                          <ul className="space-y-1 text-xs text-white/70">
                            {uploadedFiles.map((file, index) => (
                              <li key={`${file.name}-${index}`}>{file.name}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs text-rose-200" />
                </FormItem>
              )}
            />
          </section>

          <div className="space-y-4">
            <p className="text-xs text-white/60">
              By submitting, you confirm the information is accurate and consent
              to being contacted by verified donors.
            </p>
            <Button
              type="submit"
              disabled={isLoading}
              className="h-12 w-full rounded-xl bg-linear-to-r from-rose-500 via-fuchsia-500 to-indigo-500 text-base font-semibold text-white shadow-lg shadow-rose-500/20 transition hover:scale-[1.01] focus-visible:ring-rose-400/60"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 size-5 animate-spin" />
                  {isEditMode ? "Updating request..." : "Creating request..."}
                </>
              ) : isEditMode ? (
                "Update blood request"
              ) : (
                "Create blood request"
              )}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
