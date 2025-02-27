import React from "react";
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
  id: number;
  firstName: string;
  middleName: string;
  lastName: string;
  emailAddress: string;
  department: string;
  typeOfUser: string;
  status: "Active" | "Inactive";
}

const usersData: UserEntry[] = [
  {
    id: 1,
    firstName: "Kim",
    middleName: "Batumbakal",
    lastName: "Dokja",
    emailAddress: "kimdokja@example.com",
    department: "College of Computing Studies",
    typeOfUser: "Admin",
    status: "Active",
  },
  {
    id: 2,
    firstName: "Ding",
    middleName: "Dong",
    lastName: "Dantes",
    emailAddress: "dingdantes@example.com",
    department: "College of Engineering",
    typeOfUser: "User",
    status: "Inactive",
  },
  {
    id: 3,
    firstName: "Sung",
    middleName: "Sing",
    lastName: "Jinwoo",
    emailAddress: "sungjinwoo@example.com",
    department: "College of Computing Studies",
    typeOfUser: "User",
    status: "Active",
  },
  {
    id: 4,
    firstName: "Lloyd",
    middleName: "John",
    lastName: "Frontera",
    emailAddress: "lloydfrontera@example.com",
    department: "College of Engineering",
    typeOfUser: "Admin",
    status: "Inactive",
  },
  {
    id: 5,
    firstName: "Jin",
    middleName: "Manuel",
    lastName: "Mori",
    emailAddress: "jinmori@example.com",
    department: "College of Computing Studies",
    typeOfUser: "User",
    status: "Active",
  },
];

const UsersTable: React.FC = () => {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1102px]">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start">
                  First Name
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start">
                  Middle Name
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start">
                  Last Name
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start">
                  Email Address
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start">
                  Department
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start">
                  Type of User
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start">
                  Status
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start">
                  Action
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody>
              {usersData.map((user, index) => (
                <TableRow
                  key={user.id}
                  className={index % 2 === 0 ? "bg-white" : "bg-green-50"}
                >
                  <TableCell className="px-5 py-4 text-start">
                    {user.firstName}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start">
                    {user.middleName}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start">
                    {user.lastName}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start">
                    {user.emailAddress}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start">
                    {user.department}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start">
                    {user.typeOfUser}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start">
                    <Badge color={user.status === "Active" ? "success" : "error"} size="sm">
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
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