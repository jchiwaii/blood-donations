"use client";

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      toastOptions={{
        classNames: {
          error:
            "group-[.toaster]:!bg-destructive/10 group-[.toaster]:!text-foreground group-[.toaster]:!border-destructive/30 group-[.toaster]:shadow-lg",
          success:
            "group-[.toaster]:!bg-primary/10 group-[.toaster]:!text-foreground group-[.toaster]:!border-primary/30 group-[.toaster]:shadow-lg",
          warning:
            "group-[.toaster]:!bg-amber-500/10 group-[.toaster]:!text-foreground group-[.toaster]:!border-amber-500/30 group-[.toaster]:shadow-lg",
          info: "group-[.toaster]:!bg-blue-500/10 group-[.toaster]:!text-foreground group-[.toaster]:!border-blue-500/30 group-[.toaster]:shadow-lg",
          title:
            "group-[.toaster]:!text-foreground group-[.toaster]:!font-semibold",
          description: "group-[.toaster]:!text-muted-foreground",
          actionButton:
            "group-[.toaster]:!bg-primary group-[.toaster]:!text-primary-foreground",
          cancelButton:
            "group-[.toaster]:!bg-muted group-[.toaster]:!text-muted-foreground",
        },
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
