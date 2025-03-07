import React from "react";
import PageMeta from "../../components/common/PageMeta";
import DashboardMetrics from "../../components/dashboard-components/DashboardMetrics";
import SubAdminDashboard from "../../subAdminPages/SubAdminDashboard";

export default function Home() {
  // Retrieve user info from localStorage
  const userType = localStorage.getItem("userType"); // e.g., "ADMIN" or "PROFESSOR"
  const position = localStorage.getItem("position");   // e.g., "Dean", "Department Chair", or other

  // If the user is a professor and is either a Dean or Department Chair,
  // render the sub-admin dashboard; otherwise, render the admin dashboard.
  if (userType === "PROFESSOR" && (position === "Dean" || position === "Department Chair")) {
    return <SubAdminDashboard />;
  }

  return (
    <>
      <PageMeta
        title="Dashboard | iUCSchedProMax+"
        description="Dashboard page for iUCSchedProMax+"
      />
      <DashboardMetrics />
    </>
  );
}