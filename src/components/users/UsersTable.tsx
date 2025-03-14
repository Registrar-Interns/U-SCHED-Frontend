import React, { useEffect, useState } from "react";
import Badge from "../ui/badge/Badge";
import PaginatedTable from "../common/PaginatedTable";

interface UserEntry {
  user_id: number;
  full_name: string | null;
  email: string | null;
  department: string | null;
  faculty_type: string | null;
  position: string | null;
  role: "ADMIN" | "USER" | null;
  status: "ACTIVE" | "INACTIVE" | null;
  password: string | null;
}

interface UsersTableProps {
  reload: boolean;
  onEditAdmin: (user: UserEntry) => void;
  onEditDeanChair: (user: UserEntry) => void;
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
  onEditDeanChair,
  onCreateProfessorAccount,
  onEditProfessor,
}) => {
  const [users, setUsers] = useState<UserEntry[]>([]);
  const [uniqueRoles, setUniqueRoles] = useState<string[]>([]);
  const [uniqueStatuses, setUniqueStatuses] = useState<string[]>([]);

  useEffect(() => {
    fetch("http://localhost:3001/api/users")
      .then((res) => res.json())
      .then((data: UserEntry[]) => {
        setUsers(data);
        
        // Extract unique roles and statuses for filters
        const roles = [...new Set(data.map(user => user.role).filter(Boolean))] as string[];
        const statuses = [...new Set(data.map(user => user.status).filter(Boolean))] as string[];
        
        setUniqueRoles(roles);
        setUniqueStatuses(statuses);
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
      });
  }, [reload]);

  // Transform users data for the PaginatedTable
  const transformedData = users.map(user => ({
    "Full Name": safeDisplay(user.full_name),
    "Email Address": safeDisplay(user.email),
    "Department": safeDisplay(user.department),
    "Faculty Type": safeDisplay(user.faculty_type),
    "Position": safeDisplay(user.position),
    "Role": safeDisplay(user.role),
    "Status": user.status, // We'll handle this specially in renderCell
    // Hidden fields for filtering
    "Role_filter": user.role || "N/A", // For filtering
    "Status_filter": user.status || "N/A", // For filtering
    // Original user object for action handlers
    originalUser: user
  }));

  const columns = [
    "Full Name", 
    "Email Address", 
    "Department", 
    "Faculty Type", 
    "Position", 
    "Role", 
    "Status"
  ];

  // Configure filters
  const tableFilters = [
    {
      column: "Role_filter",
      options: uniqueRoles.map(role => ({
        value: role,
        label: role
      }))
    },
    {
      column: "Status_filter",
      options: uniqueStatuses.map(status => ({
        value: status,
        label: status
      }))
    }
  ];

  const renderCell = (row: Record<string, unknown>, column: string) => {
    if (column === "Status" && typeof row["Status"] === "string") {
      return (
        <Badge color={getBadgeColor(row["Status"] as string)} size="sm">
          {safeDisplay(row["Status"] as string)}
        </Badge>
      );
    }
    return safeDisplay(row[column] as string);
  };

  const renderActions = (row: Record<string, unknown>) => {
    const user = row.originalUser as UserEntry;
    
    if (user.role === "ADMIN") {
      // Only Edit button for Admin
      return (
        <button 
          className="px-4 py-2 text-green-600 border border-green-600 rounded-md hover:bg-green-700 hover:text-white transition"
          onClick={() => onEditAdmin(user)}
        >
          Edit
        </button>
      );
    } else {
      // Check if user is Dean or Department Chair
      if (user.position === "Dean" || user.position === "Department Chair") {
        return (
          <button 
            className="px-4 py-2 text-green-600 border border-green-600 rounded-md hover:bg-green-700 hover:text-white transition"
            onClick={() => onEditDeanChair(user)}
          >
            Edit
          </button>
        );
      } else {
        // Regular Professor
        const hasAccount = user.password && user.password.trim() !== "";
        if (!hasAccount) {
          return (
            <button 
              className="px-4 py-2 text-yellow-400 border border-yellow-400 rounded-md hover:bg-yellow-500 hover:text-white transition"
              onClick={() => onCreateProfessorAccount(user)}
            >
              Create Account
            </button>
          );
        } else {
          return (
            <button 
              className="px-4 py-2 text-green-600 border border-green-600 rounded-md hover:bg-green-700 hover:text-white transition"
              onClick={() => onEditProfessor(user)}
            >
              Edit
            </button>
          );
        }
      }
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <PaginatedTable 
        columns={columns}
        data={transformedData}
        renderCell={renderCell}
        renderActions={renderActions}
        filters={tableFilters}
      />
    </div>
  );
};

export default UsersTable;