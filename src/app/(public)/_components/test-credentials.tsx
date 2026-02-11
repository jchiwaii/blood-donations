"use client";

import React, { useState } from "react";
import { ChevronDown, FlaskConical, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type TestAccount = {
  label: string;
  email: string;
  password: string;
  role: "admin" | "donor" | "recipient";
};

const testAccounts: TestAccount[] = [
  // Admins
  { label: "Admin User", email: "admin@test.com", password: "password123", role: "admin" },
  { label: "Super Admin", email: "superadmin@test.com", password: "password123", role: "admin" },
  // Donors
  { label: "John Smith", email: "donor1@test.com", password: "password123", role: "donor" },
  { label: "Emma Johnson", email: "donor2@test.com", password: "password123", role: "donor" },
  { label: "Michael Brown", email: "donor3@test.com", password: "password123", role: "donor" },
  // Recipients
  { label: "Olivia Martinez", email: "recipient1@test.com", password: "password123", role: "recipient" },
  { label: "William Anderson", email: "recipient2@test.com", password: "password123", role: "recipient" },
  { label: "Ava Taylor", email: "recipient3@test.com", password: "password123", role: "recipient" },
];

const roleColors: Record<string, string> = {
  admin: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  donor: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  recipient: "bg-sky-500/15 text-sky-400 border-sky-500/30",
};

const roleDotColors: Record<string, string> = {
  admin: "bg-amber-400",
  donor: "bg-emerald-400",
  recipient: "bg-sky-400",
};

type TestCredentialsProps = {
  onSelect: (account: TestAccount) => void;
};

export default function TestCredentials({ onSelect }: TestCredentialsProps) {
  const [open, setOpen] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const grouped = {
    admin: testAccounts.filter((a) => a.role === "admin"),
    donor: testAccounts.filter((a) => a.role === "donor"),
    recipient: testAccounts.filter((a) => a.role === "recipient"),
  };

  const handleSelect = (account: TestAccount, idx: number) => {
    onSelect(account);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
  };

  return (
    <div className="rounded-xl border border-dashed border-border/60 bg-muted/30">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <span className="flex items-center gap-2">
          <FlaskConical className="h-4 w-4 text-primary/70" />
          Test Credentials
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <div className="border-t border-border/40 px-4 pb-4 pt-3 space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
          <p className="text-[11px] text-muted-foreground">
            Click any account to auto-fill the login form. Password:{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-[11px] font-mono text-foreground">
              password123
            </code>
          </p>

          {(["admin", "donor", "recipient"] as const).map((role) => (
            <div key={role} className="space-y-1.5">
              <div className="flex items-center gap-1.5">
                <span
                  className={cn("h-1.5 w-1.5 rounded-full", roleDotColors[role])}
                />
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {role}s
                </span>
              </div>
              <div className="grid gap-1.5">
                {grouped[role].map((account, i) => {
                  const globalIdx =
                    role === "admin"
                      ? i
                      : role === "donor"
                        ? grouped.admin.length + i
                        : grouped.admin.length + grouped.donor.length + i;

                  return (
                    <button
                      key={account.email}
                      type="button"
                      onClick={() => handleSelect(account, globalIdx)}
                      className={cn(
                        "group flex items-center justify-between rounded-lg border px-3 py-2 text-left text-xs transition-all",
                        "border-border/40 bg-background/40 hover:bg-background/80 hover:border-border",
                        copiedIdx === globalIdx && "border-primary/50 bg-primary/5"
                      )}
                    >
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <span className="font-medium text-foreground truncate">
                          {account.label}
                        </span>
                        <span className="text-muted-foreground font-mono text-[11px] truncate">
                          {account.email}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        <span
                          className={cn(
                            "rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                            roleColors[role]
                          )}
                        >
                          {role}
                        </span>
                        {copiedIdx === globalIdx ? (
                          <Check className="h-3.5 w-3.5 text-primary" />
                        ) : (
                          <Copy className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
