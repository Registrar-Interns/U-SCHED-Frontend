import { useState, useEffect, useMemo } from "react";
import PaginatedTable from "../common/PaginatedTable";

// Define the Course interface
interface Course {
  id: number;
  college_id: number;
  program_id: number;
  year: string;
  semester: string;
  course_code: string;
  course_title: string;
  lec: number;
  lab: number;
  total: number;
  pre_co_requisite: string | null;
  is_gened: number;
}

// Define the formatted data interface with index signature
interface FormattedCourseData {
  [key: string]: string | number | Course;
  "Course Code": string;
  "Course Title": string;
  "Year": string;
  "Semester": string;
  "Lec": string;
  "Lab": string;
  "Total Units": string;
  "Pre/Co-Requisite": string;
  originalCourse: Course;
}

const columns = ["Course Code", "Course Title", "Year", "Semester", "Lec", "Lab", "Total Units", "Pre/Co-Requisite"];

export default function CoursesTable() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("CCS"); // Default to CCS or any other default

  useEffect(() => {
    // Fetch courses from the API
    const fetchCourses = async () => {
      try {
        setLoading(true);
        
        // Fetch courses for the selected department
        const response = await fetch(`http://localhost:3001/api/curriculum/curriculum_courses?department=${selectedDepartment}`);
        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }
        
        const data = await response.json();
        setCourses(data);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
        setError("Failed to load courses. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [selectedDepartment]);

  // Format the data for the table
  const formattedData = useMemo(() => {
    return courses.map(course => ({
      "Course Code": course.course_code || "N/A",
      "Course Title": course.course_title || "N/A",
      "Year": course.year || "N/A",
      "Semester": course.semester || "N/A",
      "Lec": course.lec?.toString() || "0",
      "Lab": course.lab?.toString() || "0",
      "Total Units": course.total?.toString() || "0",
      "Pre/Co-Requisite": course.pre_co_requisite || "None",
      originalCourse: course
    }));
  }, [courses]);

  // Custom render function for cells
  const renderCell = (row: FormattedCourseData, column: string) => {
    const value = row[column];
    return typeof value === 'string' ? value : "N/A";
  };

  // Departments for dropdown - fetch these from the API in a real implementation
  const departments = [
    { id: "CCS", name: "College of Computer Studies" },
    { id: "COE", name: "College of Engineering" },
    { id: "CBAA", name: "College of Business Administration" },
    { id: "CAS", name: "College of Arts and Sciences" },
    { id: "COED", name: "College of Education" },
    { id: "CHAS", name: "College of Health and Allied Sciences" },

    // Add more departments as needed
  ];

  if (loading) {
    return <div className="p-4 text-center">Loading courses...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Courses</h2>
        <div className="flex items-center">
          <span className="mr-2 text-sm text-gray-700">Department:</span>
          <select
            className="border border-gray-300 rounded-lg p-2 text-sm w-48"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
          >
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      {courses.length === 0 ? (
        <div className="p-4 text-center text-gray-500">
          No courses found for this department.
        </div>
      ) : (
        <PaginatedTable 
          columns={columns} 
          data={formattedData} 
          renderCell={renderCell}
        />
      )}
    </div>
  );
} 