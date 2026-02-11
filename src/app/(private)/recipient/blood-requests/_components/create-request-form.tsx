"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, UploadCloud } from "lucide-react";
import { toast } from "sonner";

import {
  createBloodRequest,
  updateBloodRequest,
} from "@/server-actions/blood-reqests";
import { currentUser } from "@/server-actions/users";
import { uploadMultipleMedia } from "@/server-actions/media";
import { IBloodRequest } from "@/interfaces";
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

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const URGENCY_LEVELS = ["Low", "Medium", "High", "Critical"];

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
  proofs: z.any().optional(),
});

type BloodRequestFormData = z.infer<typeof bloodRequestSchema>;

interface CreateRequestFormProps {
  editData?: Partial<IBloodRequest>;
  onSuccess?: () => void;
}

export default function CreateRequestForm({ editData, onSuccess }: CreateRequestFormProps) {
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
    if (!editData) return;

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
  }, [editData, form]);

  const uploadProofFiles = async (requestId: number) => {
    if (uploadedFiles.length === 0) return;

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
    const uploadResponse = await uploadMultipleMedia(filesData, "blood_request", requestId);

    if (!uploadResponse.success) {
      toast.warning("Request saved, but some files failed to upload");
    }
  };

  const onSubmit = async (data: BloodRequestFormData) => {
    setIsLoading(true);

    try {
      if (isEditMode && editData?.id) {
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
          await uploadProofFiles(editData.id);
          toast.success("Blood request updated successfully");
          setUploadedFiles([]);

          if (onSuccess) {
            onSuccess();
          } else {
            router.push("/recipient/dashboard");
          }
        } else {
          toast.error(response.message || "Failed to update blood request");
        }
      } else {
        const user = await currentUser();

        if (!user) {
          toast.error("You must be logged in to create a request");
          setIsLoading(false);
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
          if (response.data?.id) {
            await uploadProofFiles(response.data.id);
          }

          toast.success("Blood request created successfully");
          form.reset();
          setUploadedFiles([]);

          if (onSuccess) {
            onSuccess();
          } else {
            router.push("/recipient/dashboard");
          }
        } else {
          const errorMessage = response.error
            ? `${response.message}: ${response.error}`
            : response.message || "Failed to create blood request";
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
        className="space-y-6 rounded-3xl border border-border/70 bg-card/80 p-6 shadow-sm sm:p-8"
      >
        <section className="space-y-5 rounded-2xl border border-border/70 bg-background/70 p-5">
          <div>
            <h3 className="font-heading text-lg font-semibold tracking-tight text-foreground">
              Medical need
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Provide core request details and urgency level.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Request title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Urgent: O+ units needed for surgery"
                      disabled={isLoading}
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
              name="blood_group"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Blood group</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger className="h-11 w-full rounded-xl">
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
              name="urgency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Urgency</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger className="h-11 w-full rounded-xl">
                        <SelectValue placeholder="Select urgency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {URGENCY_LEVELS.map((level) => (
                        <SelectItem key={level} value={level.toLowerCase()}>
                          {level}
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
              name="units_required"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Units required</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={10}
                      disabled={isLoading}
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
              name="description"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Include medical context and timing constraints"
                      disabled={isLoading}
                      className="min-h-28 rounded-xl"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>
        </section>

        <section className="space-y-5 rounded-2xl border border-border/70 bg-background/70 p-5">
          <div>
            <h3 className="font-heading text-lg font-semibold tracking-tight text-foreground">
              Contact and location
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Share reliable contact details so donors can coordinate quickly.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <FormField
              control={form.control}
              name="contact_phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact phone</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      disabled={isLoading}
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
                      placeholder="coordinator@hospital.org"
                      disabled={isLoading}
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
              name="address"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Hospital or collection point</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Provide full address and check-in instructions"
                      disabled={isLoading}
                      className="min-h-24 rounded-xl"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>
        </section>

        <section className="space-y-4 rounded-2xl border border-border/70 bg-background/70 p-5">
          <div>
            <h3 className="font-heading text-lg font-semibold tracking-tight text-foreground">
              Supporting documents (optional)
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Upload prescriptions, hospital letters, or lab reports.
            </p>
          </div>

          <FormField
            control={form.control}
            name="proofs"
            render={({ field: { onChange, ...field } }) => (
              <FormItem>
                <FormControl>
                  <div className="space-y-3">
                    <label className="flex cursor-pointer items-center justify-between rounded-xl border border-dashed border-border bg-card px-4 py-5 transition hover:border-primary/40">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <UploadCloud className="size-5" />
                        </span>
                        <div className="text-sm">
                          <p className="font-medium text-foreground">Click to upload files</p>
                          <p className="text-xs text-muted-foreground">Images only, up to 10MB each</p>
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

                    {uploadedFiles.length > 0 ? (
                      <div className="rounded-xl border border-border bg-card p-3 text-xs text-muted-foreground">
                        {uploadedFiles.map((file, index) => (
                          <p key={`${file.name}-${index}`}>{file.name}</p>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
        </section>

        <Button type="submit" disabled={isLoading} className="h-11 w-full rounded-xl">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              {isEditMode ? "Updating request..." : "Creating request..."}
            </>
          ) : isEditMode ? (
            "Update blood request"
          ) : (
            "Create blood request"
          )}
        </Button>
      </form>
    </Form>
  );
}
