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

  const baseToastClass =
    "group-[.toaster]:!relative group-[.toaster]:!overflow-hidden group-[.toaster]:!rounded-2xl group-[.toaster]:!border group-[.toaster]:!border-white/14 group-[.toaster]:!bg-slate-950/80 group-[.toaster]:!px-4 group-[.toaster]:!py-4 group-[.toaster]:!text-white group-[.toaster]:backdrop-blur group-[.toaster]:shadow-[0_14px_70px_rgba(15,23,42,0.5)]";

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4 text-rose-200" />,
        info: <InfoIcon className="size-4 text-sky-200" />,
        warning: <TriangleAlertIcon className="size-4 text-amber-200" />,
        error: <OctagonXIcon className="size-4 text-rose-300" />,
        loading: <Loader2Icon className="size-4 animate-spin text-white" />,
      }}
      toastOptions={{
        className: baseToastClass,
        classNames: {
          success:
            "group-[.toaster]:!border-rose-300/60 group-[.toaster]:!bg-linear-to-r from-rose-500/25 via-fuchsia-500/20 to-indigo-500/25",
          error:
            "group-[.toaster]:!border-rose-500/70 group-[.toaster]:!bg-linear-to-r from-rose-600/30 via-rose-500/20 to-rose-700/20",
          warning:
            "group-[.toaster]:!border-amber-400/60 group-[.toaster]:!bg-linear-to-r from-amber-500/25 via-orange-500/20 to-rose-400/15",
          info: "group-[.toaster]:!border-sky-400/60 group-[.toaster]:!bg-linear-to-r from-sky-500/25 via-indigo-500/20 to-purple-500/20",
          title: "group-[.toaster]:!text-white group-[.toaster]:!font-semibold",
          description: "group-[.toaster]:!text-white/70",
          actionButton:
            "group-[.toaster]:!rounded-full group-[.toaster]:!bg-white group-[.toaster]:!px-3 group-[.toaster]:!py-1 group-[.toaster]:!text-slate-900",
          cancelButton:
            "group-[.toaster]:!rounded-full group-[.toaster]:!bg-white/10 group-[.toaster]:!text-white",
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
