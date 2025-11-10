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
import { Eye, EyeOff } from "lucide-react";
import Cookies from "js-cookie";
import { cn } from "@/lib/utils";

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

type RegisterFormProps = {
  variant?: "light" | "dark";
  className?: string;
};

const RegisterForm = ({ variant = "light", className }: RegisterFormProps) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [fullNameFocused, setFullNameFocused] = React.useState(false);
  const [emailFocused, setEmailFocused] = React.useState(false);
  const [passwordFocused, setPasswordFocused] = React.useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] =
    React.useState(false);
  const isDark = variant === "dark";

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

      if (response.success && response.data) {
        // Set the auth token in cookies
        Cookies.set("auth_token", response.data.token, {
          expires: 7,
          path: "/",
          sameSite: "lax",
        });

        toast.success("Account created successfully!", {
          description: "Redirecting to your dashboard...",
          duration: 3000,
        });

        // Redirect to appropriate dashboard based on role
        const dashboardPath = `/${response.data.role}/dashboard`;
        router.push(dashboardPath);
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
        className={cn(
          "space-y-5",
          isDark ? "text-white" : "text-foreground",
          className
        )}
      >
        <FormField
          control={registerForm.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel
                className={cn(
                  "text-sm font-medium",
                  isDark ? "text-white/90" : "text-foreground"
                )}
              >
                Full Name
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={fullNameFocused ? "" : "John Doe"}
                  disabled={isLoading}
                  className={cn(
                    "h-11",
                    isDark
                      ? "rounded-xl border-white/15 bg-slate-900/60 text-base text-white placeholder:text-white/50 focus-visible:ring-rose-400/60"
                      : ""
                  )}
                  onFocus={() => setFullNameFocused(true)}
                  {...field}
                  onBlur={(e) => {
                    setFullNameFocused(false);
                    field.onBlur();
                  }}
                />
              </FormControl>
              <FormMessage
                className={cn(
                  "text-xs",
                  isDark ? "text-rose-200" : "text-destructive"
                )}
              />
            </FormItem>
          )}
        />

        <FormField
          control={registerForm.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel
                className={cn(
                  "text-sm font-medium",
                  isDark ? "text-white/90" : "text-foreground"
                )}
              >
                Email Address
              </FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder={emailFocused ? "" : "john@example.com"}
                  disabled={isLoading}
                  className={cn(
                    "h-11",
                    isDark
                      ? "rounded-xl border-white/15 bg-slate-900/60 text-base text-white placeholder:text-white/50 focus-visible:ring-rose-400/60"
                      : ""
                  )}
                  onFocus={() => setEmailFocused(true)}
                  {...field}
                  onBlur={(e) => {
                    setEmailFocused(false);
                    field.onBlur();
                  }}
                />
              </FormControl>
              <FormMessage
                className={cn(
                  "text-xs",
                  isDark ? "text-rose-200" : "text-destructive"
                )}
              />
            </FormItem>
          )}
        />

        <FormField
          control={registerForm.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel
                className={cn(
                  "text-sm font-medium",
                  isDark ? "text-white/90" : "text-foreground"
                )}
              >
                Password
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder={passwordFocused ? "" : "••••••••"}
                    disabled={isLoading}
                    className={cn(
                      "h-11 pr-10",
                      isDark
                        ? "rounded-xl border-white/15 bg-slate-900/60 text-base text-white placeholder:text-white/50 focus-visible:ring-rose-400/60"
                        : ""
                    )}
                    onFocus={() => setPasswordFocused(true)}
                    {...field}
                    onBlur={(e) => {
                      setPasswordFocused(false);
                      field.onBlur();
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={cn(
                      "absolute right-3 top-1/2 -translate-y-1/2 transition-colors",
                      isDark
                        ? "text-white/60 hover:text-white"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage
                className={cn(
                  "text-xs",
                  isDark ? "text-rose-200" : "text-destructive"
                )}
              />
            </FormItem>
          )}
        />

        <FormField
          control={registerForm.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel
                className={cn(
                  "text-sm font-medium",
                  isDark ? "text-white/90" : "text-foreground"
                )}
              >
                Confirm Password
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder={confirmPasswordFocused ? "" : "••••••••"}
                    disabled={isLoading}
                    className={cn(
                      "h-11 pr-10",
                      isDark
                        ? "rounded-xl border-white/15 bg-slate-900/60 text-base text-white placeholder:text-white/50 focus-visible:ring-rose-400/60"
                        : ""
                    )}
                    onFocus={() => setConfirmPasswordFocused(true)}
                    {...field}
                    onBlur={(e) => {
                      setConfirmPasswordFocused(false);
                      field.onBlur();
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className={cn(
                      "absolute right-3 top-1/2 -translate-y-1/2 transition-colors",
                      isDark
                        ? "text-white/60 hover:text-white"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage
                className={cn(
                  "text-xs",
                  isDark ? "text-rose-200" : "text-destructive"
                )}
              />
            </FormItem>
          )}
        />

        <FormField
          control={registerForm.control}
          name="role"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel
                className={cn(
                  "text-sm font-medium",
                  isDark ? "text-white/90" : "text-foreground"
                )}
              >
                I want to
              </FormLabel>
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
                        className={cn(
                          "relative flex items-center space-x-3 rounded-lg border-2 p-4 transition-all cursor-pointer",
                          field.value === role.value
                            ? isDark
                              ? "border-rose-300/70 bg-rose-400/10 shadow-[0_12px_40px_rgba(244,114,182,0.25)]"
                              : "border-destructive bg-destructive/5"
                            : isDark
                              ? "border-white/15 hover:border-rose-300/60 hover:bg-white/5"
                              : "border-border hover:border-destructive/50"
                        )}
                      >
                        <RadioGroupItem
                          value={role.value}
                          id={`register-${role.value}`}
                          className={cn(
                            "shrink-0",
                            isDark ? "text-white" : ""
                          )}
                        />
                        <Label
                          htmlFor={`register-${role.value}`}
                          className={cn(
                            "font-medium cursor-pointer text-sm flex-1",
                            isDark ? "text-white" : "text-foreground"
                          )}
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
              <FormMessage
                className={cn(
                  "text-xs",
                  isDark ? "text-rose-200" : "text-destructive"
                )}
              />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className={cn(
            "w-full h-11 text-base font-medium mt-6",
            isDark
              ? "rounded-xl bg-linear-to-r from-rose-500 via-fuchsia-500 to-indigo-500 text-white shadow-lg shadow-rose-500/20 transition hover:scale-[1.01] focus-visible:ring-rose-400/60"
              : ""
          )}
          disabled={isLoading}
        >
          {isLoading ? "Creating account..." : "Create Account"}
        </Button>

        <p
          className={cn(
            "text-center text-xs pt-2",
            isDark ? "text-white/60" : "text-muted-foreground"
          )}
        >
          By creating an account, you agree to our{" "}
          <a
            href="#"
            className={cn(
              "font-medium hover:underline",
              isDark ? "text-rose-200 hover:text-rose-100" : "text-destructive"
            )}
          >
            Terms
          </a>{" "}
          and{" "}
          <a
            href="#"
            className={cn(
              "font-medium hover:underline",
              isDark ? "text-rose-200 hover:text-rose-100" : "text-destructive"
            )}
          >
            Privacy Policy
          </a>
        </p>
      </form>
    </Form>
  );
};

export default RegisterForm;
