import { cn } from "@/lib/utils";
import { Mail, ShieldCheck, User } from "lucide-react";

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

  const useDark = variant === "dark";

  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-[2rem] border p-6 shadow-sm sm:p-8",
        useDark
          ? "border-border/70 bg-card/80"
          : "border-border/70 bg-card/80",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 opacity-70" style={{ background: "radial-gradient(circle at 0% -20%, rgba(196,44,43,0.12), transparent 38%)" }} />

      <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground text-xl font-semibold shadow-glow">
            {initials || <User className="size-8" />}
          </div>

          <div className="space-y-1.5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Profile overview
            </p>
            <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {user.name}
            </h2>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.14em] text-primary">
              <ShieldCheck className="size-3.5" />
              {roleLabel}
            </span>
          </div>
        </div>
      </div>

      <dl className="relative mt-8 grid gap-4 border-t border-border/70 pt-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
          <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Email
          </dt>
          <dd className="mt-2 inline-flex items-center gap-2 text-sm text-foreground">
            <Mail className="size-4 text-primary" />
            {user.email}
          </dd>
        </div>

        <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
          <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Account ID
          </dt>
          <dd className="mt-2 text-sm font-medium text-foreground">#{user.id}</dd>
        </div>
      </dl>
    </section>
  );
}
