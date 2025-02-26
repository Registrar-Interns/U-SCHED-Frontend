import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

const BSITCurriculumTables: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* =============== FIRST SEMESTER =============== */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          {/* This ensures a horizontal scrollbar if total table width > container */}
          <div className="min-w-[900px]">
            <Table>
              <TableHeader>
                {/* Semester Name (spans all columns) */}
                <TableRow>
                  <TableCell
                    colSpan={6}
                    isHeader
                    className="px-5 py-3 font-medium text-white bg-orange-400 dark:bg-orange-500 border border-gray-300"
                  >
                    First Semester
                  </TableCell>
                </TableRow>

                {/* Top row of two-row header */}
                <TableRow>
                  {/* Course Code */}
                  <TableCell
                    isHeader
                    rowSpan={2}
                    className="
                      border border-gray-300 
                      px-3 py-2 
                      w-24 
                      whitespace-normal 
                      break-words 
                      font-medium 
                      text-gray-700 dark:text-gray-300
                    "
                  >
                    Course Code
                  </TableCell>

                  {/* Course Title */}
                  <TableCell
                    isHeader
                    rowSpan={2}
                    className="
                      border border-gray-300 
                      px-3 py-2 
                      w-64 
                      whitespace-normal 
                      break-words 
                      font-medium 
                      text-gray-700 dark:text-gray-300
                    "
                  >
                    Course Title
                  </TableCell>

                  {/* 'Units' heading spans 3 sub-columns */}
                  <TableCell
                    isHeader
                    colSpan={3}
                    className="
                      border border-gray-300 
                      px-3 py-2 
                      text-center 
                      font-medium 
                      text-gray-700 dark:text-gray-300
                    "
                  >
                    Units
                  </TableCell>

                  {/* Pre/Co-Requisite */}
                  <TableCell
                    isHeader
                    rowSpan={2}
                    className="
                      border border-gray-300 
                      px-3 py-2 
                      w-32 
                      whitespace-normal 
                      break-words 
                      font-medium 
                      text-gray-700 dark:text-gray-300
                    "
                  >
                    Pre/Co-Requisite
                  </TableCell>
                </TableRow>

                {/* Second row of two-row header: Lec, Lab, Total */}
                <TableRow>
                  <TableCell
                    isHeader
                    className="
                      border border-gray-300 
                      px-3 py-2 
                      w-16 
                      whitespace-normal 
                      break-words 
                      font-medium 
                      text-gray-700 dark:text-gray-300
                    "
                  >
                    Lec
                  </TableCell>
                  <TableCell
                    isHeader
                    className="
                      border border-gray-300 
                      px-3 py-2 
                      w-16 
                      whitespace-normal 
                      break-words 
                      font-medium 
                      text-gray-700 dark:text-gray-300
                    "
                  >
                    Lab
                  </TableCell>
                  <TableCell
                    isHeader
                    className="
                      border border-gray-300 
                      px-3 py-2 
                      w-16 
                      whitespace-normal 
                      break-words 
                      font-medium 
                      text-gray-700 dark:text-gray-300
                    "
                  >
                    Total
                  </TableCell>
                </TableRow>
              </TableHeader>

              <TableBody>
                {/* Example Row */}
                <TableRow>
                  {/* Course Code */}
                  <TableCell
                    className="
                      border border-gray-300 
                      px-3 py-2 
                      w-24 
                      whitespace-normal 
                      break-words
                    "
                  >
                    N/A
                  </TableCell>

                  {/* Course Title */}
                  <TableCell
                    className="
                      border border-gray-300 
                      px-3 py-2 
                      w-64 
                      whitespace-normal 
                      break-words
                    "
                  >
                    Mahabang Text Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing
                  </TableCell>

                  {/* Lec */}
                  <TableCell
                    className="
                      border border-gray-300 
                      px-3 py-2 
                      w-16 
                      whitespace-normal 
                      break-words
                    "
                  >
                    3
                  </TableCell>

                  {/* Lab */}
                  <TableCell
                    className="
                      border border-gray-300 
                      px-3 py-2 
                      w-16 
                      whitespace-normal 
                      break-words
                    "
                  >
                    0
                  </TableCell>

                  {/* Total */}
                  <TableCell
                    className="
                      border border-gray-300 
                      px-3 py-2 
                      w-16 
                      whitespace-normal 
                      break-words
                    "
                  >
                    3
                  </TableCell>

                  {/* Pre/Co-Requisite */}
                  <TableCell
                    className="
                      border border-gray-300 
                      px-3 py-2 
                      w-32 
                      whitespace-normal 
                      break-words
                    "
                  >
                    None
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
          {/* This ensures a horizontal scrollbar if total table width > container */}
          <div className="min-w-[900px]">
            <Table>
              <TableHeader>
                {/* Semester Name (spans all columns) */}
                <TableRow>
                  <TableCell
                    colSpan={6}
                    isHeader
                    className="px-5 py-3 font-medium text-white bg-orange-400 dark:bg-orange-500 border border-gray-300"
                  >
                    Second Semester
                  </TableCell>
                </TableRow>

                {/* Top row of two-row header */}
                <TableRow>
                  {/* Course Code */}
                  <TableCell
                    isHeader
                    rowSpan={2}
                    className="
                      border border-gray-300 
                      px-3 py-2 
                      w-24 
                      whitespace-normal 
                      break-words 
                      font-medium 
                      text-gray-700 dark:text-gray-300
                    "
                  >
                    Course Code
                  </TableCell>

                  {/* Course Title */}
                  <TableCell
                    isHeader
                    rowSpan={2}
                    className="
                      border border-gray-300 
                      px-3 py-2 
                      w-64 
                      whitespace-normal 
                      break-words 
                      font-medium 
                      text-gray-700 dark:text-gray-300
                    "
                  >
                    Course Title
                  </TableCell>

                  {/* 'Units' heading spans 3 sub-columns */}
                  <TableCell
                    isHeader
                    colSpan={3}
                    className="
                      border border-gray-300 
                      px-3 py-2 
                      text-center 
                      font-medium 
                      text-gray-700 dark:text-gray-300
                    "
                  >
                    Units
                  </TableCell>

                  {/* Pre/Co-Requisite */}
                  <TableCell
                    isHeader
                    rowSpan={2}
                    className="
                      border border-gray-300 
                      px-3 py-2 
                      w-32 
                      whitespace-normal 
                      break-words 
                      font-medium 
                      text-gray-700 dark:text-gray-300
                    "
                  >
                    Pre/Co-Requisite
                  </TableCell>
                </TableRow>

                {/* Second row of two-row header: Lec, Lab, Total */}
                <TableRow>
                  <TableCell
                    isHeader
                    className="
                      border border-gray-300 
                      px-3 py-2 
                      w-16 
                      whitespace-normal 
                      break-words 
                      font-medium 
                      text-gray-700 dark:text-gray-300
                    "
                  >
                    Lec
                  </TableCell>
                  <TableCell
                    isHeader
                    className="
                      border border-gray-300 
                      px-3 py-2 
                      w-16 
                      whitespace-normal 
                      break-words 
                      font-medium 
                      text-gray-700 dark:text-gray-300
                    "
                  >
                    Lab
                  </TableCell>
                  <TableCell
                    isHeader
                    className="
                      border border-gray-300 
                      px-3 py-2 
                      w-16 
                      whitespace-normal 
                      break-words 
                      font-medium 
                      text-gray-700 dark:text-gray-300
                    "
                  >
                    Total
                  </TableCell>
                </TableRow>
              </TableHeader>

              <TableBody>
                {/* Example Row */}
                <TableRow>
                  {/* Course Code */}
                  <TableCell
                    className="
                      border border-gray-300 
                      px-3 py-2 
                      w-24 
                      whitespace-normal 
                      break-words
                    "
                  >
                    N/A
                  </TableCell>

                  {/* Course Title */}
                  <TableCell
                    className="
                      border border-gray-300 
                      px-3 py-2 
                      w-64 
                      whitespace-normal 
                      break-words
                    "
                  >
                    Mahabang Text Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing
                  </TableCell>

                  {/* Lec */}
                  <TableCell
                    className="
                      border border-gray-300 
                      px-3 py-2 
                      w-16 
                      whitespace-normal 
                      break-words
                    "
                  >
                    3
                  </TableCell>

                  {/* Lab */}
                  <TableCell
                    className="
                      border border-gray-300 
                      px-3 py-2 
                      w-16 
                      whitespace-normal 
                      break-words
                    "
                  >
                    0
                  </TableCell>

                  {/* Total */}
                  <TableCell
                    className="
                      border border-gray-300 
                      px-3 py-2 
                      w-16 
                      whitespace-normal 
                      break-words
                    "
                  >
                    3
                  </TableCell>

                  {/* Pre/Co-Requisite */}
                  <TableCell
                    className="
                      border border-gray-300 
                      px-3 py-2 
                      w-32 
                      whitespace-normal 
                      break-words
                    "
                  >
                    None
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
          {/* This ensures a horizontal scrollbar if total table width > container */}
          <div className="min-w-[900px]">
            <Table>
              <TableHeader>
                {/* Semester Name (spans all columns) */}
                <TableRow>
                  <TableCell
                    colSpan={6}
                    isHeader
                    className="px-5 py-3 font-medium text-white bg-orange-400 dark:bg-orange-500 border border-gray-300"
                  >
                    Summer
                  </TableCell>
                </TableRow>

                {/* Top row of two-row header */}
                <TableRow>
                  {/* Course Code */}
                  <TableCell
                    isHeader
                    rowSpan={2}
                    className="
                      border border-gray-300 
                      px-3 py-2 
                      w-24 
                      whitespace-normal 
                      break-words 
                      font-medium 
                      text-gray-700 dark:text-gray-300
                    "
                  >
                    Course Code
                  </TableCell>

                  {/* Course Title */}
                  <TableCell
                    isHeader
                    rowSpan={2}
                    className="
                      border border-gray-300 
                      px-3 py-2 
                      w-64 
                      whitespace-normal 
                      break-words 
                      font-medium 
                      text-gray-700 dark:text-gray-300
                    "
                  >
                    Course Title
                  </TableCell>

                  {/* 'Units' heading spans 3 sub-columns */}
                  <TableCell
                    isHeader
                    colSpan={3}
                    className="
                      border border-gray-300 
                      px-3 py-2 
                      text-center 
                      font-medium 
                      text-gray-700 dark:text-gray-300
                    "
                  >
                    Units
                  </TableCell>

                  {/* Pre/Co-Requisite */}
                  <TableCell
                    isHeader
                    rowSpan={2}
                    className="
                      border border-gray-300 
                      px-3 py-2 
                      w-32 
                      whitespace-normal 
                      break-words 
                      font-medium 
                      text-gray-700 dark:text-gray-300
                    "
                  >
                    Pre/Co-Requisite
                  </TableCell>
                </TableRow>

                {/* Second row of two-row header: Lec, Lab, Total */}
                <TableRow>
                  <TableCell
                    isHeader
                    className="
                      border border-gray-300 
                      px-3 py-2 
                      w-16 
                      whitespace-normal 
                      break-words 
                      font-medium 
                      text-gray-700 dark:text-gray-300
                    "
                  >
                    Lec
                  </TableCell>
                  <TableCell
                    isHeader
                    className="
                      border border-gray-300 
                      px-3 py-2 
                      w-16 
                      whitespace-normal 
                      break-words 
                      font-medium 
                      text-gray-700 dark:text-gray-300
                    "
                  >
                    Lab
                  </TableCell>
                  <TableCell
                    isHeader
                    className="
                      border border-gray-300 
                      px-3 py-2 
                      w-16 
                      whitespace-normal 
                      break-words 
                      font-medium 
                      text-gray-700 dark:text-gray-300
                    "
                  >
                    Total
                  </TableCell>
                </TableRow>
              </TableHeader>

              <TableBody>
                {/* Example Row */}
                <TableRow>
                  {/* Course Code */}
                  <TableCell
                    className="
                      border border-gray-300 
                      px-3 py-2 
                      w-24 
                      whitespace-normal 
                      break-words
                    "
                  >
                    N/A
                  </TableCell>

                  {/* Course Title */}
                  <TableCell
                    className="
                      border border-gray-300 
                      px-3 py-2 
                      w-64 
                      whitespace-normal 
                      break-words
                    "
                  >
                    Mahabang Text Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing
                  </TableCell>

                  {/* Lec */}
                  <TableCell
                    className="
                      border border-gray-300 
                      px-3 py-2 
                      w-16 
                      whitespace-normal 
                      break-words
                    "
                  >
                    3
                  </TableCell>

                  {/* Lab */}
                  <TableCell
                    className="
                      border border-gray-300 
                      px-3 py-2 
                      w-16 
                      whitespace-normal 
                      break-words
                    "
                  >
                    0
                  </TableCell>

                  {/* Total */}
                  <TableCell
                    className="
                      border border-gray-300 
                      px-3 py-2 
                      w-16 
                      whitespace-normal 
                      break-words
                    "
                  >
                    3
                  </TableCell>

                  {/* Pre/Co-Requisite */}
                  <TableCell
                    className="
                      border border-gray-300 
                      px-3 py-2 
                      w-32 
                      whitespace-normal 
                      break-words
                    "
                  >
                    None
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
          {/* This ensures a horizontal scrollbar if total table width > container */}
          <div className="min-w-[900px]">
            <Table>
              <TableHeader>
                {/* Semester Name (spans all columns) */}
                <TableRow>
                  <TableCell
                    colSpan={6}
                    isHeader
                    className="px-5 py-3 font-medium text-white bg-orange-400 dark:bg-orange-500 border border-gray-300"
                  >
                    Elective
                  </TableCell>
                </TableRow>

                {/* Top row of two-row header */}
                <TableRow>
                  {/* Course Code */}
                  <TableCell
                    isHeader
                    rowSpan={2}
                    className="
                      border border-gray-300 
                      px-3 py-2 
                      w-24 
                      whitespace-normal 
                      break-words 
                      font-medium 
                      text-gray-700 dark:text-gray-300
                    "
                  >
                    Course Code
                  </TableCell>

                  {/* Course Title */}
                  <TableCell
                    isHeader
                    rowSpan={2}
                    className="
                      border border-gray-300 
                      px-3 py-2 
                      w-64 
                      whitespace-normal 
                      break-words 
                      font-medium 
                      text-gray-700 dark:text-gray-300
                    "
                  >
                    Course Title
                  </TableCell>

                  {/* 'Units' heading spans 3 sub-columns */}
                  <TableCell
                    isHeader
                    colSpan={3}
                    className="
                      border border-gray-300 
                      px-3 py-2 
                      text-center 
                      font-medium 
                      text-gray-700 dark:text-gray-300
                    "
                  >
                    Units
                  </TableCell>

                  {/* Pre/Co-Requisite */}
                  <TableCell
                    isHeader
                    rowSpan={2}
                    className="
                      border border-gray-300 
                      px-3 py-2 
                      w-32 
                      whitespace-normal 
                      break-words 
                      font-medium 
                      text-gray-700 dark:text-gray-300
                    "
                  >
                    Pre/Co-Requisite
                  </TableCell>
                </TableRow>

                {/* Second row of two-row header: Lec, Lab, Total */}
                <TableRow>
                  <TableCell
                    isHeader
                    className="
                      border border-gray-300 
                      px-3 py-2 
                      w-16 
                      whitespace-normal 
                      break-words 
                      font-medium 
                      text-gray-700 dark:text-gray-300
                    "
                  >
                    Lec
                  </TableCell>
                  <TableCell
                    isHeader
                    className="
                      border border-gray-300 
                      px-3 py-2 
                      w-16 
                      whitespace-normal 
                      break-words 
                      font-medium 
                      text-gray-700 dark:text-gray-300
                    "
                  >
                    Lab
                  </TableCell>
                  <TableCell
                    isHeader
                    className="
                      border border-gray-300 
                      px-3 py-2 
                      w-16 
                      whitespace-normal 
                      break-words 
                      font-medium 
                      text-gray-700 dark:text-gray-300
                    "
                  >
                    Total
                  </TableCell>
                </TableRow>
              </TableHeader>

              <TableBody>
                {/* Example Row */}
                <TableRow>
                  {/* Course Code */}
                  <TableCell
                    className="
                      border border-gray-300 
                      px-3 py-2 
                      w-24 
                      whitespace-normal 
                      break-words
                    "
                  >
                    N/A
                  </TableCell>

                  {/* Course Title */}
                  <TableCell
                    className="
                      border border-gray-300 
                      px-3 py-2 
                      w-64 
                      whitespace-normal 
                      break-words
                    "
                  >
                    Mahabang Text Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing
                  </TableCell>

                  {/* Lec */}
                  <TableCell
                    className="
                      border border-gray-300 
                      px-3 py-2 
                      w-16 
                      whitespace-normal 
                      break-words
                    "
                  >
                    3
                  </TableCell>

                  {/* Lab */}
                  <TableCell
                    className="
                      border border-gray-300 
                      px-3 py-2 
                      w-16 
                      whitespace-normal 
                      break-words
                    "
                  >
                    0
                  </TableCell>

                  {/* Total */}
                  <TableCell
                    className="
                      border border-gray-300 
                      px-3 py-2 
                      w-16 
                      whitespace-normal 
                      break-words
                    "
                  >
                    3
                  </TableCell>

                  {/* Pre/Co-Requisite */}
                  <TableCell
                    className="
                      border border-gray-300 
                      px-3 py-2 
                      w-32 
                      whitespace-normal 
                      break-words
                    "
                  >
                    None
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

export default BSITCurriculumTables;