import { currentUser } from "@/server-actions/users";
import { redirect } from "next/navigation";
import React from "react";
import BloodRequestsList from "./_components/blood-requests-list";

async function RecipientDashboard() {
  const user = await currentUser();

  if (!user) {
    redirect("/");
  }

  if (user.role !== "recipient") {
    redirect("/");
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Recipient Dashboard
          </h1>
          <p className="text-muted-foreground">Welcome back, {user.name}!</p>
        </div>

        {/* Blood Requests List */}
        <BloodRequestsList />
      </div>
    </div>
  );
}

export default RecipientDashboard;
