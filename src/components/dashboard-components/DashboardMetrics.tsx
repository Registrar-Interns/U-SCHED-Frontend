import { useState, useEffect } from "react";
import { UserIcon, GroupIcon, HomeIcon, AcademicCapIcon } from "../../icons";
import ProfessorTable from "./ProfessorTable";
import SectionTable from "./SectionTable";
import CoursesTable from "./CoursesTable";

export default function DashboardMetrics() {
  const [selectedMetric, setSelectedMetric] = useState<number | null>(null);
  const [professorCount, setProfessorCount] = useState<number | string>("...");
  const [sectionCount, setSectionCount] = useState<number | string>("...");
  const [courseCount, setCourseCount] = useState<number | string>("...");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch counts directly
    const fetchCounts = async () => {
      try {
        setLoading(true);
        
        // Fetch professors
        const professorsResponse = await fetch('http://localhost:3001/api/professors');
        if (!professorsResponse.ok) {
          throw new Error(`API Error: ${professorsResponse.status}`);
        }
        const professors = await professorsResponse.json();
        setProfessorCount(professors.length);
        
        // For now, we'll use a placeholder for sections
        // In a real implementation, you would fetch this from the API
        setSectionCount("180");
        
        // Fetch total courses count (all departments)
        try {
          const coursesResponse = await fetch('http://localhost:3001/api/curriculum/courses/count');
          if (coursesResponse.ok) {
            const coursesData = await coursesResponse.json();
            setCourseCount(coursesData.count);
          } else {
            // Fallback to placeholder if API fails
            setCourseCount("340");
          }
        } catch (err) {
          console.error("Failed to fetch courses count:", err);
          setCourseCount("340");
        }
        
      } catch (err) {
        console.error("Failed to fetch counts:", err);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  // Dynamic metrics based on fetched data
  const metrics = [
    { id: 1, icon: UserIcon, value: professorCount.toString(), label: "Professors" },
    { id: 2, icon: GroupIcon, value: sectionCount.toString(), label: "Sections" },
    { id: 3, icon: HomeIcon, value: "80", label: "Rooms", disabled: true },
    { id: 4, icon: AcademicCapIcon, value: courseCount.toString(), label: "Courses", disabled: false },
  ];

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
                    {loading ? "..." : metric.value}
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

      {/* Error message */}
      {error && (
        <div className="mt-6 p-4 border border-red-300 rounded-lg bg-red-50 text-red-700">
          {error}
        </div>
      )}

      {/* Dropdowns and Table */}
      {selectedMetric && !error && (
        <div className="mt-6 p-6 border border-gray-200 rounded-lg bg-white">
          {/* Table based on the selected metric */}
          {selectedMetric === 1 && <ProfessorTable />}
          {selectedMetric === 2 && <SectionTable />}
          {selectedMetric === 4 && <CoursesTable />}
        </div>
      )}
    </div>
  );
}
