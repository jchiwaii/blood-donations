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
  SheetPortal,
  SheetOverlay,
} from "@/components/ui/sheet";
import { LogIn, Droplet, X } from "lucide-react";
import LoginForm from "./login-form";
import RegisterForm from "./register-form";
import * as SheetPrimitive from "@radix-ui/react-dialog";

type AuthMode = "login" | "register";

const SignInButton = () => {
  const [openAuthSheet, setOpenAuthSheet] = React.useState(false);
  const [authMode, setAuthMode] = React.useState<AuthMode>("login");

  return (
    <Sheet open={openAuthSheet} onOpenChange={setOpenAuthSheet}>
      <SheetTrigger asChild>
        <Button 
          variant="default" 
          size="sm" 
          className="gap-2 transition-all duration-300 hover:scale-105 hover:shadow-lg"
        >
          <LogIn className="h-4 w-4" />
          Login
        </Button>
      </SheetTrigger>
      
      <SheetPortal>
        {/* Custom Overlay with Blur */}
        <SheetPrimitive.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        
        <SheetPrimitive.Content 
          className="fixed inset-y-0 right-0 z-50 h-full w-full sm:max-w-[480px] bg-background border-l shadow-2xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right data-[state=open]:duration-500 data-[state=closed]:duration-300 overflow-y-auto"
        >
        {/* Close Button */}
        <button
          onClick={() => setOpenAuthSheet(false)}
          className="absolute right-4 top-4 z-50 rounded-full p-2 opacity-70 ring-offset-background transition-all hover:opacity-100 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
        >
          <X className="h-4 w-4 text-white" />
          <span className="sr-only">Close</span>
        </button>

        {/* Header with gradient - Animated */}
        <div className="relative bg-linear-to-br from-destructive to-destructive/80 px-6 py-10 text-white overflow-hidden">
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-10 animate-pulse" />
          
          <div className="relative flex items-start gap-4 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="h-12 w-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center animate-in zoom-in duration-500 delay-200">
              <Droplet className="h-6 w-6 fill-white animate-pulse" />
            </div>
            <div className="flex-1">
              <SheetTitle className="text-white text-3xl font-bold mb-1 animate-in fade-in slide-in-from-left duration-500 delay-300">
                {authMode === "login" ? "Welcome Back" : "Join Us"}
              </SheetTitle>
              <SheetDescription className="text-white/90 text-sm animate-in fade-in slide-in-from-left duration-500 delay-400">
                {authMode === "login"
                  ? "Login to continue saving lives"
                  : "Start your journey as a hero"}
              </SheetDescription>
            </div>
          </div>
        </div>

        <div className="px-6 py-8 animate-in fade-in slide-in-from-bottom duration-700 delay-300">
          {/* Tab Switcher */}
          <div className="flex gap-1 mb-8 p-1 bg-muted/50 rounded-xl">
            <button
              type="button"
              onClick={() => setAuthMode("login")}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-300 ${
                authMode === "login"
                  ? "bg-background shadow-lg text-foreground scale-105"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/50"
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setAuthMode("register")}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-300 ${
                authMode === "register"
                  ? "bg-background shadow-lg text-foreground scale-105"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/50"
              }`}
            >
              Register
            </button>
          </div>

          {/* Form Content with Animation */}
          <div className="min-h-[400px] animate-in fade-in zoom-in-95 duration-500">
            {authMode === "login" ? <LoginForm /> : <RegisterForm />}
          </div>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/50" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-3 py-1 text-muted-foreground font-medium rounded-full">
                {authMode === "login" ? "New here?" : "Have an account?"}
              </span>
            </div>
          </div>

          {/* Switch Mode */}
          <div className="text-center animate-in fade-in duration-700 delay-500">
            <button
              type="button"
              onClick={() => setAuthMode(authMode === "login" ? "register" : "login")}
              className="text-sm text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-105"
            >
              {authMode === "login" ? (
                <>
                  Don&apos;t have an account?{" "}
                  <span className="font-bold text-destructive underline decoration-2 underline-offset-2">
                    Register here
                  </span>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <span className="font-bold text-destructive underline decoration-2 underline-offset-2">
                    Login here
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </SheetPrimitive.Content>
      </SheetPortal>
    </Sheet>
  );
};

export default SignInButton;
