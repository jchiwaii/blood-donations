import React from "react";

import PageTitle from "@/components/ui/page-title";
import DashboardStats from "./_components/dashboard-stats";
import BloodRequestsManagement from "./_components/blood-requests-management";

const AdminDashboard = () => {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 px-4 pb-16 sm:px-6 lg:px-8">
      <PageTitle
        eyebrow="Admin"
        title="Operations Dashboard"
        subtitle="Monitor requests, donation flow, and user activity from one control center."
      />

      <DashboardStats />
      <BloodRequestsManagement />
    </div>
  );
};

export default AdminDashboard;
