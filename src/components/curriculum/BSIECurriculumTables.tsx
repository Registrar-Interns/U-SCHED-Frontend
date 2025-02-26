import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

const BSIECurriculumTables: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* =============== FIRST SEMESTER =============== */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[900px]">
            <Table>
              <TableHeader>
                {/* Full-width row for semester name */}
                <TableRow>
                  <TableCell
                    colSpan={6}
                    isHeader
                    className="px-5 py-3 font-medium text-white bg-blue-700 dark:bg-blue-800 border border-gray-300"
                  >
                    First Semester
                  </TableCell>
                </TableRow>

                {/* Top row of the two-row header */}
                <TableRow>
                  <TableCell
                    isHeader
                    rowSpan={2}
                    className="px-5 py-3 font-medium text-gray-700 dark:text-gray-300 border border-gray-300"
                  >
                    Course Code
                  </TableCell>
                  <TableCell
                    isHeader
                    rowSpan={2}
                    className="px-5 py-3 font-medium text-gray-700 dark:text-gray-300 border border-gray-300"
                  >
                    Course Title
                  </TableCell>
                  {/* 'Units' heading spans 3 sub-columns */}
                  <TableCell
                    isHeader
                    colSpan={3}
                    className="px-5 py-3 font-medium text-gray-700 dark:text-gray-300 text-center border border-gray-300"
                  >
                    Units
                  </TableCell>
                  <TableCell
                    isHeader
                    rowSpan={2}
                    className="px-5 py-3 font-medium text-gray-700 dark:text-gray-300 border border-gray-300"
                  >
                    Pre/Co-Requisite
                  </TableCell>
                </TableRow>

                {/* Second row of the two-row header: Lec, Lab, Total */}
                <TableRow>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-700 dark:text-gray-300 border border-gray-300"
                  >
                    Lec
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-700 dark:text-gray-300 border border-gray-300"
                  >
                    Lab
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-700 dark:text-gray-300 border border-gray-300"
                  >
                    Total
                  </TableCell>
                </TableRow>
              </TableHeader>

              <TableBody>
                <TableRow>
                  <TableCell className="px-5 py-4 border border-gray-300">
                    N/A
                  </TableCell>
                  <TableCell className="px-5 py-4 border border-gray-300">
                    N/A
                  </TableCell>
                  <TableCell className="px-5 py-4 border border-gray-300">
                    N/A
                  </TableCell>
                  <TableCell className="px-5 py-4 border border-gray-300">
                    N/A
                  </TableCell>
                  <TableCell className="px-5 py-4 border border-gray-300">
                    N/A
                  </TableCell>
                  <TableCell className="px-5 py-4 border border-gray-300">
                    N/A
                  </TableCell>
                </TableRow>
                {/* Add more rows as needed */}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* =============== SECOND SEMESTER =============== */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[900px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell
                    colSpan={6}
                    isHeader
                    className="px-5 py-3 font-medium text-white bg-blue-700 dark:bg-blue-800 border border-gray-300"
                  >
                    Second Semester
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    isHeader
                    rowSpan={2}
                    className="px-5 py-3 font-medium text-gray-700 dark:text-gray-300 border border-gray-300"
                  >
                    Course Code
                  </TableCell>
                  <TableCell
                    isHeader
                    rowSpan={2}
                    className="px-5 py-3 font-medium text-gray-700 dark:text-gray-300 border border-gray-300"
                  >
                    Course Title
                  </TableCell>
                  <TableCell
                    isHeader
                    colSpan={3}
                    className="px-5 py-3 font-medium text-gray-700 dark:text-gray-300 text-center border border-gray-300"
                  >
                    Units
                  </TableCell>
                  <TableCell
                    isHeader
                    rowSpan={2}
                    className="px-5 py-3 font-medium text-gray-700 dark:text-gray-300 border border-gray-300"
                  >
                    Pre/Co-Requisite
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-700 dark:text-gray-300 border border-gray-300"
                  >
                    Lec
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-700 dark:text-gray-300 border border-gray-300"
                  >
                    Lab
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-700 dark:text-gray-300 border border-gray-300"
                  >
                    Total
                  </TableCell>
                </TableRow>
              </TableHeader>

              <TableBody>
                <TableRow>
                  <TableCell className="px-5 py-4 border border-gray-300">
                    N/A
                  </TableCell>
                  <TableCell className="px-5 py-4 border border-gray-300">
                    N/A
                  </TableCell>
                  <TableCell className="px-5 py-4 border border-gray-300">
                    N/A
                  </TableCell>
                  <TableCell className="px-5 py-4 border border-gray-300">
                    N/A
                  </TableCell>
                  <TableCell className="px-5 py-4 border border-gray-300">
                    N/A
                  </TableCell>
                  <TableCell className="px-5 py-4 border border-gray-300">
                    N/A
                  </TableCell>
                </TableRow>
                {/* Add more rows as needed */}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* =============== SUMMER =============== */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[900px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell
                    colSpan={6}
                    isHeader
                    className="px-5 py-3 font-medium text-white bg-blue-700 dark:bg-blue-800 border border-gray-300"
                  >
                    Summer
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    isHeader
                    rowSpan={2}
                    className="px-5 py-3 font-medium text-gray-700 dark:text-gray-300 border border-gray-300"
                  >
                    Course Code
                  </TableCell>
                  <TableCell
                    isHeader
                    rowSpan={2}
                    className="px-5 py-3 font-medium text-gray-700 dark:text-gray-300 border border-gray-300"
                  >
                    Course Title
                  </TableCell>
                  <TableCell
                    isHeader
                    colSpan={3}
                    className="px-5 py-3 font-medium text-gray-700 dark:text-gray-300 text-center border border-gray-300"
                  >
                    Units
                  </TableCell>
                  <TableCell
                    isHeader
                    rowSpan={2}
                    className="px-5 py-3 font-medium text-gray-700 dark:text-gray-300 border border-gray-300"
                  >
                    Pre/Co-Requisite
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-700 dark:text-gray-300 border border-gray-300"
                  >
                    Lec
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-700 dark:text-gray-300 border border-gray-300"
                  >
                    Lab
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-700 dark:text-gray-300 border border-gray-300"
                  >
                    Total
                  </TableCell>
                </TableRow>
              </TableHeader>

              <TableBody>
                <TableRow>
                  <TableCell className="px-5 py-4 border border-gray-300">
                    N/A
                  </TableCell>
                  <TableCell className="px-5 py-4 border border-gray-300">
                    N/A
                  </TableCell>
                  <TableCell className="px-5 py-4 border border-gray-300">
                    N/A
                  </TableCell>
                  <TableCell className="px-5 py-4 border border-gray-300">
                    N/A
                  </TableCell>
                  <TableCell className="px-5 py-4 border border-gray-300">
                    N/A
                  </TableCell>
                  <TableCell className="px-5 py-4 border border-gray-300">
                    N/A
                  </TableCell>
                </TableRow>
                {/* Add more rows as needed */}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* =============== ELECTIVE =============== */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[900px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell
                    colSpan={6}
                    isHeader
                    className="px-5 py-3 font-medium text-white bg-blue-700 dark:bg-blue-800 border border-gray-300"
                  >
                    Elective
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    isHeader
                    rowSpan={2}
                    className="px-5 py-3 font-medium text-gray-700 dark:text-gray-300 border border-gray-300"
                  >
                    Course Code
                  </TableCell>
                  <TableCell
                    isHeader
                    rowSpan={2}
                    className="px-5 py-3 font-medium text-gray-700 dark:text-gray-300 border border-gray-300"
                  >
                    Course Title
                  </TableCell>
                  <TableCell
                    isHeader
                    colSpan={3}
                    className="px-5 py-3 font-medium text-gray-700 dark:text-gray-300 text-center border border-gray-300"
                  >
                    Units
                  </TableCell>
                  <TableCell
                    isHeader
                    rowSpan={2}
                    className="px-5 py-3 font-medium text-gray-700 dark:text-gray-300 border border-gray-300"
                  >
                    Pre/Co-Requisite
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-700 dark:text-gray-300 border border-gray-300"
                  >
                    Lec
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-700 dark:text-gray-300 border border-gray-300"
                  >
                    Lab
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-700 dark:text-gray-300 border border-gray-300"
                  >
                    Total
                  </TableCell>
                </TableRow>
              </TableHeader>

              <TableBody>
                <TableRow>
                  <TableCell className="px-5 py-4 border border-gray-300">
                    N/A
                  </TableCell>
                  <TableCell className="px-5 py-4 border border-gray-300">
                    N/A
                  </TableCell>
                  <TableCell className="px-5 py-4 border border-gray-300">
                    N/A
                  </TableCell>
                  <TableCell className="px-5 py-4 border border-gray-300">
                    N/A
                  </TableCell>
                  <TableCell className="px-5 py-4 border border-gray-300">
                    N/A
                  </TableCell>
                  <TableCell className="px-5 py-4 border border-gray-300">
                    N/A
                  </TableCell>
                </TableRow>
                {/* Add more rows as needed */}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BSIECurriculumTables;