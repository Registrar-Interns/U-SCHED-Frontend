import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import Button from "../ui/button/Button";

interface UserEntry {
  user_id: number;
  full_name: string | null;
  email: string | null;
  department: string | null;
  faculty_type: string | null;
  position: string | null;
  role: "ADMIN" | "USER" | null;
  status: "ACTIVE" | "INACTIVE" | null;
  password: string | null; // newly added to check if user has an account
}

interface UsersTableProps {
  reload: boolean;
  onEditAdmin: (user: UserEntry) => void;
  onCreateProfessorAccount: (user: UserEntry) => void;
  onEditProfessor: (user: UserEntry) => void;
}

const safeDisplay = (value: string | null | undefined): string => {
  return value && value.trim() !== "" ? value : "N/A";
};

const getBadgeColor = (
  status: string | null | undefined
): "success" | "error" | "light" => {
  if (status === "ACTIVE") return "success";
  if (status === "INACTIVE") return "error";
  return "light";
};

const UsersTable: React.FC<UsersTableProps> = ({
  reload,
  onEditAdmin,
  onCreateProfessorAccount,
  onEditProfessor,
}) => {
  const [users, setUsers] = useState<UserEntry[]>([]);

  useEffect(() => {
    fetch("http://localhost:3001/api/users")
      .then((res) => res.json())
      .then((data: UserEntry[]) => {
        setUsers(data);
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
      });
  }, [reload]);

  const renderAction = (user: UserEntry) => {
    if (user.role === "ADMIN") {
      // Only Edit button for Admin
      return (
        <Button variant="outline" size="sm" onClick={() => onEditAdmin(user)}>
          Edit
        </Button>
      );
    } else {
      // role === "USER" => Professor
      // Check if user.password is empty => "Create Account", else "Edit"
      const hasAccount = user.password && user.password.trim() !== "";
      if (!hasAccount) {
        return (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onCreateProfessorAccount(user)}
          >
            Create Account
          </Button>
        );
      } else {
        return (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEditProfessor(user)}
          >
            Edit
          </Button>
        );
      }
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1102px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start">
                  Full Name
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start">
                  Email Address
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start">
                  Department
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start">
                  Faculty Type
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start">
                  Position
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start">
                  Role
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start">
                  Status
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start">
                  Action
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user, index) => (
                <TableRow
                  key={user.user_id}
                  className={index % 2 === 0 ? "bg-white" : "bg-green-50"}
                >
                  <TableCell className="px-5 py-4 text-start">
                    {safeDisplay(user.full_name)}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start">
                    {safeDisplay(user.email)}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start">
                    {safeDisplay(user.department)}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start">
                    {safeDisplay(user.faculty_type)}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start">
                    {safeDisplay(user.position)}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start">
                    {safeDisplay(user.role)}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start">
                    <Badge color={getBadgeColor(user.status)} size="sm">
                      {safeDisplay(user.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start">
                    {renderAction(user)}
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

export default UsersTable;