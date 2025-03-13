import React, { useEffect, useState, ChangeEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AddProfessor from "../subAdminComponents/AddProfessor";

interface Professor {
  professor_id: number;
  full_name: string;
  department: string;
  faculty_type: string;
  position: string;
  time_availability?: string;
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
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const fetchProfessors = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/professors");
      setProfessors(res.data);
      setFilteredProfessors(res.data); // ✅ Ensure both states are updated
      setLoading(false);
    } catch (err) {
      console.error("Fetch Error:", err);
      setError("Failed to fetch professors. Please try again.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfessors();
  }, []);

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

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredProfessors.slice(indexOfFirstRow, indexOfLastRow);

  return (
    <div className="p-6 bg-white rounded shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Professors List</h2>
        <button
          className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800"
          onClick={() => setShowModal(true)}
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
        <table className="w-full border border-collapse">
          <thead>
            <tr className="bg-red-700 text-white">
              <th className="p-2 border">Full Name</th>
              <th className="p-2 border">Department</th>
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
                <td className="p-2 border">{prof.department}</td>
                <td className="p-2 border">{prof.faculty_type}</td>
                <td className="p-2 border">{prof.position}</td>
                <td className="p-2 border">{prof.time_availability || "N/A"}</td>
                <td className="p-2 border">{prof.bachelorsDegree || "N/A"}</td>
                <td className="p-2 border">{prof.mastersDegree || "N/A"}</td>
                <td className="p-2 border">{prof.doctorateDegree || "N/A"}</td>
                <td className="p-2 border">{prof.specialization || "N/A"}</td>
                <td className="p-2 border">{prof.status}</td>
                <td className="p-2 border">
                  <button
                    onClick={() => navigate(`/edit-professor/${prof.professor_id}`)}
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

      {/* Modal for Adding a New Professor */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-md w-2/3 relative">
            <h2 className="text-xl font-bold mb-4">Add New Professor</h2>
            <button
              className="absolute top-4 right-4 bg-gray-300 rounded-full px-2 py-1"
              onClick={() => setShowModal(false)}
            >
              ✖
            </button>
            <AddProfessor
              onProfessorAdded={() => {
                setShowModal(false);
                fetchProfessors(); // ✅ Ensure table updates after adding new professor
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfessorTable;