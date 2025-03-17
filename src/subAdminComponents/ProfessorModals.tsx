import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { Modal } from "../components/ui/modal";
import Select, { MultiValue } from "react-select";

// TimeAvailability is used in both modal components
interface TimeAvailability {
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
}

interface SpecializationOption {
  value: string;
  label: string;
}

interface EditProfessorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  professorId: number | null;
}

interface AddProfessorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface ProfessorData {
  first_name: string;
  middle_name: string;
  last_name: string;
  extended_name: string;
  college_id: string;
  faculty_type: string;
  position: string;
  time_availability: TimeAvailability;
  bachelorsDegree: string;
  mastersDegree: string;
  doctorateDegree: string;
  specialization: string[];
  email: string;
  status: string;
}

export const AddProfessorModal: React.FC<AddProfessorModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [specializations, setSpecializations] = useState<SpecializationOption[]>([]);
  const [selectedSpecializations, setSelectedSpecializations] = useState<SpecializationOption[]>([]);
  const [colleges, setColleges] = useState<{ college_id: number; college_name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  
  // Retrieve department from localStorage
  const userDepartment = localStorage.getItem("department") || "";

  const [professor, setProfessor] = useState<ProfessorData>({
    first_name: "",
    middle_name: "",
    last_name: "",
    extended_name: "",
    college_id: "",
    faculty_type: "Full-time",
    position: "Professor",
    time_availability: {
      monday: "",
      tuesday: "",
      wednesday: "",
      thursday: "",
      friday: "",
      saturday: "",
      sunday: "",
    },
    bachelorsDegree: "",
    mastersDegree: "",
    doctorateDegree: "",
    specialization: [] as string[],
    email: "",
    status: "ACTIVE",
  });

  // Fetch colleges and specializations
  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        try {
          setLoading(true);
          
          // Fetch colleges
          const collegesResponse = await axios.get("http://localhost:3001/api/colleges");
          setColleges(collegesResponse.data);
          
          if (collegesResponse.data.length > 0) {
            setProfessor(prev => ({ ...prev, college_id: collegesResponse.data[0].college_id.toString() }));
          }
          
          // Fetch specializations
          if (userDepartment) {
            await fetchSpecializations(userDepartment);
          }
          
          setLoading(false);
        } catch (err) {
          console.error("Error fetching data:", err);
          setError("Failed to load initial data. Please try again.");
          setLoading(false);
        }
      };
      
      fetchData();
    }
  }, [isOpen, userDepartment]);

  const fetchSpecializations = async (department: string) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/curriculum/curriculum_courses?department=${department}`);
      
      if (!Array.isArray(response.data)) {
        console.error("Invalid response format, expected an array:", response.data);
        return;
      }
      
      const options = response.data.map((course: { course_title: string }) => ({
        value: course.course_title,
        label: course.course_title,
      }));
      
      setSpecializations(options);
    } catch (error) {
      console.error("Error fetching specialization subjects:", error);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfessor({ ...professor, [name]: value });
  };

  const handleTimeAvailabilityChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const day = name.replace('Availability', '').toLowerCase();
    setProfessor({
      ...professor,
      time_availability: {
        ...professor.time_availability,
        [day]: value
      }
    });
  };

  const handleSpecializationChange = (selectedOptions: MultiValue<SpecializationOption>) => {
    setSelectedSpecializations(selectedOptions as SpecializationOption[]);
    setProfessor({ ...professor, specialization: selectedOptions.map((opt) => opt.value) });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      await axios.post("http://localhost:3001/api/professors", professor);
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Error adding professor:", err);
      setError("Failed to add professor. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-4xl"
      headerText="Add New Professor"
      headerImage="/images/pnc-bg.jpg"
    >
      {loading ? (
        <div className="text-center p-6">Loading data...</div>
      ) : error ? (
        <div className="text-center text-red-500 p-6">{error}</div>
      ) : (
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

          {/* College, Faculty Type & Position */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm">College *</label>
              <select name="college_id" value={professor.college_id} onChange={handleChange} className="w-full p-2 border rounded">
                {colleges.map(college => (
                  <option key={college.college_id} value={college.college_id}>
                    {college.college_name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm">Faculty Type *</label>
              <select name="faculty_type" value={professor.faculty_type} onChange={handleChange} className="w-full p-2 border rounded">
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
              </select>
            </div>
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

          {/* Time Availability */}
          <div>
            <h3 className="text-lg font-medium mb-3">Time Availability</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm">Monday</label>
                <input 
                  type="text" 
                  name="mondayAvailability" 
                  value={professor.time_availability.monday} 
                  onChange={handleTimeAvailabilityChange} 
                  className="w-full p-2 border rounded"
                  placeholder="e.g. 08:00-17:00" 
                />
              </div>
              <div>
                <label className="block text-sm">Tuesday</label>
                <input 
                  type="text" 
                  name="tuesdayAvailability" 
                  value={professor.time_availability.tuesday} 
                  onChange={handleTimeAvailabilityChange} 
                  className="w-full p-2 border rounded"
                  placeholder="e.g. 08:00-17:00" 
                />
              </div>
              <div>
                <label className="block text-sm">Wednesday</label>
                <input 
                  type="text" 
                  name="wednesdayAvailability" 
                  value={professor.time_availability.wednesday} 
                  onChange={handleTimeAvailabilityChange} 
                  className="w-full p-2 border rounded"
                  placeholder="e.g. 08:00-17:00" 
                />
              </div>
              <div>
                <label className="block text-sm">Thursday</label>
                <input 
                  type="text" 
                  name="thursdayAvailability" 
                  value={professor.time_availability.thursday} 
                  onChange={handleTimeAvailabilityChange} 
                  className="w-full p-2 border rounded"
                  placeholder="e.g. 08:00-17:00" 
                />
              </div>
              <div>
                <label className="block text-sm">Friday</label>
                <input 
                  type="text" 
                  name="fridayAvailability" 
                  value={professor.time_availability.friday} 
                  onChange={handleTimeAvailabilityChange} 
                  className="w-full p-2 border rounded"
                  placeholder="e.g. 08:00-17:00" 
                />
              </div>
              <div>
                <label className="block text-sm">Saturday</label>
                <input 
                  type="text" 
                  name="saturdayAvailability" 
                  value={professor.time_availability.saturday} 
                  onChange={handleTimeAvailabilityChange} 
                  className="w-full p-2 border rounded"
                  placeholder="e.g. 08:00-12:00 (leave blank if not available)" 
                />
              </div>
              <div>
                <label className="block text-sm">Sunday</label>
                <input 
                  type="text" 
                  name="sundayAvailability" 
                  value={professor.time_availability.sunday} 
                  onChange={handleTimeAvailabilityChange} 
                  className="w-full p-2 border rounded"
                  placeholder="e.g. 08:00-12:00 (leave blank if not available)" 
                />
              </div>
            </div>
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

          <div className="flex space-x-4">
            <button 
              type="submit" 
              className="flex-1 bg-red-700 text-white p-2 rounded"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 bg-gray-300 text-gray-800 p-2 rounded"
              disabled={saving}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export const EditProfessorModal: React.FC<EditProfessorModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  professorId
}) => {
  const [specializations, setSpecializations] = useState<SpecializationOption[]>([]);
  const [selectedSpecializations, setSelectedSpecializations] = useState<SpecializationOption[]>([]);
  const [colleges, setColleges] = useState<{ college_id: number; college_name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  
  // Retrieve department from localStorage
  const userDepartment = localStorage.getItem("department") || "";

  const [professor, setProfessor] = useState<ProfessorData>({
    first_name: "",
    middle_name: "",
    last_name: "",
    extended_name: "",
    college_id: "",
    faculty_type: "Full-time",
    position: "Professor",
    time_availability: {
      monday: "",
      tuesday: "",
      wednesday: "",
      thursday: "",
      friday: "",
      saturday: "",
      sunday: "",
    },
    bachelorsDegree: "",
    mastersDegree: "",
    doctorateDegree: "",
    specialization: [] as string[],
    email: "",
    status: "ACTIVE",
  });

  // Fetch professor data, colleges, and specializations
  useEffect(() => {
    if (isOpen && professorId) {
      const fetchData = async () => {
        try {
          setLoading(true);
          
          // Fetch professor data
          const professorResponse = await axios.get(`http://localhost:3001/api/professors/${professorId}`);
          const professorData = professorResponse.data;
          
          // Fetch colleges
          const collegesResponse = await axios.get("http://localhost:3001/api/colleges");
          setColleges(collegesResponse.data);
          
          // Fetch specializations
          if (userDepartment) {
            await fetchSpecializations(userDepartment);
          }
          
          // Process specializations from string to array if needed
          let specializationArray: string[] = [];
          if (typeof professorData.specialization === 'string' && professorData.specialization.trim() !== '') {
            specializationArray = professorData.specialization.split(',').map((s: string) => s.trim());
          } else if (Array.isArray(professorData.specialization)) {
            specializationArray = professorData.specialization;
          }
          
          // Set professor data
          setProfessor({
            first_name: professorData.first_name || "",
            middle_name: professorData.middle_name || "",
            last_name: professorData.last_name || "",
            extended_name: professorData.extended_name || "",
            college_id: professorData.college_id?.toString() || "",
            faculty_type: professorData.faculty_type || "Full-time",
            position: professorData.position || "Professor",
            time_availability: professorData.time_availability || {
              monday: "",
              tuesday: "",
              wednesday: "",
              thursday: "",
              friday: "",
              saturday: "",
              sunday: "",
            },
            bachelorsDegree: professorData.bachelorsDegree || "",
            mastersDegree: professorData.mastersDegree || "",
            doctorateDegree: professorData.doctorateDegree || "",
            specialization: specializationArray,
            email: professorData.email || "",
            status: professorData.status || "ACTIVE",
          });
          
          // Set selected specializations for the dropdown
          if (specializationArray.length > 0) {
            setSelectedSpecializations(
              specializationArray.map(spec => ({ value: spec, label: spec }))
            );
          }
          
          setLoading(false);
        } catch (err) {
          console.error("Error fetching data:", err);
          setError("Failed to load professor data. Please try again.");
          setLoading(false);
        }
      };
      
      fetchData();
    }
  }, [isOpen, professorId, userDepartment]);

  const fetchSpecializations = async (department: string) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/curriculum/curriculum_courses?department=${department}`);
      
      if (!Array.isArray(response.data)) {
        console.error("Invalid response format, expected an array:", response.data);
        return;
      }
      
      const options = response.data.map((course: { course_title: string }) => ({
        value: course.course_title,
        label: course.course_title,
      }));
      
      setSpecializations(options);
    } catch (error) {
      console.error("Error fetching specialization subjects:", error);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfessor({ ...professor, [name]: value });
  };

  const handleTimeAvailabilityChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const day = name.replace('Availability', '').toLowerCase();
    setProfessor({
      ...professor,
      time_availability: {
        ...professor.time_availability,
        [day]: value
      }
    });
  };

  const handleSpecializationChange = (selectedOptions: MultiValue<SpecializationOption>) => {
    setSelectedSpecializations(selectedOptions as SpecializationOption[]);
    setProfessor({ ...professor, specialization: selectedOptions.map((opt) => opt.value) });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!professorId) return;
    
    try {
      setSaving(true);
      await axios.put(`http://localhost:3001/api/professors/${professorId}`, professor);
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Error updating professor:", err);
      setError("Failed to update professor. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-4xl"
      headerText="Edit Professor"
      headerImage="/images/pnc-bg.jpg"
    >
      {loading ? (
        <div className="text-center p-6">Loading professor data...</div>
      ) : error ? (
        <div className="text-center text-red-500 p-6">{error}</div>
      ) : (
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

          {/* College, Faculty Type & Position */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm">College *</label>
              <select name="college_id" value={professor.college_id} onChange={handleChange} className="w-full p-2 border rounded">
                {colleges.map(college => (
                  <option key={college.college_id} value={college.college_id}>
                    {college.college_name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm">Faculty Type *</label>
              <select name="faculty_type" value={professor.faculty_type} onChange={handleChange} className="w-full p-2 border rounded">
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
              </select>
            </div>
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

          {/* Time Availability */}
          <div>
            <h3 className="text-lg font-medium mb-3">Time Availability</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm">Monday</label>
                <input 
                  type="text" 
                  name="mondayAvailability" 
                  value={professor.time_availability.monday} 
                  onChange={handleTimeAvailabilityChange} 
                  className="w-full p-2 border rounded"
                  placeholder="e.g. 08:00-17:00" 
                />
              </div>
              <div>
                <label className="block text-sm">Tuesday</label>
                <input 
                  type="text" 
                  name="tuesdayAvailability" 
                  value={professor.time_availability.tuesday} 
                  onChange={handleTimeAvailabilityChange} 
                  className="w-full p-2 border rounded"
                  placeholder="e.g. 08:00-17:00" 
                />
              </div>
              <div>
                <label className="block text-sm">Wednesday</label>
                <input 
                  type="text" 
                  name="wednesdayAvailability" 
                  value={professor.time_availability.wednesday} 
                  onChange={handleTimeAvailabilityChange} 
                  className="w-full p-2 border rounded"
                  placeholder="e.g. 08:00-17:00" 
                />
              </div>
              <div>
                <label className="block text-sm">Thursday</label>
                <input 
                  type="text" 
                  name="thursdayAvailability" 
                  value={professor.time_availability.thursday} 
                  onChange={handleTimeAvailabilityChange} 
                  className="w-full p-2 border rounded"
                  placeholder="e.g. 08:00-17:00" 
                />
              </div>
              <div>
                <label className="block text-sm">Friday</label>
                <input 
                  type="text" 
                  name="fridayAvailability" 
                  value={professor.time_availability.friday} 
                  onChange={handleTimeAvailabilityChange} 
                  className="w-full p-2 border rounded"
                  placeholder="e.g. 08:00-17:00" 
                />
              </div>
              <div>
                <label className="block text-sm">Saturday</label>
                <input 
                  type="text" 
                  name="saturdayAvailability" 
                  value={professor.time_availability.saturday} 
                  onChange={handleTimeAvailabilityChange} 
                  className="w-full p-2 border rounded"
                  placeholder="e.g. 08:00-12:00 (leave blank if not available)" 
                />
              </div>
              <div>
                <label className="block text-sm">Sunday</label>
                <input 
                  type="text" 
                  name="sundayAvailability" 
                  value={professor.time_availability.sunday} 
                  onChange={handleTimeAvailabilityChange} 
                  className="w-full p-2 border rounded"
                  placeholder="e.g. 08:00-12:00 (leave blank if not available)" 
                />
              </div>
            </div>
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

          <div className="flex space-x-4">
            <button 
              type="submit" 
              className="flex-1 bg-red-700 text-white p-2 rounded"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 bg-gray-300 text-gray-800 p-2 rounded"
              disabled={saving}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}; 