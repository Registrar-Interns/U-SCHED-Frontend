import { useState, useEffect } from "react";
import { UserIcon, GroupIcon, HomeIcon, AcademicCapIcon } from "../../icons";
import SubAdminProfessorTable from "./SubAdminProfessorTable";
import SubAdminSectionTable from "./SubAdminSectionTable";
import SubAdminCoursesTable from "./SubAdminCoursesTable";

// Department branding map (matching the one from AppHeader)
const departmentBranding: Record<string, { headerColor: string; collegeName: string; logo: string }> = {
  CCS: {
    headerColor: "bg-orange-500",
    collegeName: "College of Computing Studies",
    logo: "/images/ccs-logo.jpg",
  },
  COE: {
    headerColor: "bg-red-600",
    collegeName: "College of Engineering",
    logo: "/images/coe-logo.jpg",
  },
  CAS: {
    headerColor: "bg-red-800",
    collegeName: "College of Arts and Sciences",
    logo: "/images/cas-logo.jpg",
  },
  CHAS: {
    headerColor: "bg-green-500",
    collegeName: "College of Humanities and Social Sciences",
    logo: "/images/chas-logo.jpg",
  },
  COED: {
    headerColor: "bg-blue-500",
    collegeName: "College of Education",
    logo: "/images/coed-logo.jpg",
  },
  CBAA: {
    headerColor: "bg-yellow-500",
    collegeName: "College of Business and Accountancy",
    logo: "/images/cbaa-logo.png",
  },
  default: {
    headerColor: "bg-green-600",
    collegeName: "U-SCHED",
    logo: "/images/usched-logo.png",
  },
};

interface SubAdminDashboardMetricsProps {
  department: string;
}

export default function SubAdminDashboardMetrics({ department }: SubAdminDashboardMetricsProps) {
  const [selectedMetric, setSelectedMetric] = useState<number | null>(null);
  const [professorCount, setProfessorCount] = useState<number | string>("...");
  const [sectionCount, setSectionCount] = useState<number | string>("...");
  const [courseCount, setCourseCount] = useState<number | string>("...");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get the department's branding colors
  const deptKey = department.toUpperCase();
  const headerColor = departmentBranding[deptKey]?.headerColor || departmentBranding.default.headerColor;
  const hoverColor = headerColor.replace('bg-', 'hover:bg-');
  const activeColor = headerColor.replace('bg-', 'bg-');

  useEffect(() => {
    // Fetch counts for the specific department
    const fetchCounts = async () => {
      try {
        setLoading(true);
        
        // Fetch professors and filter by department
        const professorsResponse = await fetch(`http://localhost:3001/api/professors`);
        if (!professorsResponse.ok) {
          throw new Error(`API Error: ${professorsResponse.status}`);
        }
        
        const allProfessors = await professorsResponse.json();
        const departmentProfessors = allProfessors.filter(
          (professor: { department: string }) => professor.department === department
        );
        
        setProfessorCount(departmentProfessors.length);
        
        // For now, we'll use a placeholder for sections
        // In a real implementation, you would fetch this from the API
        setSectionCount("45");
        
        // Fetch total courses count for this department
        try {
          const coursesResponse = await fetch(`http://localhost:3001/api/curriculum/courses/count?department=${department}`);
          if (coursesResponse.ok) {
            const coursesData = await coursesResponse.json();
            setCourseCount(coursesData.count);
          } else {
            // Fallback to placeholder if API fails
            setCourseCount("85");
          }
        } catch (err) {
          console.error("Failed to fetch courses count:", err);
          setCourseCount("85");
        }
        
      } catch (err) {
        console.error("Failed to fetch counts:", err);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, [department]);

  // Dynamic metrics based on fetched data
  const metrics = [
    { id: 1, icon: UserIcon, value: professorCount.toString(), label: "Professors" },
    { id: 2, icon: GroupIcon, value: sectionCount.toString(), label: "Sections" },
    { id: 3, icon: HomeIcon, value: "25", label: "Rooms", disabled: true },
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
                ${metric.disabled ? "cursor-not-allowed opacity-50" : `${hoverColor} hover:shadow-lg`} 
                ${selectedMetric === metric.id ? `${activeColor} text-white shadow-lg` : "bg-white text-gray-800"}`}
              onClick={() => !metric.disabled && setSelectedMetric(metric.id)}
            >
              <div className="flex items-center">
                {/* Icon */}
                <div className={`flex items-center justify-center w-12 h-12 rounded-xl transition-all
                  ${selectedMetric === metric.id ? "bg-white/20" : "bg-gray-100"}`}>
                  <metric.icon className={`w-10 h-10 transition-all ${selectedMetric === metric.id ? "text-white" : "text-gray-800"}`} />
                </div>

                {/* Value and Label */}
                <div className="ml-4">
                  <h4 className={`text-lg font-bold transition-all ${selectedMetric === metric.id ? "text-white" : "text-gray-800"}`}>
                    {loading ? "..." : metric.value}
                  </h4>
                  <span className={`text-sm transition-all ${selectedMetric === metric.id ? "text-white/80" : "text-gray-500"}`}>
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
          {selectedMetric === 1 && <SubAdminProfessorTable department={department} />}
          {selectedMetric === 2 && <SubAdminSectionTable department={department} />}
          {selectedMetric === 4 && <SubAdminCoursesTable department={department} />}
        </div>
      )}
    </div>
  );
} 