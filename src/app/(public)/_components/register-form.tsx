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

const RegisterForm = ({ className }: RegisterFormProps) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

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
        className={cn("space-y-5 text-foreground", className)}
      >
        <FormField
          control={registerForm.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-foreground">
                Full Name
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="John Doe"
                  disabled={isLoading}
                  className="h-11 rounded-xl border-border bg-background/50 text-base text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/60"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs text-destructive" />
            </FormItem>
          )}
        />

        <FormField
          control={registerForm.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-foreground">
                Email Address
              </FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="john@example.com"
                  disabled={isLoading}
                  className="h-11 rounded-xl border-border bg-background/50 text-base text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/60"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs text-destructive" />
            </FormItem>
          )}
        />

        <FormField
          control={registerForm.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-foreground">
                Password
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    disabled={isLoading}
                    className="h-11 pr-10 rounded-xl border-border bg-background/50 text-base text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/60"
                    {...field}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors text-muted-foreground hover:text-foreground"
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
              <FormMessage className="text-xs text-destructive" />
            </FormItem>
          )}
        />

        <FormField
          control={registerForm.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-foreground">
                Confirm Password
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    disabled={isLoading}
                    className="h-11 pr-10 rounded-xl border-border bg-background/50 text-base text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/60"
                    {...field}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors text-muted-foreground hover:text-foreground"
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
              <FormMessage className="text-xs text-destructive" />
            </FormItem>
          )}
        />

        <FormField
          control={registerForm.control}
          name="role"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-sm font-medium text-foreground">
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
                            ? "border-primary/50 bg-primary/10 shadow-glow"
                            : "border-border hover:border-primary/30 hover:bg-background/50"
                        )}
                      >
                        <RadioGroupItem
                          value={role.value}
                          id={`register-${role.value}`}
                          className="shrink-0 text-primary"
                        />
                        <Label
                          htmlFor={`register-${role.value}`}
                          className="font-medium cursor-pointer text-sm flex-1 text-foreground"
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
              <FormMessage className="text-xs text-destructive" />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full h-11 text-base font-medium mt-6 rounded-xl bg-gradient-to-r from-primary to-red-600 text-primary-foreground shadow-lg shadow-primary/20 transition hover:scale-[1.01] focus-visible:ring-primary/60"
          disabled={isLoading}
        >
          {isLoading ? "Creating account..." : "Create Account"}
        </Button>

        <p className="text-center text-xs pt-2 text-muted-foreground">
          By creating an account, you agree to our{" "}
          <a
            href="#"
            className="font-medium hover:underline text-primary hover:text-primary/80"
          >
            Terms
          </a>{" "}
          and{" "}
          <a
            href="#"
            className="font-medium hover:underline text-primary hover:text-primary/80"
          >
            Privacy Policy
          </a>
        </p>
      </form>
    </Form>
  );
};

export default RegisterForm;
