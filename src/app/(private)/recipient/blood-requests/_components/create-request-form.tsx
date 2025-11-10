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
  createBloodRequest,
  updateBloodRequest,
} from "@/server-actions/blood-reqests";
import { currentUser } from "@/server-actions/users";
import { uploadMultipleMedia } from "@/server-actions/media";
import { IBloodRequest } from "@/interfaces";

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
  const [titleFocused, setTitleFocused] = useState(false);
  const [descriptionFocused, setDescriptionFocused] = useState(false);
  const [unitsRequiredFocused, setUnitsRequiredFocused] = useState(false);
  const [contactPhoneFocused, setContactPhoneFocused] = useState(false);
  const [contactEmailFocused, setContactEmailFocused] = useState(false);
  const [addressFocused, setAddressFocused] = useState(false);
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
            console.log("Uploading new files for request:", editData.id);

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
              console.error("File upload failed:", uploadResponse);
              toast.warning("Request updated but some files failed to upload");
            } else {
              console.log("Files uploaded successfully:", uploadResponse.urls);
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

        console.log("Creating request for user:", user);

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

        console.log("Create response:", response);

        if (response.success) {
          // Upload files if any were selected
          if (uploadedFiles.length > 0 && response.data?.id) {
            console.log("Uploading files for request:", response.data.id);

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
              console.error("File upload failed:", uploadResponse);
              toast.warning("Request created but some files failed to upload");
            } else {
              console.log("Files uploaded successfully:", uploadResponse.urls);
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
          console.error("Failed to create request:", response);
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
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">
                Request Title
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={
                    titleFocused ? "" : "Urgent: Need Blood for Surgery"
                  }
                  disabled={isLoading}
                  className="h-11"
                  onFocus={() => setTitleFocused(true)}
                  {...field}
                  onBlur={(e) => {
                    setTitleFocused(false);
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={
                    descriptionFocused
                      ? ""
                      : "Provide details about the medical condition and why blood is needed..."
                  }
                  disabled={isLoading}
                  className="min-h-[100px] resize-none"
                  onFocus={() => setDescriptionFocused(true)}
                  {...field}
                  onBlur={() => {
                    setDescriptionFocused(false);
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
            name="units_required"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">
                  Units Required
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={unitsRequiredFocused ? "" : "1"}
                    disabled={isLoading}
                    className="h-11"
                    min={1}
                    max={10}
                    onFocus={() => setUnitsRequiredFocused(true)}
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value) || 0)
                    }
                    onBlur={() => {
                      setUnitsRequiredFocused(false);
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
          name="urgency"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">
                Urgency Level
              </FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isLoading}
              >
                <FormControl>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select urgency level" />
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
                    onBlur={(e) => {
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
                    placeholder={
                      contactEmailFocused ? "" : "contact@example.com"
                    }
                    disabled={isLoading}
                    className="h-11"
                    onFocus={() => setContactEmailFocused(true)}
                    {...field}
                    onBlur={(e) => {
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
                Hospital/Clinic Address
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder={
                    addressFocused
                      ? ""
                      : "Enter the full address where blood is needed..."
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
          name="proofs"
          render={({ field: { onChange, value, ...field } }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">
                Medical Proofs (Optional)
              </FormLabel>
              <FormControl>
                <div className="space-y-2">
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    disabled={isLoading}
                    className="h-11 cursor-pointer"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      setUploadedFiles(files);
                      onChange(files);
                    }}
                    {...field}
                  />
                  {uploadedFiles.length > 0 && (
                    <div className="text-xs text-muted-foreground">
                      {uploadedFiles.length} image(s) selected:
                      <ul className="list-disc list-inside mt-1">
                        {uploadedFiles.map((file, index) => (
                          <li key={index}>{file.name}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Upload medical images, prescriptions, or hospital letters
                    (Images only: JPG, PNG, etc.)
                  </p>
                </div>
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
              {isEditMode ? "Updating Request..." : "Creating Request..."}
            </>
          ) : isEditMode ? (
            "Update Blood Request"
          ) : (
            "Create Blood Request"
          )}
        </Button>
      </form>
    </Form>
  );
}
