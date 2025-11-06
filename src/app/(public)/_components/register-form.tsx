"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { USER_ROLES, type UserRole } from "@/constants";
import { registerUser } from "@/server-actions/users";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Define the form schema with Zod
const registerFormSchema = z
  .object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    role: z
      .enum(["donor", "recipient"] as const)
      .refine((val) => val !== undefined, {
        message: "Please select a role",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerFormSchema>;

const RegisterForm = () => {
  const [isLoading, setIsLoading] = React.useState(false);

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: undefined,
    },
  });

  const router = useRouter();

  const onRegisterSubmit = async (values: RegisterFormValues) => {
    setIsLoading(true);

    try {
      const response = await registerUser({
        name: values.fullName,
        email: values.email,
        password: values.password,
        role: values.role,
      });

      if (response.success) {
        toast.success("Account created successfully!", {
          description: "You can now login with your credentials.",
          duration: 5000,
        });
        // Reset form after successful registration
        registerForm.reset();
      } else {
        toast.error("Registration failed", {
          description: "Please check your information and try again.",
          duration: 5000,
        });
      }
    } catch (error: any) {
      toast.error("Registration failed", {
        description: "Please check your information and try again.",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...registerForm}>
      <form
        onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
        className="space-y-5"
      >
        <FormField
          control={registerForm.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Full Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="John Doe"
                  disabled={isLoading}
                  className="h-11"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <FormField
          control={registerForm.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">
                Email Address
              </FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="john@example.com"
                  disabled={isLoading}
                  className="h-11"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <FormField
          control={registerForm.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
                  disabled={isLoading}
                  className="h-11"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <FormField
          control={registerForm.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">
                Confirm Password
              </FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
                  disabled={isLoading}
                  className="h-11"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <FormField
          control={registerForm.control}
          name="role"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-sm font-medium">I want to</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={isLoading}
                  className="grid grid-cols-2 gap-3"
                >
                  {USER_ROLES.filter((role) => role.value !== "admin").map(
                    (role) => (
                      <div
                        key={role.value}
                        className={`relative flex items-center space-x-3 rounded-lg border-2 p-4 cursor-pointer transition-all ${
                          field.value === role.value
                            ? "border-destructive bg-destructive/5"
                            : "border-border hover:border-destructive/50"
                        }`}
                      >
                        <RadioGroupItem
                          value={role.value}
                          id={`register-${role.value}`}
                          className="shrink-0"
                        />
                        <Label
                          htmlFor={`register-${role.value}`}
                          className="font-medium cursor-pointer text-sm flex-1"
                        >
                          {role.label === "Donor"
                            ? "Donate Blood"
                            : "Receive Blood"}
                        </Label>
                      </div>
                    )
                  )}
                </RadioGroup>
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full h-11 text-base font-medium mt-6"
          disabled={isLoading}
        >
          {isLoading ? "Creating account..." : "Create Account"}
        </Button>

        <p className="text-center text-xs text-muted-foreground pt-2">
          By creating an account, you agree to our{" "}
          <a href="#" className="text-destructive hover:underline font-medium">
            Terms
          </a>{" "}
          and{" "}
          <a href="#" className="text-destructive hover:underline font-medium">
            Privacy Policy
          </a>
        </p>
      </form>
    </Form>
  );
};

export default RegisterForm;
