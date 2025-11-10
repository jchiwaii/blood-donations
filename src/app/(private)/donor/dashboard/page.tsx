import { currentUser } from "@/server-actions/users";
import { redirect } from "next/navigation";
import React from "react";
import ApprovedBloodRequests from "./_components/approved-blood-requests";

async function DonorDashboard() {
  const user = await currentUser();

  if (!user) {
    redirect("/");
  }

  if (user.role !== "donor") {
    redirect("/");
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Donor Dashboard
          </h1>
          <p className="text-muted-foreground">Welcome back, {user.name}!</p>
        </div>

        {/* Approved Blood Requests */}
        <ApprovedBloodRequests />
      </div>
    </div>
  );
}

export default DonorDashboard;
