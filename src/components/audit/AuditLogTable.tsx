import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table"; // <-- adjust path if needed

interface AuditLogEntry {
  id: number;
  user: string;
  action: string;
  description: string;
  timestamp: string;
}

const logsData: AuditLogEntry[] = [
  {
    id: 1,
    user: "John Doe",
    action: "Login",
    description: "User logged in",
    timestamp: "2025-02-25 08:30:00",
  },
  {
    id: 2,
    user: "Jane Smith",
    action: "Add Course",
    description: "Added new course BSCS-101",
    timestamp: "2025-02-25 09:10:00",
  },
  {
    id: 3,
    user: "Mark Johnson",
    action: "Logout",
    description: "User logged out",
    timestamp: "2025-02-25 10:00:00",
  },
];

const AuditLogTable: React.FC = () => {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[800px]">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  ID
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  User
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Action
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Description
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Timestamp
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {logsData.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    {log.id}
                  </TableCell>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    {log.user}
                  </TableCell>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    {log.action}
                  </TableCell>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    {log.description}
                  </TableCell>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    {log.timestamp}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default AuditLogTable;