import React, { useEffect, useState, ChangeEvent } from "react";
import axios from "axios";
import { AddProfessorModal, EditProfessorModal } from "./ProfessorModals";

interface TimeAvailability {
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
}

interface Professor {
  professor_id: number;
  full_name: string;
  department: string;
  faculty_type: string;
  position: string;
  time_availability: TimeAvailability;
  bachelorsDegree: string;
  mastersDegree: string;
  doctorateDegree: string;
  specialization: string;
  status: string;
}

const ProfessorTable: React.FC = () => {
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [filteredProfessors, setFilteredProfessors] = useState<Professor[]>([]);
  const [filter, setFilter] = useState({ name: "", specialization: "", facultyType: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProfessorId, setSelectedProfessorId] = useState<number | null>(null);
  
  // Get user department from localStorage
  const userDepartment = localStorage.getItem("department") || "";

  const fetchProfessors = async () => {
    try {
      setLoading(true);
      
      // Fetch all professors
      const res = await axios.get("http://localhost:3001/api/professors");
      
      // Filter professors by the user's department
      const departmentProfessors = res.data.filter(
        (prof: Professor) => prof.department === userDepartment
      );
      
      setProfessors(departmentProfessors);
      setFilteredProfessors(departmentProfessors);
      setLoading(false);
    } catch (err) {
      console.error("Fetch Error:", err);
      setError("Failed to fetch professors. Please try again.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userDepartment) {
      fetchProfessors();
    } else {
      setError("Department information not found. Please log in again.");
      setLoading(false);
    }
  }, [userDepartment]);

  useEffect(() => {
    let filtered = [...professors];

    if (filter.name.trim() !== "") {
      filtered = filtered.filter((prof) =>
        prof.full_name.toLowerCase().includes(filter.name.toLowerCase())
      );
    }
    if (filter.specialization.trim() !== "") {
      filtered = filtered.filter((prof) =>
        prof.specialization.toLowerCase().includes(filter.specialization.toLowerCase())
      );
    }
    if (filter.facultyType.trim() !== "") {
      filtered = filtered.filter((prof) => prof.faculty_type === filter.facultyType);
    }

    setFilteredProfessors(filtered);
    setCurrentPage(1);
  }, [filter, professors]);

  const handleFilterChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const handleEditProfessor = (professorId: number) => {
    setSelectedProfessorId(professorId);
    setShowEditModal(true);
  };

  // Format time availability for display
  const formatTimeAvailability = (timeAvailability: TimeAvailability) => {
    const days = [
      { day: 'Monday', value: timeAvailability.monday },
      { day: 'Tuesday', value: timeAvailability.tuesday },
      { day: 'Wednesday', value: timeAvailability.wednesday },
      { day: 'Thursday', value: timeAvailability.thursday },
      { day: 'Friday', value: timeAvailability.friday },
      { day: 'Saturday', value: timeAvailability.saturday },
      { day: 'Sunday', value: timeAvailability.sunday }
    ];
    
    const availableDays = days.filter(d => d.value && d.value.trim() !== '');
    
    if (availableDays.length === 0) {
      return "Not specified";
    }
    
    return availableDays.map(d => `${d.day}: ${d.value}`).join(', ');
  };

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredProfessors.slice(indexOfFirstRow, indexOfLastRow);

  return (
    <div className="p-6 bg-white rounded shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Professors List - {userDepartment} Department</h2>
        <button
          className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800"
          onClick={() => setShowAddModal(true)}
        >
          Add New Professor
        </button>
      </div>

      {/* Filters */}
      <div className="mb-4 grid grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Search by Name"
          name="name"
          value={filter.name}
          onChange={handleFilterChange}
          className="p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Search by Specialization"
          name="specialization"
          value={filter.specialization}
          onChange={handleFilterChange}
          className="p-2 border rounded"
        />
        <select
          name="facultyType"
          value={filter.facultyType}
          onChange={handleFilterChange}
          className="p-2 border rounded"
        >
          <option value="">All Faculty Types</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
        </select>
      </div>

      {/* Show Loading or Error Message */}
      {loading && <p className="text-center text-gray-500">Loading professors...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Table */}
      {!loading && !error && (
        <>
          {filteredProfessors.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              No professors found in the {userDepartment} department. Add a new professor to get started.
            </div>
          ) : (
            <table className="w-full border border-collapse">
              <thead>
                <tr className="bg-red-700 text-white">
                  <th className="p-2 border">Full Name</th>
                  <th className="p-2 border">Faculty Type</th>
                  <th className="p-2 border">Position</th>
                  <th className="p-2 border">Time Availability</th>
                  <th className="p-2 border">Bachelor's Degree</th>
                  <th className="p-2 border">Master's Degree</th>
                  <th className="p-2 border">Doctorate Degree</th>
                  <th className="p-2 border">Specialization</th>
                  <th className="p-2 border">Status</th>
                  <th className="p-2 border">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentRows.map((prof) => (
                  <tr key={prof.professor_id} className="text-center">
                    <td className="p-2 border">{prof.full_name || "No Name Provided"}</td>
                    <td className="p-2 border">{prof.faculty_type}</td>
                    <td className="p-2 border">{prof.position}</td>
                    <td className="p-2 border">{formatTimeAvailability(prof.time_availability)}</td>
                    <td className="p-2 border">{prof.bachelorsDegree || "N/A"}</td>
                    <td className="p-2 border">{prof.mastersDegree || "N/A"}</td>
                    <td className="p-2 border">{prof.doctorateDegree || "N/A"}</td>
                    <td className="p-2 border">{prof.specialization || "N/A"}</td>
                    <td className="p-2 border">{prof.status}</td>
                    <td className="p-2 border">
                      <button
                        onClick={() => handleEditProfessor(prof.professor_id)}
                        className="px-3 py-1 bg-orange-700 text-white rounded hover:bg-red-800"
                      >
                        EDIT
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}

      {/* Pagination */}
      {!loading && !error && filteredProfessors.length > rowsPerPage && (
        <div className="flex justify-center mt-4">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 rounded mr-2 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-3 py-1">
            Page {currentPage} of {Math.ceil(filteredProfessors.length / rowsPerPage)}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredProfessors.length / rowsPerPage)))}
            disabled={currentPage === Math.ceil(filteredProfessors.length / rowsPerPage)}
            className="px-3 py-1 bg-gray-200 rounded ml-2 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Modal for Adding a New Professor */}
      <AddProfessorModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={() => {
          fetchProfessors();
          setShowAddModal(false);
        }}
      />

      {/* Modal for Editing a Professor */}
      <EditProfessorModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSuccess={() => {
          fetchProfessors();
          setShowEditModal(false);
        }}
        professorId={selectedProfessorId}
      />
    </div>
  );
};

export default ProfessorTable;