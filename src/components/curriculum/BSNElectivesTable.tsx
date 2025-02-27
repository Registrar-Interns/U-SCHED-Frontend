import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

// Same Course interface as your normal table
interface Course {
  id: number;
  department: string;
  program: string;
  year: string;
  semester: string; // Now a flexible string, e.g. "Network Security"
  course_code: string;
  course_title: string;
  lec: number;
  lab: number;
  total: number;
  pre_co_requisite: string;
  is_gened?: number;
}

interface BSNElectivesTableProps {
  courses: Course[];
}

const BSNElectivesTable: React.FC<BSNElectivesTableProps> = ({ courses }) => {
  // Gather all distinct elective "semester" values
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
                    {/* Elective Name row */}
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        isHeader
                        className="px-5 py-3 font-medium text-white bg-green-500 dark:bg-green-600 border border-gray-300"
                      >
                        {electiveName}
                      </TableCell>
                    </TableRow>

                    {/* Two-row header */}
                    <TableRow>
                      <TableCell
                        isHeader
                        rowSpan={2}
                        className="border border-gray-300 px-3 py-2 w-24 whitespace-normal break-words font-medium text-gray-700 dark:text-gray-300"
                      >
                        Course Code
                      </TableCell>
                      <TableCell
                        isHeader
                        rowSpan={2}
                        className="border border-gray-300 px-3 py-2 w-64 whitespace-normal break-words font-medium text-gray-700 dark:text-gray-300"
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
                        className="border border-gray-300 px-3 py-2 w-32 whitespace-normal break-words font-medium text-gray-700 dark:text-gray-300"
                      >
                        Pre/Co-Requisite
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        isHeader
                        className="border border-gray-300 px-3 py-2 w-16 whitespace-normal break-words font-medium text-gray-700 dark:text-gray-300"
                      >
                        Lec
                      </TableCell>
                      <TableCell
                        isHeader
                        className="border border-gray-300 px-3 py-2 w-16 whitespace-normal break-words font-medium text-gray-700 dark:text-gray-300"
                      >
                        Lab
                      </TableCell>
                      <TableCell
                        isHeader
                        className="border border-gray-300 px-3 py-2 w-16 whitespace-normal break-words font-medium text-gray-700 dark:text-gray-300"
                      >
                        Total
                      </TableCell>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {electiveCourses.map((course) => (
                      <TableRow key={course.id}>
                        <TableCell className="border border-gray-300 px-3 py-2 w-24 whitespace-normal break-words">
                          {course.course_code}
                        </TableCell>
                        <TableCell className="border border-gray-300 px-3 py-2 w-64 whitespace-normal break-words">
                          {course.course_title}
                        </TableCell>
                        <TableCell className="border border-gray-300 px-3 py-2 w-16 whitespace-normal break-words">
                          {course.lec}
                        </TableCell>
                        <TableCell className="border border-gray-300 px-3 py-2 w-16 whitespace-normal break-words">
                          {course.lab}
                        </TableCell>
                        <TableCell className="border border-gray-300 px-3 py-2 w-16 whitespace-normal break-words">
                          {course.total}
                        </TableCell>
                        <TableCell className="border border-gray-300 px-3 py-2 w-32 whitespace-normal break-words">
                          {course.pre_co_requisite}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BSNElectivesTable;