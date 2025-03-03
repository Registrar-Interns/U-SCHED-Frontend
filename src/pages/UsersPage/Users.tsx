import React, { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import UsersTable from "../../components/users/UsersTable";
import Button from "../../components/ui/button/Button";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../../components/ui/modal";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Swal from "sweetalert2";

export default function Users() {
  // Modal state management
  const { isOpen, openModal, closeModal } = useModal();

  // Form fields for creating an Admin
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    extendedName: "",
    email: "",
    password: "",
    status: "Active", // default to Active
  });

  // State for error message and saving/loading state
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [reloadTable, setReloadTable] = useState(false);

  // Handler to update form fields
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Validate required fields and email format
  const validateForm = (): boolean => {
    if (
      !formData.firstName.trim() ||
      !formData.middleName.trim() ||
      !formData.lastName.trim() ||
      !formData.email.trim() ||
      !formData.password.trim() ||
      !formData.status.trim()
    ) {
      setFormError("Please fill all required fields.");
      return false;
    }
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(formData.email)) {
      setFormError("Please enter a valid email address.");
      return false;
    }
    setFormError("");
    return true;
  };

  // Handler when "Save" is clicked
  const handleSave = () => {
    if (!validateForm()) return; // If validation fails, don't proceed

    setSaving(true);
    fetch("http://localhost:3001/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        first_name: formData.firstName,
        middle_name: formData.middleName,
        last_name: formData.lastName,
        extended_name: formData.extendedName,
        email: formData.email,
        password: formData.password,
        status: formData.status,
        // role is automatically set to "Admin" on the server
      }),
    })
      .then((res) => res.json())
      .then(() => {
        Swal.fire("Success", "Admin user created successfully.", "success");
        // Clear the form
        setFormData({
          firstName: "",
          middleName: "",
          lastName: "",
          extendedName: "",
          email: "",
          password: "",
          status: "Active",
        });
        // Trigger table reload
        setReloadTable((prev) => !prev);
        closeModal();
      })
      .catch((error) => {
        console.error("Error creating admin user:", error);
        Swal.fire("Error", "Failed to create admin user.", "error");
      })
      .finally(() => {
        setSaving(false);
      });
  };

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

      {/* Search Bar, Dropdown, and Add Admin Button */}
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

        {/* Right Section: Add Admin Button */}
        <div>
          <Button variant="primary" size="md" onClick={openModal}>
            Add Admin
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <UsersTable reload={reloadTable} />
      </div>

      {/* Modal for Creating an Admin Account */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          {/* Modal Header */}
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Create Admin Account
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Fill out the fields to create a new Admin.
            </p>
          </div>

          {/* Modal Body (the form) */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
            className="flex flex-col"
          >
            <div className="custom-scrollbar overflow-y-auto px-2 pb-3">
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                {/* First Name */}
                <div>
                  <Label>First Name</Label>
                  <Input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>
                {/* Middle Name */}
                <div>
                  <Label>Middle Name</Label>
                  <Input
                    type="text"
                    name="middleName"
                    value={formData.middleName}
                    onChange={handleChange}
                  />
                </div>
                {/* Last Name */}
                <div>
                  <Label>Last Name</Label>
                  <Input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>
                {/* Extended Name (optional) */}
                <div>
                  <Label>Extended Name</Label>
                  <Input
                    type="text"
                    name="extendedName"
                    value={formData.extendedName}
                    onChange={handleChange}
                  />
                </div>
                {/* Email */}
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                {/* Password */}
                <div>
                  <Label>Password</Label>
                  <Input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
                {/* Status */}
                <div>
                  <Label>Status</Label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
            {/* Display validation error message */}
            {formError && (
              <div className="text-red-500 text-sm mt-2 px-2">{formError}</div>
            )}

            {/* Modal Footer (buttons) */}
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button type="button" size="sm" variant="outline" onClick={closeModal}>
                Close
              </Button>
              <Button type="button" size="sm" onClick={handleSave} disabled={saving}>
                {saving ? (
                  <>
                    <span
                      className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em]"
                      role="status"
                    >
                      <span className="sr-only">Loading...</span>
                    </span>
                    <span>Loading...</span>
                  </>
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
