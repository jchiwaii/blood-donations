"use client";

import React from "react";
import { AlertCircle, Bell, Database, Lock, Mail, Save, Shield, User } from "lucide-react";
import { toast } from "sonner";

import PageTitle from "@/components/ui/page-title";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useUsersStore, { IUserStore } from "@/store/users-store";
import { cn } from "@/lib/utils";

const AdminSettingsPage = () => {
  const { users } = useUsersStore() as IUserStore;
  const [activeTab, setActiveTab] = React.useState<
    "profile" | "security" | "notifications" | "system"
  >("profile");
  const [isSaving, setIsSaving] = React.useState(false);

  const [profileData, setProfileData] = React.useState({
    name: users?.name || "",
    email: users?.email || "",
  });

  const [securityData, setSecurityData] = React.useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notificationSettings, setNotificationSettings] = React.useState({
    emailNotifications: true,
    newRequests: true,
    statusUpdates: true,
    dailyReports: false,
    weeklyReports: true,
  });

  const [systemSettings, setSystemSettings] = React.useState({
    autoApproveRequests: false,
    maintenanceMode: false,
    requireApproval: true,
  });

  React.useEffect(() => {
    if (users) {
      setProfileData({ name: users.name, email: users.email });
    }
  }, [users]);

  const saveWithToast = async (title: string, description: string) => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    toast.success(title, { description });
    setIsSaving(false);
  };

  const handleProfileSave = async () => {
    await saveWithToast("Profile updated", "Your account details were saved.");
  };

  const handleSecuritySave = async () => {
    if (securityData.newPassword !== securityData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (securityData.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    await saveWithToast("Password updated", "Security settings were updated.");
    setSecurityData({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  const handleNotificationsSave = async () => {
    await saveWithToast("Preferences saved", "Notification settings updated.");
  };

  const handleSystemSave = async () => {
    await saveWithToast("System settings updated", "Configuration saved.");
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Lock },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "system", label: "System", icon: Database },
  ] as const;

  const Toggle = ({
    checked,
    onChange,
  }: {
    checked: boolean;
    onChange: () => void;
  }) => (
    <button
      onClick={onChange}
      className={cn(
        "relative h-7 w-12 rounded-full transition",
        checked ? "bg-primary" : "bg-muted"
      )}
      type="button"
    >
      <span
        className={cn(
          "absolute top-1 size-5 rounded-full bg-white transition-all",
          checked ? "left-6" : "left-1"
        )}
      />
    </button>
  );

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 pb-16 sm:px-6 lg:px-8">
      <PageTitle
        eyebrow="Admin"
        title="Settings"
        subtitle="Manage account, security, notifications, and system preferences."
      />

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <aside className="space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-sm transition",
                  active
                    ? "border-primary/20 bg-primary/10 text-primary"
                    : "border-border/70 bg-card/70 text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="size-4" />
                {tab.label}
              </button>
            );
          })}
        </aside>

        <section className="rounded-3xl border border-border/70 bg-card/80 p-6 shadow-sm sm:p-8">
          {activeTab === "profile" ? (
            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
                  Profile settings
                </h2>
                <p className="text-sm text-muted-foreground">
                  Update your name and email address.
                </p>
              </div>

              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full name</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) =>
                      setProfileData({ ...profileData, name: e.target.value })
                    }
                    className="h-11 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) =>
                        setProfileData({ ...profileData, email: e.target.value })
                      }
                      className="h-11 rounded-xl pl-10"
                    />
                  </div>
                </div>

                <div className="inline-flex items-center gap-2 rounded-xl border border-amber-300 bg-amber-100 px-3 py-2 text-sm text-amber-800">
                  <AlertCircle className="size-4" />
                  Role: Administrator
                </div>
              </div>

              <Button onClick={handleProfileSave} disabled={isSaving} className="rounded-xl">
                <Save className="size-4" />
                {isSaving ? "Saving..." : "Save changes"}
              </Button>
            </div>
          ) : null}

          {activeTab === "security" ? (
            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
                  Security settings
                </h2>
                <p className="text-sm text-muted-foreground">
                  Change your password and account access settings.
                </p>
              </div>

              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={securityData.currentPassword}
                    onChange={(e) =>
                      setSecurityData({
                        ...securityData,
                        currentPassword: e.target.value,
                      })
                    }
                    className="h-11 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={securityData.newPassword}
                    onChange={(e) =>
                      setSecurityData({ ...securityData, newPassword: e.target.value })
                    }
                    className="h-11 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm new password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={securityData.confirmPassword}
                    onChange={(e) =>
                      setSecurityData({
                        ...securityData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="h-11 rounded-xl"
                  />
                </div>

                <div className="inline-flex items-start gap-2 rounded-xl border border-border bg-background/80 px-3 py-2 text-sm text-muted-foreground">
                  <Shield className="mt-0.5 size-4 text-primary" />
                  Use at least 8 characters and include a mix of letters and numbers.
                </div>
              </div>

              <Button onClick={handleSecuritySave} disabled={isSaving} className="rounded-xl">
                <Save className="size-4" />
                {isSaving ? "Updating..." : "Update password"}
              </Button>
            </div>
          ) : null}

          {activeTab === "notifications" ? (
            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
                  Notification preferences
                </h2>
                <p className="text-sm text-muted-foreground">
                  Choose what updates you receive from the platform.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  {
                    key: "emailNotifications",
                    label: "Email notifications",
                    description: "Receive platform alerts via email",
                  },
                  {
                    key: "newRequests",
                    label: "New blood requests",
                    description: "Alerts for incoming requests",
                  },
                  {
                    key: "statusUpdates",
                    label: "Status updates",
                    description: "Changes to request and donation states",
                  },
                  {
                    key: "dailyReports",
                    label: "Daily reports",
                    description: "Daily operational summary",
                  },
                  {
                    key: "weeklyReports",
                    label: "Weekly reports",
                    description: "Weekly performance digest",
                  },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between rounded-xl border border-border/70 bg-background/70 p-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                    <Toggle
                      checked={
                        notificationSettings[
                          item.key as keyof typeof notificationSettings
                        ]
                      }
                      onChange={() =>
                        setNotificationSettings({
                          ...notificationSettings,
                          [item.key]:
                            !notificationSettings[
                              item.key as keyof typeof notificationSettings
                            ],
                        })
                      }
                    />
                  </div>
                ))}
              </div>

              <Button onClick={handleNotificationsSave} disabled={isSaving} className="rounded-xl">
                <Save className="size-4" />
                {isSaving ? "Saving..." : "Save preferences"}
              </Button>
            </div>
          ) : null}

          {activeTab === "system" ? (
            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
                  System configuration
                </h2>
                <p className="text-sm text-muted-foreground">
                  Update global platform behavior.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  {
                    key: "requireApproval",
                    label: "Require admin approval",
                    description: "Requests must be approved before donors can see them",
                  },
                  {
                    key: "autoApproveRequests",
                    label: "Auto-approve requests",
                    description: "Automatically approve all new requests",
                  },
                  {
                    key: "maintenanceMode",
                    label: "Maintenance mode",
                    description: "Temporarily restrict user access",
                  },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between rounded-xl border border-border/70 bg-background/70 p-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                    <Toggle
                      checked={systemSettings[item.key as keyof typeof systemSettings]}
                      onChange={() =>
                        setSystemSettings({
                          ...systemSettings,
                          [item.key]: !systemSettings[item.key as keyof typeof systemSettings],
                        })
                      }
                    />
                  </div>
                ))}
              </div>

              <div className="inline-flex items-start gap-2 rounded-xl border border-rose-300 bg-rose-100 px-3 py-2 text-sm text-rose-800">
                <AlertCircle className="mt-0.5 size-4" />
                Changes here affect all users. Apply carefully.
              </div>

              <Button onClick={handleSystemSave} disabled={isSaving} className="rounded-xl">
                <Save className="size-4" />
                {isSaving ? "Saving..." : "Save configuration"}
              </Button>
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
};

export default AdminSettingsPage;
