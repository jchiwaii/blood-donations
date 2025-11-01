"use client";

import { Button } from "@/components/ui/button";
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import LoginForm from "./login-form";
import RegisterForm from "./register-form";

type AuthMode = "login" | "register";

const SignInButton = () => {
  const [openAuthSheet, setOpenAuthSheet] = React.useState(false);
  const [authMode, setAuthMode] = React.useState<AuthMode>("login");

  return (
    <Sheet open={openAuthSheet} onOpenChange={setOpenAuthSheet}>
      <SheetTrigger asChild>
        <Button variant={"outline"}>Login</Button>
      </SheetTrigger>

      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {authMode === "login" ? "Welcome Back" : "Create Account"}
          </SheetTitle>
          <SheetDescription>
            {authMode === "login"
              ? "Login to your account to continue"
              : "Register a new account to get started"}
          </SheetDescription>
        </SheetHeader>

        <div className="py-6">
          {/* Tab Switcher */}
          <div className="flex gap-2 mb-6 p-1 bg-muted rounded-lg">
            <button
              type="button"
              onClick={() => setAuthMode("login")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                authMode === "login"
                  ? "bg-background shadow-sm"
                  : "hover:bg-background/50"
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setAuthMode("register")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                authMode === "register"
                  ? "bg-background shadow-sm"
                  : "hover:bg-background/50"
              }`}
            >
              Register
            </button>
          </div>

          {/* Form Content */}
          {authMode === "login" ? <LoginForm /> : <RegisterForm />}

          {/* Switch Mode Link */}
          <div className="mt-4 text-center text-sm text-muted-foreground">
            {authMode === "login" ? (
              <p>
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => setAuthMode("register")}
                  className="text-primary hover:underline font-medium"
                >
                  Register here
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setAuthMode("login")}
                  className="text-primary hover:underline font-medium"
                >
                  Login here
                </button>
              </p>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SignInButton;
