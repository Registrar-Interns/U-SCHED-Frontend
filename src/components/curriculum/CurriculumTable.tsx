import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

const CurriculumTable: React.FC = () => {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[800px]">
          {/* First Semester */}
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-700 text-start text-theme-xs dark:text-gray-400"
                >
                  First Semester
                </TableCell>
                {/* Add as many header cells as you need for your curriculum data */}
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-700 text-start text-theme-xs dark:text-gray-400"
                >
                  Subject
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-700 text-start text-theme-xs dark:text-gray-400"
                >
                  Units
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {/* Example row */}
              <TableRow>
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  BSIT-101
                </TableCell>
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  Introduction to Computing
                </TableCell>
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  3
                </TableCell>
              </TableRow>
              {/* Add more rows as needed */}
            </TableBody>
          </Table>

          {/* Second Semester */}
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-700 text-start text-theme-xs dark:text-gray-400"
                >
                  Second Semester
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-700 text-start text-theme-xs dark:text-gray-400"
                >
                  Subject
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-700 text-start text-theme-xs dark:text-gray-400"
                >
                  Units
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {/* Example row */}
              <TableRow>
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  BSIT-102
                </TableCell>
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  Programming Fundamentals
                </TableCell>
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  3
                </TableCell>
              </TableRow>
              {/* Add more rows as needed */}
            </TableBody>
          </Table>

          {/* Summer */}
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-700 text-start text-theme-xs dark:text-gray-400"
                >
                  Summer
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-700 text-start text-theme-xs dark:text-gray-400"
                >
                  Subject
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-700 text-start text-theme-xs dark:text-gray-400"
                >
                  Units
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {/* Example row */}
              <TableRow>
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  BSIT-103
                </TableCell>
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  Basic Networking
                </TableCell>
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  2
                </TableCell>
              </TableRow>
              {/* Add more rows as needed */}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default CurriculumTable;