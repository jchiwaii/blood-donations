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

const LoginForm = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [emailFocused, setEmailFocused] = React.useState(false);
  const [passwordFocused, setPasswordFocused] = React.useState(false);
  const router = useRouter();

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
        className="space-y-5"
      >
        <FormField
          control={loginForm.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">
                Email Address
              </FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder={emailFocused ? "" : "john@example.com"}
                  disabled={isLoading}
                  className="h-11"
                  onFocus={() => setEmailFocused(true)}
                  {...field}
                  onBlur={(e) => {
                    setEmailFocused(false);
                    field.onBlur();
                  }}
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <FormField
          control={loginForm.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder={passwordFocused ? "" : "••••••••"}
                    disabled={isLoading}
                    className="h-11 pr-10"
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
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
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
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <FormField
          control={loginForm.control}
          name="role"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-sm font-medium">Login as</FormLabel>
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
                      className={`relative flex items-center justify-center rounded-lg border-2 p-4 cursor-pointer transition-all min-h-[60px] ${
                        field.value === role.value
                          ? "border-destructive bg-destructive/5"
                          : "border-border hover:border-destructive/50"
                      }`}
                    >
                      <RadioGroupItem
                        value={role.value}
                        id={`login-${role.value}`}
                        className="absolute top-3 right-3 shrink-0"
                      />
                      <Label
                        htmlFor={`login-${role.value}`}
                        className="font-medium cursor-pointer text-sm text-center pr-6"
                      >
                        {role.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-end pt-1">
          <a
            href="#"
            className="text-xs text-destructive hover:underline font-medium"
            onClick={(e) => {
              e.preventDefault();
              // Add forgot password logic
            }}
          >
            Forgot password?
          </a>
        </div>

        <Button
          type="submit"
          className="w-full h-11 text-base font-medium mt-6"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
        </Button>
      </form>
    </Form>
  );
};

export default LoginForm;
