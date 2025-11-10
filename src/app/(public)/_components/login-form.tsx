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
import { loginUser } from "@/server-actions/users";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

// Define the form schema with Zod
const loginFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z
    .enum(["admin", "donor", "recipient"] as const)
    .refine((val) => val !== undefined, {
      message: "Please select a role",
    }),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

type LoginFormProps = {
  variant?: "light" | "dark";
  className?: string;
};

const LoginForm = ({ variant = "light", className }: LoginFormProps) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [emailFocused, setEmailFocused] = React.useState(false);
  const [passwordFocused, setPasswordFocused] = React.useState(false);
  const router = useRouter();
  const isDark = variant === "dark";

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
      role: undefined,
    },
  });

  const onLoginSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);

    try {
      const response = await loginUser({
        email: values.email,
        password: values.password,
        role: values.role,
      });

      if (response.success) {
        Cookies.set("auth_token", response.data!.token, {
          expires: 7,
          path: "/",
          sameSite: "lax",
        });

        toast.success("Login successful!", {
          description: `Welcome back, ${response.data!.name}!`,
          duration: 2000,
        });

        // Redirect based on role
        setTimeout(() => {
          if (response.data!.role === "admin") {
            router.push("/admin/dashboard");
          } else if (response.data!.role === "donor") {
            router.push("/donor/dashboard");
          } else if (response.data!.role === "recipient") {
            router.push("/recipient/dashboard");
          }
          router.refresh();
        }, 500);
      } else {
        toast.error("Login failed", {
          description: "Please check your credentials and try again.",
          duration: 5000,
        });
      }
    } catch (error: any) {
      toast.error("Login failed", {
        description: "Please check your credentials and try again.",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...loginForm}>
      <form
        onSubmit={loginForm.handleSubmit(onLoginSubmit)}
        className={cn(
          "space-y-5",
          isDark ? "text-white" : "text-foreground",
          className
        )}
      >
        <FormField
          control={loginForm.control}
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
          control={loginForm.control}
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
          control={loginForm.control}
          name="role"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel
                className={cn(
                  "text-sm font-medium",
                  isDark ? "text-white/90" : "text-foreground"
                )}
              >
                Login as
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={isLoading}
                  className="grid grid-cols-3 gap-3"
                >
                  {USER_ROLES.map((role) => (
                    <div
                      key={role.value}
                      className={cn(
                        "relative flex items-center justify-center rounded-lg border-2 p-4 transition-all min-h-[60px] cursor-pointer",
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
                        id={`login-${role.value}`}
                        className={cn(
                          "absolute top-3 right-3 shrink-0",
                          isDark ? "text-white" : ""
                        )}
                      />
                      <Label
                        htmlFor={`login-${role.value}`}
                        className={cn(
                          "font-medium cursor-pointer text-sm text-center pr-6",
                          isDark ? "text-white" : "text-foreground"
                        )}
                      >
                        {role.label}
                      </Label>
                    </div>
                  ))}
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
          {isLoading ? "Logging in..." : "Login"}
        </Button>
      </form>
    </Form>
  );
};

export default LoginForm;
