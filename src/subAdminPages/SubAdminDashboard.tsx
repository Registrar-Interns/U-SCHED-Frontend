import React from "react";

export default function SubAdminDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Sub-Admin Dashboard</h1>
      <p>Welcome, Dean/Department Chair! Here you can access:</p>
      <ul className="list-disc ml-6 mt-4">
        <li>Dashboard overview</li>
        <li>Manage Professors</li>
        <li>Schedule</li>
        <li>Room Plotting</li>
        <li>Curriculum</li>
        <li>Section management</li>
      </ul>
      {/* You can include more sub-admin specific components or links here */}
    </div>
  );
}