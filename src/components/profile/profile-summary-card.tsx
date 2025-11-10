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
};

const roleLabels: Record<string, string> = {
  recipient: "Recipient",
  donor: "Donor",
  admin: "Administrator",
};

export function ProfileSummaryCard({ user, className }: ProfileSummaryCardProps) {
  const roleLabel = roleLabels[user.role] ?? user.role;
  const initials = user.name
    .split(" ")
    .map((chunk) => chunk.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("");

  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-3xl border border-border/60 bg-card/80 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl",
        className
      )}
    >
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(239,68,68,0.2),transparent_55%)]" />

      <div className="relative flex flex-col gap-8 p-8 md:flex-row md:items-start md:justify-between">
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-destructive text-2xl font-semibold text-destructive-foreground shadow-lg">
            {initials || <User className="h-10 w-10" />}
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-destructive/70">
              Profile Overview
            </p>
            <h1 className="text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
              {user.name}
            </h1>
            <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 py-1 text-sm font-medium text-foreground/80">
              <Shield className="h-4 w-4 text-destructive" />
              <span>{roleLabel}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative border-t border-border/60">
        <dl className="grid gap-6 p-8 md:grid-cols-2">
          <div className="space-y-2">
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Email Address
            </dt>
            <dd className="flex items-center gap-2 text-sm text-foreground/90">
              <Mail className="h-4 w-4 text-destructive" />
              <span>{user.email}</span>
            </dd>
          </div>

          <div className="space-y-2">
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Account ID
            </dt>
            <dd className="text-sm text-foreground/90">#{user.id}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
