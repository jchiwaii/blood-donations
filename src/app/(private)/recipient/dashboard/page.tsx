import { currentUser } from "@/server-actions/users";
import { redirect } from "next/navigation";
import React from "react";

async function RecipientDashboard() {
  const user = await currentUser();

  if (!user) {
    redirect("/");
  }

  if (user.role !== "recipient") {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Recipient Dashboard
          </h1>
          <p className="text-muted-foreground">Welcome back, {user.name}!</p>
        </div>

        {/* User Profile Card */}
        <div className="bg-card border border-border rounded-lg p-6 shadow-sm max-w-md">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Your Profile
          </h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Full Name</p>
              <p className="text-base font-medium text-foreground">
                {user.name}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email Address</p>
              <p className="text-base font-medium text-foreground">
                {user.email}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Role</p>
              <p className="text-base font-medium text-foreground capitalize">
                {user.role}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">User ID</p>
              <p className="text-base font-medium text-foreground">
                #{user.id}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecipientDashboard;
