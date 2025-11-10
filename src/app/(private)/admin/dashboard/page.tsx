import React from "react";
import PageTitle from "@/components/ui/page-title";
import DashboardStats from "./_components/dashboard-stats";
import BloodRequestsManagement from "./_components/blood-requests-management";

const AdminDashboard = () => {
  return (
    <div className="space-y-8">
      <PageTitle title="Admin Dashboard" />
      <p className="text-sm text-white/60">
        Manage blood requests and view statistics
      </p>
      <DashboardStats />
      <BloodRequestsManagement />
    </div>
  );
};

export default AdminDashboard;
