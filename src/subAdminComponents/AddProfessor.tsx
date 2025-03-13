import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Select, { MultiValue } from "react-select";

interface AddProfessorProps {
  onProfessorAdded: () => void;
}

interface SpecializationOption {
  value: string;
  label: string;
}

const AddProfessor: React.FC<AddProfessorProps> = ({ onProfessorAdded }) => {
  const navigate = useNavigate();
  const [specializations, setSpecializations] = useState<SpecializationOption[]>([]);
  const [selectedSpecializations, setSelectedSpecializations] = useState<SpecializationOption[]>([]);
  
  // Retrieve department from localStorage
  const userDepartment = localStorage.getItem("department") || "";  // ✅ Extract stored department

  const [professor, setProfessor] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    extended_name: "",
    faculty_type: "Full-time",
    position: "Professor",
    time_availability: "",
    bachelorsDegree: "",
    mastersDegree: "",
    doctorateDegree: "",
    specialization: [] as string[], // ✅ Specialization set to string[]
    email: "",
    status: "ACTIVE",
  });

  // Fetch user department dynamically
   // Fetch specialization subjects based on department
   useEffect(() => {
    if (userDepartment) {
      fetchSpecializations(userDepartment);
    }
  }, [userDepartment]);

  const fetchSpecializations = async (department: string) => {
    try {
        console.log("Fetching Specializations for Department:", department); // 🔍 Debugging

        // ✅ Ensure correct API path (add "curriculum/" prefix)
        const response = await axios.get(`http://localhost:3001/api/curriculum/curriculum_courses?department=${department}`);

        console.log("API Response Data:", response.data); // 🔍 Debug API response

        if (!Array.isArray(response.data)) {
            console.error("Invalid response format, expected an array:", response.data);
            return;
        }

        // Map the response to match react-select format
        const options = response.data.map((course: { course_title: string }) => ({
            value: course.course_title,
            label: course.course_title,
        }));

        console.log("Mapped Specialization Options:", options); // 🔍 Debug mapped options
        setSpecializations(options);
    } catch (error) {
        console.error("Error fetching specialization subjects:", error);
    }
};



  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setProfessor({ ...professor, [e.target.name]: e.target.value });
  };

  const handleSpecializationChange = (selectedOptions: MultiValue<SpecializationOption>) => {
    setSelectedSpecializations(selectedOptions as SpecializationOption[]); // ✅ Casting specialization type correctly
    setProfessor({ ...professor, specialization: selectedOptions.map((opt) => opt.value) });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3001/api/professors", professor);
      onProfessorAdded();
      navigate("/professors");
    } catch (err) {
      console.error("Error adding professor:", err);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded shadow-md">
      <h2 className="text-center text-xl font-bold bg-red-700 text-white p-2">Add New Professor</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm">Last Name *</label>
            <input type="text" name="last_name" value={professor.last_name} onChange={handleChange} className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm">First Name *</label>
            <input type="text" name="first_name" value={professor.first_name} onChange={handleChange} className="w-full p-2 border rounded" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm">Middle Name *</label>
            <input type="text" name="middle_name" value={professor.middle_name} onChange={handleChange} className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm">Extended Name</label>
            <input type="text" name="extended_name" value={professor.extended_name} onChange={handleChange} className="w-full p-2 border rounded" />
          </div>
        </div>

        {/* Faculty Type & Position */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm">Faculty Type *</label>
            <select name="faculty_type" value={professor.faculty_type} onChange={handleChange} className="w-full p-2 border rounded">
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
            </select>
          </div>
          <div>
            <label className="block text-sm">Position *</label>
            <select name="position" value={professor.position} onChange={handleChange} className="w-full p-2 border rounded">
              <option value="Professor">Professor</option>
              <option value="Assistant Professor">Assistant Professor</option>
              <option value="Associate Professor">Associate Professor</option>
              <option value="Lecturer">Lecturer</option>
            </select>
          </div>
        </div>

        {/* Time Availability */}
        <div>
          <label className="block text-sm">Time Availability (if Part-time)</label>
          <input type="text" name="time_availability" value={professor.time_availability} onChange={handleChange} className="w-full p-2 border rounded" />
        </div>

        {/* Degree Fields */}
        <div>
          <label className="block text-sm">Bachelor's Degree *</label>
          <input type="text" name="bachelorsDegree" value={professor.bachelorsDegree} onChange={handleChange} className="w-full p-2 border rounded" />
        </div>

        <div>
          <label className="block text-sm">Master's Degree *</label>
          <input type="text" name="mastersDegree" value={professor.mastersDegree} onChange={handleChange} className="w-full p-2 border rounded" />
        </div>

        <div>
          <label className="block text-sm">Doctorate Degree *</label>
          <input type="text" name="doctorateDegree" value={professor.doctorateDegree} onChange={handleChange} className="w-full p-2 border rounded" />
        </div>

        {/* Specialization (Fixed with Multi-Select Dropdown) */}
        <div>
          <label>Specialization *</label>
          <Select
            options={specializations}
            isMulti
            value={selectedSpecializations}
            onChange={handleSpecializationChange}
          />
        </div>

        {/* Email & Status */}
        <div>
          <label className="block text-sm">Email Address *</label>
          <input type="email" name="email" value={professor.email} onChange={handleChange} className="w-full p-2 border rounded" />
        </div>

        <div>
          <label className="block text-sm">Status</label>
          <select name="status" value={professor.status} onChange={handleChange} className="w-full p-2 border rounded">
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>

        <button type="submit" className="w-full bg-red-700 text-white p-2 rounded">Save</button>
      </form>
    </div>
  );
};

export default AddProfessor;