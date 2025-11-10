import React from "react";
import PageTitle from "@/components/ui/page-title";
import DashboardStats from "./_components/dashboard-stats";
import BloodRequestsManagement from "./_components/blood-requests-management";

const AdminDashboard = () => {
  return (
    <div className="relative mx-auto w-full max-w-7xl px-4 pb-20 pt-10 sm:px-6 lg:px-8">
      <div className="space-y-8 lg:space-y-10">
        <PageTitle title="Admin Dashboard" />
        <p className="max-w-3xl text-sm text-white/65">
          Manage blood requests, monitor platform health, and oversee donor and
          recipient activity from a single view.
        </p>
        <DashboardStats />
        <BloodRequestsManagement />
      </div>
    </div>
  );
};

export default AdminDashboard;
