import { cn } from "@/lib/utils";
import { Mail, Shield, User } from "lucide-react";

type ProfileSummaryCardProps = {
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  className?: string;
  variant?: "light" | "dark";
};

const roleLabels: Record<string, string> = {
  recipient: "Recipient",
  donor: "Donor",
  admin: "Administrator",
};

export function ProfileSummaryCard({
  user,
  className,
  variant = "light",
}: ProfileSummaryCardProps) {
  const roleLabel = roleLabels[user.role] ?? user.role;
  const initials = user.name
    .split(" ")
    .map((chunk) => chunk.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("");
  const isDark = variant === "dark";

  const containerClasses = cn(
    "relative overflow-hidden rounded-3xl border shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl",
    isDark
      ? "border-white/10 bg-slate-950/70 shadow-[0_20px_120px_rgba(15,23,42,0.45)]"
      : "border-border/60 bg-card/80"
  );

  const overlayClasses = cn(
    "absolute inset-0",
    isDark
      ? "bg-[radial-gradient(circle_at_top,rgba(244,114,182,0.2),rgba(79,70,229,0.15),transparent_70%)]"
      : "bg-[radial-gradient(circle_at_top,rgba(239,68,68,0.2),transparent_55%)]"
  );

  return (
    <section
      className={cn(containerClasses, className)}
    >
      <div className={overlayClasses} />

      <div className="relative flex flex-col gap-8 p-8 md:flex-row md:items-start md:justify-between">
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <div
            className={cn(
              "flex h-20 w-20 items-center justify-center rounded-2xl text-2xl font-semibold shadow-lg",
              isDark
                ? "bg-rose-500/90 text-white"
                : "bg-destructive text-destructive-foreground"
            )}
          >
            {initials || <User className="h-10 w-10" />}
          </div>

          <div className="space-y-2">
            <p
              className={cn(
                "text-sm font-medium uppercase tracking-[0.25em]",
                isDark ? "text-rose-200/70" : "text-destructive/70"
              )}
            >
              Profile Overview
            </p>
            <h1
              className={cn(
                "text-3xl font-semibold leading-tight sm:text-4xl",
                isDark ? "text-white" : "text-foreground"
              )}
            >
              {user.name}
            </h1>
            <div
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium",
                isDark
                  ? "border border-white/20 bg-white/10 text-white"
                  : "border border-border/70 bg-background/70 text-foreground/80"
              )}
            >
              <Shield
                className={cn(
                  "h-4 w-4",
                  isDark ? "text-rose-200" : "text-destructive"
                )}
              />
              <span>{roleLabel}</span>
            </div>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "relative border-t",
          isDark ? "border-white/10" : "border-border/60"
        )}
      >
        <dl className="grid gap-6 p-8 md:grid-cols-2">
          <div className="space-y-2">
            <dt
              className={cn(
                "text-xs font-semibold uppercase tracking-wide",
                isDark ? "text-white/60" : "text-muted-foreground"
              )}
            >
              Email Address
            </dt>
            <dd
              className={cn(
                "flex items-center gap-2 text-sm",
                isDark ? "text-white/90" : "text-foreground/90"
              )}
            >
              <Mail
                className={cn(
                  "h-4 w-4",
                  isDark ? "text-rose-200" : "text-destructive"
                )}
              />
              <span>{user.email}</span>
            </dd>
          </div>

          <div className="space-y-2">
            <dt
              className={cn(
                "text-xs font-semibold uppercase tracking-wide",
                isDark ? "text-white/60" : "text-muted-foreground"
              )}
            >
              Account ID
            </dt>
            <dd
              className={cn(
                "text-sm",
                isDark ? "text-white/90" : "text-foreground/90"
              )}
            >
              #{user.id}
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
