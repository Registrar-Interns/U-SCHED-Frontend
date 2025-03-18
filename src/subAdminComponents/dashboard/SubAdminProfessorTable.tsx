import { useState, useEffect, useMemo } from "react";
import PaginatedTable from "../../components/common/PaginatedTable";
import { getDepartmentHeaderColor } from "../../utils/departmentBranding";

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

// Define the formatted data interface with index signature
interface FormattedProfessorData {
  [key: string]: string | Professor;
  "Full Name": string;
  "Specialization": string;
  "Degree": string;
  "Time Availability": string;
  "Faculty Type": string;
  "Position": string;
  originalProfessor: Professor;
}

// Updated columns to remove department since we're only showing one department
const columns = ["Full Name", "Specialization", "Degree", "Time Availability", "Faculty Type", "Position"];

interface SubAdminProfessorTableProps {
  department: string;
}

export default function SubAdminProfessorTable({ department }: SubAdminProfessorTableProps) {
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get the department's branding colors
  const headerColor = getDepartmentHeaderColor(department);
  const textColor = "text-white";
  const tableBgColor = "bg-white";

  useEffect(() => {
    // Fetch professors for the specified department
    const fetchProfessors = async () => {
      try {
        setLoading(true);
        
        // Fetch all professors
        const professorsResponse = await fetch(`http://localhost:3001/api/professors`);
        if (!professorsResponse.ok) {
          throw new Error(`API Error: ${professorsResponse.status}`);
        }
        
        const allProfessors = await professorsResponse.json();
        
        // Filter professors by department
        const departmentProfessors = allProfessors.filter(
          (professor: Professor) => professor.department === department
        );
        
        setProfessors(departmentProfessors);
      } catch (err) {
        console.error("Failed to fetch professors:", err);
        setError("Failed to load professors. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfessors();
  }, [department]);

  // Format the data for the table
  const formattedData = useMemo(() => {
    return professors.map(professor => {
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
        "Specialization": professor.specialization || "Not specified",
        "Degree": highestDegree,
        "Time Availability": timeAvailability,
        "Faculty Type": professor.faculty_type,
        "Position": professor.position,
        // Keep the original data for reference if needed
        originalProfessor: professor
      };
    });
  }, [professors]);

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

  // Custom header render function to apply department branding
  const renderHeader = (column: string) => {
    return (
      <div className={`px-3 py-2 ${headerColor} ${textColor} font-semibold`}>
        {column}
      </div>
    );
  };

  if (loading) {
    return <div className="p-4 text-center">Loading professors...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Professors - {department}</h2>
        <div className="text-sm text-gray-500">
          Total: {professors.length} professors
        </div>
      </div>
      {professors.length === 0 ? (
        <div className="p-4 text-center text-gray-500">
          No professors found for this department.
        </div>
      ) : (
        <PaginatedTable 
          columns={columns} 
          data={formattedData} 
          renderCell={renderCell}
          renderHeader={renderHeader}
          tableClassName={tableBgColor}
          departmentColor={headerColor}
        />
      )}
    </div>
  );
} 