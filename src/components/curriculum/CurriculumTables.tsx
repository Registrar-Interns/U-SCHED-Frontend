import React from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table";

// The shape of each course
interface Course {
  id: number;
  department: string;
  program: string;
  year: string;
  semester: string;
  course_code: string;
  course_title: string;
  lec: number;
  lab: number;
  total: number;
  pre_co_requisite: string;
  is_gened?: number;
}

interface CurriculumTablesProps {
  year: string;          // current selected year
  courses: Course[];     // fetched courses
  department: string;    // department to base the header color on
}

// Branding map (can be moved to a shared file if needed)
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
    logo: "/images/cbaa-logo.jpg",
  },
  default: {
    headerColor: "bg-green-600",
    collegeName: "U-SCHED",
    logo: "/images/usched-logo.png",
  },
};

const CurriculumTables: React.FC<CurriculumTablesProps> = ({ year, courses, department }) => {
  // Determine header color based on the provided department prop.
  // Ensure that the department key is uppercase to match the branding map.
  const deptKey = department.toUpperCase();
  const headerColor = departmentBranding[deptKey]?.headerColor || departmentBranding.default.headerColor;
  const headerCellClass = `px-5 py-3 font-medium text-white ${headerColor} border border-gray-300`;

  // If year is "ELECTIVES", group by distinct semester strings
  if (year === "Electives") {
    const distinctElectives = Array.from(new Set(courses.map((c) => c.semester)));
  
    return (
      <div className="space-y-6">
        {distinctElectives.map((electiveName) => {
          const electiveCourses = courses.filter(
            (c) => c.semester === electiveName
          );
  
          return (
            <div
              key={electiveName}
              className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]"
            >
              <div className="max-w-full overflow-x-auto">
                <div className="min-w-[900px]">
                  <Table>
                    <TableHeader>
                      {/* Elective group name row */}
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          isHeader
                          className={headerCellClass}
                        >
                          {electiveName}
                        </TableCell>
                      </TableRow>
  
                      {/* Two-row header */}
                      <TableRow>
                        <TableCell
                          isHeader
                          rowSpan={2}
                          className="border border-gray-300 px-3 py-2 w-24 font-medium text-gray-700 dark:text-gray-300"
                        >
                          Course Code
                        </TableCell>
                        <TableCell
                          isHeader
                          rowSpan={2}
                          className="border border-gray-300 px-3 py-2 w-64 font-medium text-gray-700 dark:text-gray-300"
                        >
                          Course Title
                        </TableCell>
                        <TableCell
                          isHeader
                          colSpan={3}
                          className="border border-gray-300 px-3 py-2 text-center font-medium text-gray-700 dark:text-gray-300"
                        >
                          Units
                        </TableCell>
                        <TableCell
                          isHeader
                          rowSpan={2}
                          className="border border-gray-300 px-3 py-2 w-32 font-medium text-gray-700 dark:text-gray-300"
                        >
                          Pre/Co-Requisite
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          isHeader
                          className="border border-gray-300 px-3 py-2 w-16 font-medium text-gray-700 dark:text-gray-300"
                        >
                          Lec
                        </TableCell>
                        <TableCell
                          isHeader
                          className="border border-gray-300 px-3 py-2 w-16 font-medium text-gray-700 dark:text-gray-300"
                        >
                          Lab
                        </TableCell>
                        <TableCell
                          isHeader
                          className="border border-gray-300 px-3 py-2 w-16 font-medium text-gray-700 dark:text-gray-300"
                        >
                          Total
                        </TableCell>
                      </TableRow>
                    </TableHeader>
  
                    <TableBody>
                      {electiveCourses.length > 0 ? (
                        electiveCourses.map((course) => (
                          <TableRow key={course.id}>
                            <TableCell className="border border-gray-300 px-3 py-2 w-24 dark:text-gray-300">
                              {course.course_code}
                            </TableCell>
                            <TableCell className="border border-gray-300 px-3 py-2 w-64 dark:text-gray-300">
                              {course.course_title}
                            </TableCell>
                            <TableCell className="border border-gray-300 px-3 py-2 w-16 dark:text-gray-300">
                              {course.lec}
                            </TableCell>
                            <TableCell className="border border-gray-300 px-3 py-2 w-16 dark:text-gray-300">
                              {course.lab}
                            </TableCell>
                            <TableCell className="border border-gray-300 px-3 py-2 w-16 dark:text-gray-300">
                              {course.total}
                            </TableCell>
                            <TableCell className="border border-gray-300 px-3 py-2 w-32 dark:text-gray-300">
                              {course.pre_co_requisite}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            className="border border-gray-300 px-3 py-2 text-center"
                          >
                            No courses available.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Otherwise, show normal semesters
  const semesters = ["First Semester", "Second Semester", "Summer"];
  const coursesBySemester = semesters.reduce((acc, sem) => {
    acc[sem] = courses.filter((course) => course.semester === sem);
    return acc;
  }, {} as Record<string, Course[]>);

  return (
    <div className="space-y-6">
      {semesters.map((semester) => (
        <div
          key={semester}
          className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]"
        >
          <div className="max-w-full overflow-x-auto">
            <div className="min-w-[900px]">
              <Table>
              <TableHeader>
                {/* Semester Name row */}
                <TableRow>
                  <TableCell
                    colSpan={6}
                    isHeader
                    className={headerCellClass}
                  >
                    {semester}
                  </TableCell>
                </TableRow>

                {/* The two-row header for columns */}
                <TableRow>
                  <TableCell
                    isHeader
                    rowSpan={2}
                    className="border border-gray-300 px-3 py-2 w-24 font-medium text-gray-700 dark:text-gray-300"
                  >
                    Course Code
                  </TableCell>
                  <TableCell
                    isHeader
                    rowSpan={2}
                    className="border border-gray-300 px-3 py-2 w-64 font-medium text-gray-700 dark:text-gray-300"
                  >
                    Course Title
                  </TableCell>
                  <TableCell
                    isHeader
                    colSpan={3}
                    className="border border-gray-300 px-3 py-2 text-center font-medium text-gray-700 dark:text-gray-300"
                  >
                    Units
                  </TableCell>
                  <TableCell
                    isHeader
                    rowSpan={2}
                    className="border border-gray-300 px-3 py-2 w-32 font-medium text-gray-700 dark:text-gray-300"
                  >
                    Pre/Co-Requisite
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    isHeader
                    className="border border-gray-300 px-3 py-2 w-16 font-medium text-gray-700 dark:text-gray-300"
                  >
                    Lec
                  </TableCell>
                  <TableCell
                    isHeader
                    className="border border-gray-300 px-3 py-2 w-16 font-medium text-gray-700 dark:text-gray-300"
                  >
                    Lab
                  </TableCell>
                  <TableCell
                    isHeader
                    className="border border-gray-300 px-3 py-2 w-16 font-medium text-gray-700 dark:text-gray-300"
                  >
                    Total
                  </TableCell>
                </TableRow>
            </TableHeader>
            <TableBody>
              {coursesBySemester[semester].length > 0 ? (
                coursesBySemester[semester].map((course) => (
                  <TableRow key={course.id}>
                    <TableCell className="border border-gray-300 px-3 py-2 w-24 dark:text-gray-300">
                      {course.course_code}
                    </TableCell>
                    <TableCell className="border border-gray-300 px-3 py-2 w-64 dark:text-gray-300">
                      {course.course_title}
                    </TableCell>
                    <TableCell className="border border-gray-300 px-3 py-2 w-16 dark:text-gray-300">
                      {course.lec}
                    </TableCell>
                    <TableCell className="border border-gray-300 px-3 py-2 w-16 dark:text-gray-300">
                      {course.lab}
                    </TableCell>
                    <TableCell className="border border-gray-300 px-3 py-2 w-16 dark:text-gray-300">
                      {course.total}
                    </TableCell>
                    <TableCell className="border border-gray-300 px-3 py-2 w-32 dark:text-gray-300">
                      {course.pre_co_requisite}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="border border-gray-300 px-3 py-2 text-center">
                    No courses available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CurriculumTables;
