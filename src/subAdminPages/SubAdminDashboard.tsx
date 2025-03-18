import React, { useEffect, useState } from "react";
import SubAdminDashboardMetrics from "../subAdminComponents/dashboard/SubAdminDashboardMetrics";
import PageMeta from "../components/common/PageMeta";

export default function SubAdminDashboard() {
  const [userInfo, setUserInfo] = useState({
    name: "",
    position: localStorage.getItem("position") || "Dean/Department Chair",
    department: localStorage.getItem("department") || "CCS"
  });

  // When building a real application, you would fetch the user info from the API
  useEffect(() => {
    // Simulate fetching user info
    const userId = localStorage.getItem("userId");
    if (userId) {
      // This would be a real API call in production
      setTimeout(() => {
        setUserInfo({
          name: localStorage.getItem("fullName") || "Dr. John Smith",
          position: localStorage.getItem("position") || "Dean/Department Chair",
          department: localStorage.getItem("department") || "CCS"
        });
      }, 300);
    }
  }, []);

  return (
    <>
      <PageMeta
        title="Sub-Admin Dashboard | iUCSchedProMax+"
        description="Sub-Admin Dashboard page for iUCSchedProMax+"
      />
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Welcome, {userInfo.name || userInfo.position}</h1>
          <p className="text-gray-600">
            {userInfo.position} - {userInfo.department}
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Here you can view and manage department-specific data
          </p>
        </div>
        
        {/* Include the dashboard metrics with the department from localStorage */}
        <SubAdminDashboardMetrics department={userInfo.department} />
      </div>
    </>
  );
}