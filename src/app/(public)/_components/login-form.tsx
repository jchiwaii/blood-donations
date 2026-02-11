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
import TestCredentials, { type TestAccount } from "./test-credentials";

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

const LoginForm = ({ className }: LoginFormProps) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const router = useRouter();

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
      role: undefined,
    },
  });

  const handleTestAccountSelect = (account: TestAccount) => {
    loginForm.setValue("email", account.email);
    loginForm.setValue("password", account.password);
    loginForm.setValue("role", account.role);
  };

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
        className={cn("space-y-5 text-foreground", className)}
      >
        <FormField
          control={loginForm.control}
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
          control={loginForm.control}
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
          control={loginForm.control}
          name="role"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-sm font-medium text-foreground">
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
                          ? "border-primary/50 bg-primary/10 shadow-glow"
                          : "border-border hover:border-primary/30 hover:bg-background/50",
                      )}
                    >
                      <RadioGroupItem
                        value={role.value}
                        id={`login-${role.value}`}
                        className="absolute top-3 right-3 shrink-0 text-primary"
                      />
                      <Label
                        htmlFor={`login-${role.value}`}
                        className="font-medium cursor-pointer text-sm text-center pr-6 text-foreground"
                      >
                        {role.label}
                      </Label>
                    </div>
                  ))}
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
          {isLoading ? "Logging in..." : "Login"}
        </Button>

        <TestCredentials onSelect={handleTestAccountSelect} />
      </form>
    </Form>
  );
};

export default LoginForm;
