import { useState } from "react";
import { UserIcon, GroupIcon, HomeIcon, AcademicCapIcon } from "../../icons";
import ProfessorTable from "./ProfessorTable";
import SectionTable from "./SectionTable";

const metrics = [
  { id: 1, icon: UserIcon, value: "148", label: "Professors" },
  { id: 2, icon: GroupIcon, value: "180", label: "Sections" },
  { id: 3, icon: HomeIcon, value: "80", label: "Rooms", disabled: true },
  { id: 4, icon: AcademicCapIcon, value: "340", label: "Courses", disabled: true },
];

export default function DashboardMetrics() {
  const [selectedMetric, setSelectedMetric] = useState<number | null>(null);

  return (
    <div className="p-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <div key={metric.id} className="w-full">
            <div
              className={`flex items-center justify-between p-5 border rounded-2xl cursor-pointer transition-all 
                ${metric.disabled ? " cursor-not-allowed" : "hover:bg-green-700"} 
                ${selectedMetric === metric.id ? "bg-green-600 text-white" : "bg-white text-gray-800"}`}
              onClick={() => !metric.disabled && setSelectedMetric(metric.id)}
            >
              <div className="flex items-center">
                {/* Icon */}
                <div className={`flex items-center justify-center w-12 h-12 rounded-xl transition-all
                  ${selectedMetric === metric.id ? "bg-green-600" : "bg-gray-100"}`}>
                  <metric.icon className={`w-10 h-10 transition-all ${selectedMetric === metric.id ? "text-white" : "text-gray-800"}`} />
                </div>

                {/* Value and Label */}
                <div className="ml-4">
                  <h4 className={`text-lg font-bold transition-all ${selectedMetric === metric.id ? "text-white" : "text-gray-800"}`}>
                    {metric.value}
                  </h4>
                  <span className={`text-sm transition-all ${selectedMetric === metric.id ? "text-white" : "text-gray-500"}`}>
                    {metric.label}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dropdowns and Table */}
      {selectedMetric && (
        <div className="mt-6 p-6 border border-gray-200 rounded-lg bg-white">
          {/* Table based on the selected metric */}
          {selectedMetric === 1 && <ProfessorTable />}
          {selectedMetric === 2 && <SectionTable />}
        </div>
      )}
    </div>
  );
}
