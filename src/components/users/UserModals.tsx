import React, { useState, useEffect } from "react";
import { Modal } from "../ui/modal";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import Swal from "sweetalert2";

// Shared user type
interface UserEntry {
  user_id: number;
  full_name: string | null;
  email: string | null;
  department: string | null;
  faculty_type: string | null;
  position: string | null;
  role: "ADMIN" | "USER" | null;
  status: "ACTIVE" | "INACTIVE" | null;
  password?: string | null;
}

// ========== CREATE USER TYPE SELECTION MODAL ==========
interface UserTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectType: (type: "admin" | "deanchair") => void;
}

export const UserTypeModal: React.FC<UserTypeModalProps> = ({
  isOpen,
  onClose,
  onSelectType,
}) => {
  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[500px] m-4"
      headerText="Select User Type"
      headerImage="/images/pnc-bg.jpg" // Use your background image
    >
      <div className="space-y-4">
        <button
          onClick={() => onSelectType("admin")}
          className="w-full p-4 text-left border rounded hover:bg-gray-100 transition"
        >
          <h3 className="font-medium text-lg">Admin</h3>
          <p className="text-gray-600">
            Create a system administrator account with full access to the system.
          </p>
        </button>

        <button
          onClick={() => onSelectType("deanchair")}
          className="w-full p-4 text-left border rounded hover:bg-gray-100 transition"
        >
          <h3 className="font-medium text-lg">Dean / Department Chair</h3>
          <p className="text-gray-600">
            Create a faculty account with Dean or Department Chair privileges.
          </p>
        </button>
      </div>
    </Modal>
  );
};

// ========== CREATE ADMIN MODAL ==========
interface CreateAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void; // triggers table reload
}
export const CreateAdminModal: React.FC<CreateAdminModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    extendedName: "",
    email: "",
    password: "",
    status: "ACTIVE",
  });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    if (
      !formData.firstName.trim() ||
      !formData.middleName.trim() ||
      !formData.lastName.trim() ||
      !formData.email.trim() ||
      !formData.password.trim()
    ) {
      setFormError("Please fill all required fields.");
      return false;
    }
    setFormError("");
    return true;
  };

  const handleSave = () => {
    if (!validateForm()) return;
    setSaving(true);

    // POST /api/users to create a new admin
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
      }),
    })
      .then((res) => res.json())
      .then(() => {
        setTimeout(() => {
          onSuccess();
          onClose();
          setSaving(false);
          Swal.fire("Success", "Admin user created successfully.", "success");
        }, 2000);
      })
      .catch((error) => {
        console.error("Error creating admin user:", error);
        setSaving(false);
        Swal.fire("Error", "Failed to create admin user.", "error");
      });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] m-4" headerText="Create Admin Account" headerImage="/images/pnc-bg.jpg">
      <div className="p-4">
        {/* <h2 className="text-xl font-semibold mb-4">Create Admin Account</h2> */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>First Name</Label>
            <Input
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Middle Name</Label>
            <Input
              name="middleName"
              value={formData.middleName}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Last Name</Label>
            <Input
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Extended Name</Label>
            <Input
              name="extendedName"
              value={formData.extendedName}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Email</Label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Password</Label>
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Status</Label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="mt-1 block w-full border p-2"
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </div>
        </div>
        {formError && <div className="text-red-500 mt-2">{formError}</div>}
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

// ========== CREATE DEAN/CHAIR MODAL ==========
interface College {
  college_id: number;
  college_name: string;
  college_code: string;
}

interface CreateDeanChairModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateDeanChairModal: React.FC<CreateDeanChairModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [colleges, setColleges] = useState<College[]>([]);
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    extendedName: "",
    email: "",
    password: "",
    collegeId: "",
    facultyType: "Full-Time", // Default value
    position: "Dean", // Default to DEAN, can be changed to CHAIR
    bachelorsDegree: "",
    mastersDegree: "",
    doctorateDegree: "",
    specialization: "",
    status: "ACTIVE",
    // Time availability fields
    mondayAvailability: "",
    tuesdayAvailability: "",
    wednesdayAvailability: "",
    thursdayAvailability: "",
    fridayAvailability: "",
    saturdayAvailability: "",
    sundayAvailability: "",
  });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    // Fetch colleges when modal opens
    if (isOpen) {
      fetchColleges();
    }
  }, [isOpen]);

  const fetchColleges = () => {
    fetch("http://localhost:3001/api/colleges")
      .then((res) => res.json())
      .then((data) => {
        setColleges(data);
        if (data.length > 0) {
          setFormData((prev) => ({ ...prev, collegeId: data[0].college_id.toString() }));
        }
      })
      .catch((error) => {
        console.error("Error fetching colleges:", error);
        Swal.fire("Error", "Failed to load colleges.", "error");
      });
  };

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    if (
      !formData.firstName.trim() ||
      !formData.middleName.trim() ||
      !formData.lastName.trim() ||
      !formData.email.trim() ||
      !formData.password.trim() ||
      !formData.collegeId ||
      !formData.facultyType ||
      !formData.position ||
      !formData.bachelorsDegree.trim() ||
      !formData.mastersDegree.trim() ||
      !formData.doctorateDegree.trim() ||
      !formData.specialization.trim()
    ) {
      setFormError("Please fill all required fields.");
      return false;
    }
    setFormError("");
    return true;
  };

  const handleSave = () => {
    if (!validateForm()) return;
    setSaving(true);

    // Prepare time availability data
    const timeAvailability = {
      monday: formData.mondayAvailability,
      tuesday: formData.tuesdayAvailability,
      wednesday: formData.wednesdayAvailability,
      thursday: formData.thursdayAvailability,
      friday: formData.fridayAvailability,
      saturday: formData.saturdayAvailability,
      sunday: formData.sundayAvailability,
    };

    // POST /api/users/deanchair to create a new dean/chair
    fetch("http://localhost:3001/api/users/deanchair", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        first_name: formData.firstName,
        middle_name: formData.middleName,
        last_name: formData.lastName,
        extended_name: formData.extendedName,
        email: formData.email,
        password: formData.password,
        college_id: formData.collegeId,
        faculty_type: formData.facultyType,
        position: formData.position,
        bachelorsDegree: formData.bachelorsDegree,
        mastersDegree: formData.mastersDegree,
        doctorateDegree: formData.doctorateDegree,
        specialization: formData.specialization,
        status: formData.status,
        time_availability: timeAvailability,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        setTimeout(() => {
          onSuccess();
          onClose();
          setSaving(false);
          Swal.fire(
            "Success", 
            `${formData.position === "Dean" ? "Dean" : "Department Chair"} created successfully.`, 
            "success"
          );
        }, 2000);
      })
      .catch((error) => {
        console.error("Error creating dean/chair:", error);
        setSaving(false);
        Swal.fire("Error", "Failed to create account.", "error");
      });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] m-4" headerText="Create Dean/Department Chair Account" headerImage="/images/pnc-bg.jpg">
      <div className="p-4">
        {/* <h2 className="text-xl font-semibold mb-4">
          Create Dean/Department Chair Account
        </h2> */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>First Name<span className="text-red-500">*</span></Label>
            <Input
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Middle Name</Label>
            <Input
              name="middleName"
              value={formData.middleName}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Last Name<span className="text-red-500">*</span></Label>
            <Input
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Extended Name</Label>
            <Input
              name="extendedName"
              value={formData.extendedName}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Email<span className="text-red-500">*</span></Label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Password<span className="text-red-500">*</span></Label>
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>College/Department<span className="text-red-500">*</span></Label>
            <select
              name="collegeId"
              value={formData.collegeId}
              onChange={handleChange}
              className="mt-1 block w-full border p-2"
            >
              {colleges.length > 0 ? (
                colleges.map((college) => (
                  <option key={college.college_id} value={college.college_id}>
                    {college.college_name} ({college.college_code})
                  </option>
                ))
              ) : (
                <option value="">Loading colleges...</option>
              )}
            </select>
          </div>
          <div>
            <Label>Faculty Type<span className="text-red-500">*</span></Label>
            <select
              name="facultyType"
              value={formData.facultyType}
              onChange={handleChange}
              className="mt-1 block w-full border p-2"
            >
              <option value="Full-time">FULL-TIME</option>
              <option value="Part time">PART TIME</option>
              <option value="Full-time (COS)">FULL-TIME (COS)</option>
            </select>
          </div>
          <div>
            <Label>Position<span className="text-red-500">*</span></Label>
            <select
              name="position"
              value={formData.position}
              onChange={handleChange}
              className="mt-1 block w-full border p-2"
            >
              <option value="Dean">DEAN</option>
              <option value="Department Chair">DEPARTMENT CHAIR</option>
            </select>
          </div>
          <div>
            <Label>Bachelor's Degree</Label>
            <Input
              name="bachelorsDegree"
              value={formData.bachelorsDegree}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Master's Degree</Label>
            <Input
              name="mastersDegree"
              value={formData.mastersDegree}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Doctorate Degree</Label>
            <Input
              name="doctorateDegree"
              value={formData.doctorateDegree}
              onChange={handleChange}
            />
          </div>
          <div className="col-span-2">
            <Label>Specialization<span className="text-red-500">*</span></Label>
            <textarea
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              placeholder="Enter specializations separated by commas"
              className="mt-1 block w-full border p-2 h-20"
            />
          </div>
          <div>
            <Label>Status<span className="text-red-500">*</span></Label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="mt-1 block w-full border p-2"
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </div>
        </div>

        {/* Time Availability Section */}
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-3">Time Availability</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Monday</Label>
              <Input
                type="text"
                name="mondayAvailability"
                value={formData.mondayAvailability}
                onChange={handleChange}
                placeholder="e.g. 08:00-17:00"
              />
            </div>
            <div>
              <Label>Tuesday</Label>
              <Input
                type="text"
                name="tuesdayAvailability"
                value={formData.tuesdayAvailability}
                onChange={handleChange}
                placeholder="e.g. 08:00-17:00"
              />
            </div>
            <div>
              <Label>Wednesday</Label>
              <Input
                type="text"
                name="wednesdayAvailability"
                value={formData.wednesdayAvailability}
                onChange={handleChange}
                placeholder="e.g. 08:00-17:00"
              />
            </div>
            <div>
              <Label>Thursday</Label>
              <Input
                type="text"
                name="thursdayAvailability"
                value={formData.thursdayAvailability}
                onChange={handleChange}
                placeholder="e.g. 08:00-17:00"
              />
            </div>
            <div>
              <Label>Friday</Label>
              <Input
                type="text"
                name="fridayAvailability"
                value={formData.fridayAvailability}
                onChange={handleChange}
                placeholder="e.g. 08:00-17:00"
              />
            </div>
            <div>
              <Label>Saturday</Label>
              <Input
                type="text"
                name="saturdayAvailability"
                value={formData.saturdayAvailability}
                onChange={handleChange}
                placeholder="e.g. 08:00-12:00 (leave blank if not available)"
              />
            </div>
            <div>
              <Label>Sunday</Label>
              <Input
                type="text"
                name="sundayAvailability"
                value={formData.sundayAvailability}
                onChange={handleChange}
                placeholder="e.g. 08:00-12:00 (leave blank if not available)"
              />
            </div>
          </div>
        </div>

        {formError && <div className="text-red-500 mt-2">{formError}</div>}
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

// EditDeanChairModal
// For editing Dean/Chair accounts with functionality similar to CreateDeanChairModal
interface College {
  college_id: number;
  college_name: string;
  college_code: string;
}

interface EditDeanChairModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user: UserEntry | null; 
}

export const EditDeanChairModal: React.FC<EditDeanChairModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  user,
}) => {
  const [colleges, setColleges] = useState<College[]>([]);
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    extendedName: "",
    email: "",
    newPassword: "", // For optional password change
    collegeId: "",
    facultyType: "",
    position: "",
    bachelorsDegree: "",
    mastersDegree: "",
    doctorateDegree: "",
    specialization: "",
    status: "",
    // Time availability fields
    mondayAvailability: "",
    tuesdayAvailability: "",
    wednesdayAvailability: "",
    thursdayAvailability: "",
    fridayAvailability: "",
    saturdayAvailability: "",
    sundayAvailability: "",
  });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    // Fetch colleges when modal opens
    if (isOpen) {
      fetchColleges();
    }
  }, [isOpen]);

  useEffect(() => {
    // Only fetch dean/chair details if modal is open AND user exists AND user is a dean/chair
    if (isOpen && user && (user.position === "Dean" || user.position === "Department Chair")) {
      // Fetch the detailed user info from the API
      fetch(`http://localhost:3001/api/users/deanchair/${user.user_id}`)
        .then((res) => res.json())
        .then((data) => {
          // Extract time availability data if it exists
          const timeAvailability = data.time_availability || {};
          
          setFormData({
            firstName: data.first_name || "",
            middleName: data.middle_name || "",
            lastName: data.last_name || "",
            extendedName: data.extended_name || "",
            email: user.email || "", // Use the email from the user object
            newPassword: "", // Empty for security
            collegeId: data.college_id?.toString() || "",
            facultyType: data.faculty_type || "",
            position: data.position || "",
            bachelorsDegree: data.bachelorsDegree || "",
            mastersDegree: data.mastersDegree || "",
            doctorateDegree: data.doctorateDegree || "",
            specialization: data.specialization || "",
            status: data.status || "",
            // Set time availability fields
            mondayAvailability: timeAvailability.monday || "",
            tuesdayAvailability: timeAvailability.tuesday || "",
            wednesdayAvailability: timeAvailability.wednesday || "",
            thursdayAvailability: timeAvailability.thursday || "",
            fridayAvailability: timeAvailability.friday || "",
            saturdayAvailability: timeAvailability.saturday || "",
            sundayAvailability: timeAvailability.sunday || "",
          });
        })
        .catch((error) => {
          console.error("Error fetching dean/chair details:", error);
          Swal.fire("Error", "Failed to load user details.", "error");
        });
    }
  }, [user, isOpen]);

  const fetchColleges = () => {
    fetch("http://localhost:3001/api/colleges")
      .then((res) => res.json())
      .then((data) => {
        setColleges(data);
      })
      .catch((error) => {
        console.error("Error fetching colleges:", error);
        Swal.fire("Error", "Failed to load colleges.", "error");
      });
  };

  if (!isOpen || !user) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    if (
      !formData.firstName.trim() ||
      !formData.middleName.trim() ||
      !formData.lastName.trim() ||
      !formData.email.trim() ||
      !formData.collegeId ||
      !formData.facultyType ||
      !formData.position ||
      !formData.bachelorsDegree.trim() ||
      !formData.mastersDegree.trim() ||
      !formData.doctorateDegree.trim() ||
      !formData.specialization.trim()
    ) {
      setFormError("Please fill all required fields.");
      return false;
    }
    setFormError("");
    return true;
  };

  const handleSave = () => {
    if (!validateForm()) return;
    setSaving(true);

    // Prepare time availability data
    const timeAvailability = {
      monday: formData.mondayAvailability,
      tuesday: formData.tuesdayAvailability,
      wednesday: formData.wednesdayAvailability,
      thursday: formData.thursdayAvailability,
      friday: formData.fridayAvailability,
      saturday: formData.saturdayAvailability,
      sunday: formData.sundayAvailability,
    };

    // PUT /api/users/deanchair/:userId to update the dean/chair
    fetch(`http://localhost:3001/api/users/deanchair/${user.user_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        first_name: formData.firstName,
        middle_name: formData.middleName,
        last_name: formData.lastName,
        extended_name: formData.extendedName,
        email: formData.email,
        newPassword: formData.newPassword, // Send empty string if no new password
        college_id: formData.collegeId,
        faculty_type: formData.facultyType,
        position: formData.position,
        bachelorsDegree: formData.bachelorsDegree,
        mastersDegree: formData.mastersDegree,
        doctorateDegree: formData.doctorateDegree,
        specialization: formData.specialization,
        status: formData.status,
        time_availability: timeAvailability,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        setTimeout(() => {
          onSuccess();
          onClose();
          setSaving(false);
          Swal.fire(
            "Success", 
            `${formData.position === "Dean" ? "Dean" : "Department Chair"} updated successfully.`, 
            "success"
          );
        }, 2000);
      })
      .catch((error) => {
        console.error("Error updating dean/chair:", error);
        setSaving(false);
        Swal.fire("Error", "Failed to update account.", "error");
      });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] m-4" headerText="Edit Dean/Department Chair Account" headerImage="/images/pnc-bg.jpg">
      <div className="p-4">
        {/* <h2 className="text-xl font-semibold mb-4">
          Edit Dean/Department Chair Account
        </h2> */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>First Name<span className="text-red-500">*</span></Label>
            <Input
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Middle Name</Label>
            <Input
              name="middleName"
              value={formData.middleName}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Last Name<span className="text-red-500">*</span></Label>
            <Input
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Extended Name</Label>
            <Input
              name="extendedName"
              value={formData.extendedName}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Email<span className="text-red-500">*</span></Label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>New Password (leave blank to keep current)</Label>
            <Input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="Enter only to change password"
            />
          </div>
          <div>
            <Label>College/Department<span className="text-red-500">*</span></Label>
            <select
              name="collegeId"
              value={formData.collegeId}
              onChange={handleChange}
              className="mt-1 block w-full border p-2"
            >
              {colleges.length > 0 ? (
                colleges.map((college) => (
                  <option key={college.college_id} value={college.college_id}>
                    {college.college_name} ({college.college_code})
                  </option>
                ))
              ) : (
                <option value="">Loading colleges...</option>
              )}
            </select>
          </div>
          <div>
            <Label>Faculty Type<span className="text-red-500">*</span></Label>
            <select
              name="facultyType"
              value={formData.facultyType}
              onChange={handleChange}
              className="mt-1 block w-full border p-2"
            >
              <option value="Full-time">FULL-TIME</option>
              <option value="Part time">PART TIME</option>
              <option value="Full-time (COS)">FULL-TIME (COS)</option>
            </select>
          </div>
          <div>
            <Label>Position<span className="text-red-500">*</span></Label>
            <select
              name="position"
              value={formData.position}
              onChange={handleChange}
              className="mt-1 block w-full border p-2"
            >
              <option value="Dean">DEAN</option>
              <option value="Department Chair">DEPARTMENT CHAIR</option>
            </select>
          </div>
          <div>
            <Label>Bachelor's Degree</Label>
            <Input
              name="bachelorsDegree"
              value={formData.bachelorsDegree}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Master's Degree</Label>
            <Input
              name="mastersDegree"
              value={formData.mastersDegree}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Doctorate Degree</Label>
            <Input
              name="doctorateDegree"
              value={formData.doctorateDegree}
              onChange={handleChange}
            />
          </div>
          <div className="col-span-2">
            <Label>Specialization<span className="text-red-500">*</span></Label>
            <textarea
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              placeholder="Enter specializations separated by commas"
              className="mt-1 block w-full border p-2 h-20"
            />
          </div>
          <div>
            <Label>Status<span className="text-red-500">*</span></Label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="mt-1 block w-full border p-2"
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </div>
        </div>

        {/* Time Availability Section */}
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-3">Time Availability</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Monday</Label>
              <Input
                type="text"
                name="mondayAvailability"
                value={formData.mondayAvailability}
                onChange={handleChange}
                placeholder="e.g. 08:00-17:00"
              />
            </div>
            <div>
              <Label>Tuesday</Label>
              <Input
                type="text"
                name="tuesdayAvailability"
                value={formData.tuesdayAvailability}
                onChange={handleChange}
                placeholder="e.g. 08:00-17:00"
              />
            </div>
            <div>
              <Label>Wednesday</Label>
              <Input
                type="text"
                name="wednesdayAvailability"
                value={formData.wednesdayAvailability}
                onChange={handleChange}
                placeholder="e.g. 08:00-17:00"
              />
            </div>
            <div>
              <Label>Thursday</Label>
              <Input
                type="text"
                name="thursdayAvailability"
                value={formData.thursdayAvailability}
                onChange={handleChange}
                placeholder="e.g. 08:00-17:00"
              />
            </div>
            <div>
              <Label>Friday</Label>
              <Input
                type="text"
                name="fridayAvailability"
                value={formData.fridayAvailability}
                onChange={handleChange}
                placeholder="e.g. 08:00-17:00"
              />
            </div>
            <div>
              <Label>Saturday</Label>
              <Input
                type="text"
                name="saturdayAvailability"
                value={formData.saturdayAvailability}
                onChange={handleChange}
                placeholder="e.g. 08:00-12:00 (leave blank if not available)"
              />
            </div>
            <div>
              <Label>Sunday</Label>
              <Input
                type="text"
                name="sundayAvailability"
                value={formData.sundayAvailability}
                onChange={handleChange}
                placeholder="e.g. 08:00-12:00 (leave blank if not available)"
              />
            </div>
          </div>
        </div>

        {formError && <div className="text-red-500 mt-2">{formError}</div>}
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

// ========== EDIT ADMIN MODAL ==========
// Shows all fields as in Create Admin with an optional password change.
interface EditAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserEntry | null; 
  onSuccess: () => void;
}
export const EditAdminModal: React.FC<EditAdminModalProps> = ({
  isOpen,
  onClose,
  user,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    extendedName: "",
    email: "",
    password: "",
    status: "INACTIVE",
  });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (user && isOpen) {
      // In a real app, fetch detailed admin info. For now, we try to split full_name.
      const parts = (user.full_name || "").split(" ");
      const first = parts[0] || "";
      const middle = parts.length > 2 ? parts[1] : "";
      const last = parts.length > 2 ? parts[2] : parts[1] || "";
      setFormData({
        firstName: first,
        middleName: middle,
        lastName: last,
        extendedName: "",
        email: user.email || "",
        password: "",
        status: user.status || "INACTIVE",
      });
    }
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (
      !formData.firstName.trim() ||
      !formData.middleName.trim() ||
      !formData.lastName.trim() ||
      !formData.email.trim()
    ) {
      setFormError("Please fill all required fields (except password if unchanged).");
      return false;
    }
    setFormError("");
    return true;
  };

  const handleSave = () => {
    if (!validateForm()) return;
    setSaving(true);
  
    fetch(`http://localhost:3001/api/users/admin/${user.user_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        first_name: formData.firstName,
        middle_name: formData.middleName,
        last_name: formData.lastName,
        extended_name: formData.extendedName,
        email: formData.email,
        password: formData.password, // if blank, backend will skip password update
        status: formData.status,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to update admin user.");
        }
        return res.json();
      })
      .then(() => {
        setTimeout(() => {
          onSuccess();
          onClose();
          setSaving(false);
          Swal.fire("Success", "Admin user updated successfully.", "success");
        }, 2000);
      })
      .catch((error) => {
        setSaving(false);
        console.error("Error updating admin user:", error);
        Swal.fire("Error", "Failed to update admin user.", "error");
      });
  };
  

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] m-4" headerText={`Edit Admin - ${user.full_name}`} headerImage="/images/pnc-bg.jpg">
      <div className="p-4">
        {/* <h2 className="text-xl font-semibold mb-4">
          Edit Admin - {user.full_name}
        </h2> */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>First Name</Label>
            <Input name="firstName" value={formData.firstName} onChange={handleChange} />
          </div>
          <div>
            <Label>Middle Name</Label>
            <Input name="middleName" value={formData.middleName} onChange={handleChange} />
          </div>
          <div>
            <Label>Last Name</Label>
            <Input name="lastName" value={formData.lastName} onChange={handleChange} />
          </div>
          <div>
            <Label>Extended Name</Label>
            <Input name="extendedName" value={formData.extendedName} onChange={handleChange} />
          </div>
          <div>
            <Label>Email</Label>
            <Input type="email" name="email" value={formData.email} onChange={handleChange} />
          </div>
          <div>
            <Label>New Password</Label>
            <Input
              type="password"
              name="password"
              placeholder="Leave blank to keep existing"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Status</Label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="mt-1 block w-full border p-2"
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </div>
        </div>
        {formError && <div className="text-red-500 mt-2">{formError}</div>}
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

// ========== CREATE PROFESSOR ACCOUNT MODAL ==========
// Calls PUT /api/users/professor/:userId/send-password
interface CreateProfessorAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserEntry | null; 
  onSuccess: () => void;
}
export const CreateProfessorAccountModal: React.FC<CreateProfessorAccountModalProps> = ({
  isOpen,
  onClose,
  user,
  onSuccess,
}) => {
  const [password, setPassword] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);
  const [loading, setLoading] = useState(false);

  // State for professor details
  const [professorData, setProfessorData] = useState({
    department: "",
    faculty_type: "",
    position: "",
    degrees: "",
    specialization: "",
    time_availability: {
      monday: "",
      tuesday: "",
      wednesday: "",
      thursday: "",
      friday: "",
      saturday: "",
      sunday: "",
    }
  });

  useEffect(() => {
    if (user && isOpen) {
      setLoading(true);
      // Fetch professor details from the API
      fetch(`http://localhost:3001/api/users/professor/${user.user_id}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to fetch professor details");
          }
          return res.json();
        })
        .then((data) => {
          setProfessorData({
            department: data.department || user.department || "",
            faculty_type: data.faculty_type || user.faculty_type || "",
            position: data.position || user.position || "",
            degrees: [
              data.bachelorsDegree || "",
              data.mastersDegree || "",
              data.doctorateDegree || ""
            ].filter(Boolean).join(", "),
            specialization: data.specialization || "",
            time_availability: data.time_availability || {
              monday: "",
              tuesday: "",
              wednesday: "",
              thursday: "",
              friday: "",
              saturday: "",
              sunday: "",
            }
          });
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching professor details:", error);
          // Fallback to user data from the users table
          setProfessorData({
            department: user.department || "",
            faculty_type: user.faculty_type || "",
            position: user.position || "",
            degrees: "Not available",
            specialization: "Not available",
            time_availability: {
              monday: "",
              tuesday: "",
              wednesday: "",
              thursday: "",
              friday: "",
              saturday: "",
              sunday: "",
            }
          });
          setLoading(false);
        });
    }
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  const handleSendPassword = async () => {
    if (!password.trim()) {
      return Swal.fire("Error", "Please enter a password.", "error");
    }
    setSendingEmail(true);

    try {
      // PUT /api/users/professor/:userId/send-password => store hashed password, email plaintext
      const response = await fetch(
        `http://localhost:3001/api/users/professor/${user.user_id}/send-password`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ plainPassword: password }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to send password");
      }
      Swal.fire("Success", "Password sent via email!", "success");
      onSuccess();
      onClose();
      // Optionally disable the password field
      // setPassword("");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to send password email.", "error");
    } finally {
      setSendingEmail(false);
    }
  };

  // Calculate number of specializations
  const specializations = professorData.specialization ? professorData.specialization.split(",") : [];
  const noOfSpecialization = specializations.length;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] m-4" headerText={`Create Account for - ${user.full_name}`} headerImage="/images/pnc-bg.jpg">
      <div className="p-4">
        {loading ? (
          <div className="text-center py-4">Loading professor details...</div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Department</Label>
                <Input type="text" value={professorData.department} disabled />
              </div>
              <div>
                <Label>Faculty Type</Label>
                <Input type="text" value={professorData.faculty_type} disabled />
              </div>
              <div>
                <Label>Position</Label>
                <Input type="text" value={professorData.position} disabled />
              </div>
              <div>
                <Label>Degrees</Label>
                <Input type="text" value={professorData.degrees} disabled />
              </div>
              <div>
                <Label>Specializations</Label>
                <Input type="text" value={professorData.specialization} disabled />
              </div>
              <div>
                <Label>No. of Specialization</Label>
                <Input type="text" value={noOfSpecialization.toString()} disabled />
              </div>
            </div>

            {/* Time Availability Section */}
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-3">Time Availability</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Monday</Label>
                  <Input type="text" value={professorData.time_availability.monday} disabled />
                </div>
                <div>
                  <Label>Tuesday</Label>
                  <Input type="text" value={professorData.time_availability.tuesday} disabled />
                </div>
                <div>
                  <Label>Wednesday</Label>
                  <Input type="text" value={professorData.time_availability.wednesday} disabled />
                </div>
                <div>
                  <Label>Thursday</Label>
                  <Input type="text" value={professorData.time_availability.thursday} disabled />
                </div>
                <div>
                  <Label>Friday</Label>
                  <Input type="text" value={professorData.time_availability.friday} disabled />
                </div>
                <div>
                  <Label>Saturday</Label>
                  <Input type="text" value={professorData.time_availability.saturday} disabled />
                </div>
                <div>
                  <Label>Sunday</Label>
                  <Input type="text" value={professorData.time_availability.sunday} disabled />
                </div>
              </div>
            </div>

            {/* Password Field */}
            <div className="mt-6">
              <Label>Password</Label>
              <Input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={sendingEmail}
              />
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button onClick={handleSendPassword} disabled={sendingEmail}>
                {sendingEmail ? "Sending..." : "Send Password via Email"}
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

// ========== EDIT PROFESSOR MODAL ==========
// Shows similar fields as CreateProfessorAccountModal (read-only fields for details)
// but allows editing status and an optional new password (Save button)
interface EditProfessorModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserEntry | null;
  onSuccess: () => void;
}
export const EditProfessorModal: React.FC<EditProfessorModalProps> = ({
  isOpen,
  onClose,
  user,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    // Prefill from user and professorData (if available)
    department: "",
    faculty_type: "",
    position: "",
    degrees: "",
    specialization: "",
    status: "INACTIVE",
    password: "",
    // Time availability fields removed
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && isOpen) {
      setLoading(true);
      // Fetch detailed professor data from the API
      fetch(`http://localhost:3001/api/users/professor/${user.user_id}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to fetch professor details");
          }
          return res.json();
        })
        .then((data) => {
          // Set professor data - exclude time availability fields
          setFormData({
            department: data.department || user.department || "",
            faculty_type: data.faculty_type || user.faculty_type || "",
            position: data.position || user.position || "",
            degrees: [
              data.bachelorsDegree || "",
              data.mastersDegree || "",
              data.doctorateDegree || ""
            ].filter(Boolean).join(", "),
            specialization: data.specialization || "",
            status: user.status || "INACTIVE",
            password: "", // blank until changed
          });
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching professor details:", error);
          // Fallback to user data from the users table
          setFormData({
            department: user.department || "",
            faculty_type: user.faculty_type || "",
            position: user.position || "",
            degrees: "Not available",
            specialization: "Not available",
            status: user.status || "INACTIVE",
            password: "", // blank until changed
          });
          setLoading(false);
        });
    }
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.status) {
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    setSaving(true);
    
    try {
      // PUT /api/users/professor/:userId to update professor details
      const response = await fetch(
        `http://localhost:3001/api/users/professor/${user.user_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            department: formData.department,
            faculty_type: formData.faculty_type,
            position: formData.position,
            degrees: formData.degrees,
            specialization: formData.specialization,
            status: formData.status,
            newPassword: formData.password, // if provided, update password
            // time_availability removed from request body
          }),
        }
      );
      if (!response.ok) throw new Error("Update failed");
      setTimeout(() => {
        onClose();
        Swal.fire("Success", "Professor updated!", "success").then(() => {
          onSuccess();
          setSaving(false);
        });
      }, 2000);
    } catch (err) {
      setSaving(false);
      console.error(err);
      Swal.fire("Error", "Failed to update professor.", "error");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] m-4" headerText={`Edit Professor - ${user.full_name}`} headerImage="/images/pnc-bg.jpg">
      <div className="p-4">
        {loading ? (
          <div className="text-center py-4">Loading professor details...</div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Department</Label>
                <Input
                  type="text"
                  name="department"
                  value={formData.department}
                  disabled
                />
              </div>
              <div>
                <Label>Faculty Type</Label>
                <Input
                  type="text"
                  name="faculty_type"
                  value={formData.faculty_type}
                  disabled
                />
              </div>
              <div>
                <Label>Position</Label>
                <Input
                  type="text"
                  name="position"
                  value={formData.position}
                  disabled
                />
              </div>
              <div>
                <Label>Degrees</Label>
                <Input
                  type="text"
                  name="degrees"
                  value={formData.degrees}
                  disabled
                />
              </div>
              <div>
                <Label>Specializations</Label>
                <Input
                  type="text"
                  name="specialization"
                  value={formData.specialization}
                  disabled
                />
              </div>
              <div>
                <Label>Status</Label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="mt-1 block w-full border p-2"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </div>
            </div>
            
            {/* Time Availability Section removed */}
            
            {/* Optional password change */}
            <div className="mt-6">
              <Label>New Password (optional)</Label>
              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Leave blank to keep existing"
              />
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};