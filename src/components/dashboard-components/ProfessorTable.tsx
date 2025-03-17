import { useState, useEffect, useMemo } from "react";
import PaginatedTable from "../common/PaginatedTable";

// Define the Professor interface
interface Professor {
  professor_id: number;
  full_name: string;
  department: string;
  specialization: string;
  bachelorsDegree?: string;
  mastersDegree?: string;
  doctorateDegree?: string;
  time_availability?: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  faculty_type: string;
  position: string;
}

// Define the College interface
interface College {
  college_id: number;
  college_name: string;
  college_code: string;
}

// Define the formatted data interface with index signature
interface FormattedProfessorData {
  [key: string]: string | Professor;
  "Full Name": string;
  "Department": string;
  "Specialization": string;
  "Degree": string;
  "Time Availability": string;
  "Faculty Type": string;
  "Position": string;
  originalProfessor: Professor;
}

// Updated columns to include department
const columns = ["Full Name", "Department", "Specialization", "Degree", "Time Availability", "Faculty Type", "Position"];

export default function ProfessorTable() {
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [colleges, setColleges] = useState<College[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch professors and colleges directly
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch professors
        const professorsResponse = await fetch('http://localhost:3001/api/professors');
        if (!professorsResponse.ok) {
          throw new Error(`API Error: ${professorsResponse.status}`);
        }
        const professorsData = await professorsResponse.json();
        setProfessors(professorsData);
        
        // Fetch colleges
        const collegesResponse = await fetch('http://localhost:3001/api/professors/colleges/all');
        if (!collegesResponse.ok) {
          throw new Error(`API Error: ${collegesResponse.status}`);
        }
        const collegesData = await collegesResponse.json();
        setColleges(collegesData);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Failed to load professors. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter professors by department
  const filteredProfessors = useMemo(() => {
    if (selectedDepartment === "all") {
      return professors;
    }
    return professors.filter(professor => professor.department === selectedDepartment);
  }, [professors, selectedDepartment]);

  // Format the data for the table
  const formattedData = filteredProfessors.map(professor => {
    // Determine the highest degree
    let highestDegree = "N/A";
    if (professor.doctorateDegree) {
      highestDegree = professor.doctorateDegree;
    } else if (professor.mastersDegree) {
      highestDegree = professor.mastersDegree;
    } else if (professor.bachelorsDegree) {
      highestDegree = professor.bachelorsDegree;
    }

    // Format time availability
    let timeAvailability = "Not specified";
    if (professor.time_availability) {
      const days = [];
      if (professor.time_availability.monday) days.push(`Mon: ${professor.time_availability.monday}`);
      if (professor.time_availability.tuesday) days.push(`Tue: ${professor.time_availability.tuesday}`);
      if (professor.time_availability.wednesday) days.push(`Wed: ${professor.time_availability.wednesday}`);
      if (professor.time_availability.thursday) days.push(`Thu: ${professor.time_availability.thursday}`);
      if (professor.time_availability.friday) days.push(`Fri: ${professor.time_availability.friday}`);
      if (professor.time_availability.saturday) days.push(`Sat: ${professor.time_availability.saturday}`);
      if (professor.time_availability.sunday) days.push(`Sun: ${professor.time_availability.sunday}`);
      
      if (days.length > 0) {
        timeAvailability = days.join(", ");
      }
    }

    return {
      "Full Name": professor.full_name,
      "Department": professor.department || "Not assigned",
      "Specialization": professor.specialization || "Not specified",
      "Degree": highestDegree,
      "Time Availability": timeAvailability,
      "Faculty Type": professor.faculty_type,
      "Position": professor.position,
      // Keep the original data for reference if needed
      originalProfessor: professor
    };
  });

  // Custom render function for cells
  const renderCell = (row: FormattedProfessorData, column: string) => {
    if (column === "Time Availability") {
      // For time availability, show a truncated version if it's too long
      const value = row[column] as string;
      if (value.length > 30) {
        return `${value.substring(0, 30)}...`;
      }
    }
    
    // Return the value for the column, or "N/A" if it doesn't exist
    const value = row[column];
    return typeof value === 'string' ? value : "N/A";
  };

  // Create department filter options
  const departmentFilters = useMemo(() => {
    return [
      { value: "all", label: "All Departments" },
      ...colleges.map(college => ({
        value: college.college_code,
        label: college.college_name
      }))
    ];
  }, [colleges]);

  // Create filters for PaginatedTable
  const tableFilters = [
    {
      column: "Department_filter",
      options: departmentFilters
    }
  ];

  if (loading) {
    return <div className="p-4 text-center">Loading professors...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Professors</h2>
        <div className="flex items-center">
          <span className="mr-2 text-sm text-gray-700">Department:</span>
          <select
            className="border border-gray-300 rounded-lg p-2 text-sm w-48"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
          >
            <option value="all">All Departments</option>
            {colleges.map((college) => (
              <option key={college.college_id} value={college.college_code}>
                {college.college_name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <PaginatedTable 
        columns={columns} 
        data={formattedData} 
        renderCell={renderCell}
        filters={tableFilters}
      />
    </div>
  );
}