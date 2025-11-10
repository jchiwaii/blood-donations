"use client";

import React from "react";
import PageTitle from "@/components/ui/page-title";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useUsersStore, { IUserStore } from "@/store/users-store";
import {
  Bell,
  Lock,
  User,
  Mail,
  Save,
  Settings as SettingsIcon,
  Shield,
  Database,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const AdminSettingsPage = () => {
  const { users } = useUsersStore() as IUserStore;
  const [activeTab, setActiveTab] = React.useState<
    "profile" | "security" | "notifications" | "system"
  >("profile");
  const [isSaving, setIsSaving] = React.useState(false);

  // Profile settings state
  const [profileData, setProfileData] = React.useState({
    name: users?.name || "",
    email: users?.email || "",
  });

  // Security settings state
  const [securityData, setSecurityData] = React.useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Notification settings state
  const [notificationSettings, setNotificationSettings] = React.useState({
    emailNotifications: true,
    newRequests: true,
    statusUpdates: true,
    dailyReports: false,
    weeklyReports: true,
  });

  // System settings state
  const [systemSettings, setSystemSettings] = React.useState({
    autoApproveRequests: false,
    maintenanceMode: false,
    requireApproval: true,
  });

  React.useEffect(() => {
    if (users) {
      setProfileData({
        name: users.name,
        email: users.email,
      });
    }
  }, [users]);

  const handleProfileSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success("Profile updated", {
      description: "Your profile has been updated successfully.",
    });
    setIsSaving(false);
  };

  const handleSecuritySave = async () => {
    if (securityData.newPassword !== securityData.confirmPassword) {
      toast.error("Passwords don't match", {
        description: "New password and confirm password must match.",
      });
      return;
    }

    if (securityData.newPassword.length < 8) {
      toast.error("Password too short", {
        description: "Password must be at least 8 characters long.",
      });
      return;
    }

    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success("Password updated", {
      description: "Your password has been changed successfully.",
    });
    setSecurityData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setIsSaving(false);
  };

  const handleNotificationsSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success("Preferences saved", {
      description: "Your notification preferences have been updated.",
    });
    setIsSaving(false);
  };

  const handleSystemSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success("System settings updated", {
      description: "System configuration has been updated successfully.",
    });
    setIsSaving(false);
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Lock },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "system", label: "System", icon: Database },
  ] as const;

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 px-4 pb-16 sm:px-6 lg:px-8">
      <PageTitle title="Settings" />
      <p className="text-sm text-white/60">
        Manage your account settings and preferences
      </p>

      <div className="grid gap-6 lg:grid-cols-[280px,1fr]">
        {/* Sidebar Navigation */}
        <div className="space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left transition hover:bg-white/10",
                  activeTab === tab.id &&
                    "border-white/30 bg-linear-to-r from-rose-500/70 via-fuchsia-500/60 to-indigo-500/70 text-white shadow-lg"
                )}
              >
                <Icon className="size-5" />
                <span className="font-medium text-white">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur lg:p-8">
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-300">
                  <User className="size-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-white">
                    Profile Settings
                  </h2>
                  <p className="text-sm text-white/60">
                    Update your personal information
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) =>
                      setProfileData({ ...profileData, name: e.target.value })
                    }
                    className="h-12 rounded-xl border-white/10 bg-slate-900/60 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-white/50" />
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          email: e.target.value,
                        })
                      }
                      className="h-12 rounded-xl border-white/10 bg-slate-900/60 pl-12 text-white"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-xl border border-amber-400/40 bg-amber-500/10 p-4 text-amber-200">
                  <AlertCircle className="size-5 shrink-0" />
                  <p className="text-sm">
                    Role: <span className="font-semibold">Administrator</span>
                  </p>
                </div>
              </div>

              <Button
                onClick={handleProfileSave}
                disabled={isSaving}
                className="gap-2 rounded-xl bg-linear-to-r from-rose-500 via-fuchsia-500 to-indigo-500 px-6"
              >
                <Save className="size-4" />
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-xl bg-rose-500/20 text-rose-300">
                  <Lock className="size-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-white">
                    Security Settings
                  </h2>
                  <p className="text-sm text-white/60">
                    Manage your password and security preferences
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword" className="text-white">
                    Current Password
                  </Label>
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
                    className="h-12 rounded-xl border-white/10 bg-slate-900/60 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-white">
                    New Password
                  </Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={securityData.newPassword}
                    onChange={(e) =>
                      setSecurityData({
                        ...securityData,
                        newPassword: e.target.value,
                      })
                    }
                    className="h-12 rounded-xl border-white/10 bg-slate-900/60 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-white">
                    Confirm New Password
                  </Label>
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
                    className="h-12 rounded-xl border-white/10 bg-slate-900/60 text-white"
                  />
                </div>

                <div className="flex items-center gap-2 rounded-xl border border-sky-400/40 bg-sky-500/10 p-4 text-sky-200">
                  <Shield className="size-5 shrink-0" />
                  <p className="text-sm">
                    Use a strong password with at least 8 characters, including
                    uppercase, lowercase, numbers, and symbols.
                  </p>
                </div>
              </div>

              <Button
                onClick={handleSecuritySave}
                disabled={isSaving}
                className="gap-2 rounded-xl bg-linear-to-r from-rose-500 via-fuchsia-500 to-indigo-500 px-6"
              >
                <Save className="size-4" />
                {isSaving ? "Updating..." : "Update Password"}
              </Button>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-xl bg-fuchsia-500/20 text-fuchsia-300">
                  <Bell className="size-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-white">
                    Notification Preferences
                  </h2>
                  <p className="text-sm text-white/60">
                    Choose what notifications you want to receive
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  {
                    key: "emailNotifications",
                    label: "Email Notifications",
                    description: "Receive notifications via email",
                  },
                  {
                    key: "newRequests",
                    label: "New Blood Requests",
                    description: "Get notified when new requests are submitted",
                  },
                  {
                    key: "statusUpdates",
                    label: "Status Updates",
                    description:
                      "Get notified when request statuses change",
                  },
                  {
                    key: "dailyReports",
                    label: "Daily Reports",
                    description: "Receive daily summary reports",
                  },
                  {
                    key: "weeklyReports",
                    label: "Weekly Reports",
                    description: "Receive weekly summary reports",
                  },
                ].map((setting) => (
                  <div
                    key={setting.key}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4"
                  >
                    <div>
                      <p className="font-medium text-white">{setting.label}</p>
                      <p className="text-sm text-white/60">
                        {setting.description}
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setNotificationSettings({
                          ...notificationSettings,
                          [setting.key]:
                            !notificationSettings[
                              setting.key as keyof typeof notificationSettings
                            ],
                        })
                      }
                      className={cn(
                        "relative h-7 w-12 rounded-full transition",
                        notificationSettings[
                          setting.key as keyof typeof notificationSettings
                        ]
                          ? "bg-emerald-500"
                          : "bg-white/20"
                      )}
                    >
                      <span
                        className={cn(
                          "absolute top-1 size-5 rounded-full bg-white transition-all",
                          notificationSettings[
                            setting.key as keyof typeof notificationSettings
                          ]
                            ? "left-6"
                            : "left-1"
                        )}
                      />
                    </button>
                  </div>
                ))}
              </div>

              <Button
                onClick={handleNotificationsSave}
                disabled={isSaving}
                className="gap-2 rounded-xl bg-linear-to-r from-rose-500 via-fuchsia-500 to-indigo-500 px-6"
              >
                <Save className="size-4" />
                {isSaving ? "Saving..." : "Save Preferences"}
              </Button>
            </div>
          )}

          {activeTab === "system" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-xl bg-amber-500/20 text-amber-300">
                  <Database className="size-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-white">
                    System Configuration
                  </h2>
                  <p className="text-sm text-white/60">
                    Configure system-wide settings
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  {
                    key: "requireApproval",
                    label: "Require Admin Approval",
                    description:
                      "Blood requests must be approved before being visible to donors",
                  },
                  {
                    key: "autoApproveRequests",
                    label: "Auto-Approve Requests",
                    description:
                      "Automatically approve all new blood requests (not recommended)",
                  },
                  {
                    key: "maintenanceMode",
                    label: "Maintenance Mode",
                    description:
                      "Put the system in maintenance mode (users cannot access)",
                  },
                ].map((setting) => (
                  <div
                    key={setting.key}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4"
                  >
                    <div>
                      <p className="font-medium text-white">{setting.label}</p>
                      <p className="text-sm text-white/60">
                        {setting.description}
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setSystemSettings({
                          ...systemSettings,
                          [setting.key]:
                            !systemSettings[
                              setting.key as keyof typeof systemSettings
                            ],
                        })
                      }
                      className={cn(
                        "relative h-7 w-12 rounded-full transition",
                        systemSettings[
                          setting.key as keyof typeof systemSettings
                        ]
                          ? "bg-emerald-500"
                          : "bg-white/20"
                      )}
                    >
                      <span
                        className={cn(
                          "absolute top-1 size-5 rounded-full bg-white transition-all",
                          systemSettings[
                            setting.key as keyof typeof systemSettings
                          ]
                            ? "left-6"
                            : "left-1"
                        )}
                      />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-rose-400/40 bg-rose-500/10 p-4 text-rose-200">
                <AlertCircle className="size-5 shrink-0" />
                <p className="text-sm">
                  Changes to system settings will affect all users. Use with
                  caution.
                </p>
              </div>

              <Button
                onClick={handleSystemSave}
                disabled={isSaving}
                className="gap-2 rounded-xl bg-linear-to-r from-rose-500 via-fuchsia-500 to-indigo-500 px-6"
              >
                <Save className="size-4" />
                {isSaving ? "Saving..." : "Save Configuration"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsPage;
