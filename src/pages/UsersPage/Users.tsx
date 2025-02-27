import { Link } from "react-router-dom";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import UsersTable from "../../components/users/UsersTable";
import Button from "../../components/ui/button/Button";

export default function Users() {
  return (
    <>
      <PageMeta
        title="Users | iUCSchedProMax+"
        description="Users page for iUCSchedProMax+"
      />
        <PageBreadcrumb
        pageTitle="Users"
        segments={[
          { name: "Home", path: "/dashboard" },
          { name: "Users", path: "/users" },
        ]}
      />

      {/* Search Bar, Dropdown, and Add User Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        {/* Left Section: Search and Dropdown */}
        <div className="flex items-center gap-4 mb-4 sm:mb-0">
          <input
            type="text"
            placeholder="Search..."
            className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-60"
            defaultValue="all"
          >
            <option value="all">List: All Users</option>
            <option value="active">Active Users</option>
            <option value="inactive">Inactive Users</option>
          </select>
        </div>

        {/* Right Section: Add User Button */}
        <div>
          <Link to="/add-user">
            <Button variant="primary" size="md">
              Add User
            </Button>
          </Link>
        </div>
      </div>

      <div className="space-y-6">
        <UsersTable />
      </div>
    </>
  );
}
