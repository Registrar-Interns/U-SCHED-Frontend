import { useState, useEffect, useMemo } from "react";
import PaginatedTable from "../../components/common/PaginatedTable";
import { getDepartmentHeaderColor } from "../../utils/departmentBranding";

// Define the Section interface
interface Section {
  section_id: number;
  section_name: string;
  program: string;
  year_level: string;
  semester: string;
  num_students: number;
  status: string;
}

// Define the formatted data interface with index signature
interface FormattedSectionData {
  [key: string]: string | number | Section;
  "Section": string;
  "Program": string;
  "Year Level": string;
  "Semester": string;
  "Students": string;
  "Status": string;
  originalSection: Section;
}

const columns = ["Section", "Program", "Year Level", "Semester", "Students", "Status"];

interface SubAdminSectionTableProps {
  department: string;
}

export default function SubAdminSectionTable({ department }: SubAdminSectionTableProps) {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get the department's branding colors
  const headerColor = getDepartmentHeaderColor(department);
  const textColor = "text-white";
  const tableBgColor = "bg-white";

  useEffect(() => {
    // Fetch sections from the API
    const fetchSections = async () => {
      try {
        setLoading(true);
        
        // This API endpoint is a placeholder, replace with your actual endpoint
        const response = await fetch(`http://localhost:3001/api/sections?department=${department}`);
        if (!response.ok) {
          // If the API is not implemented yet, use sample data
          console.warn("Sections API not available, using sample data");
          
          // Sample data for demonstration purposes
          const sampleSections = [
            { section_id: 1, section_name: "BSCS 1A", program: "BSCS", year_level: "1st Year", semester: "1st Semester", num_students: 35, status: "Active" },
            { section_id: 2, section_name: "BSCS 1B", program: "BSCS", year_level: "1st Year", semester: "1st Semester", num_students: 32, status: "Active" },
            { section_id: 3, section_name: "BSCS 2A", program: "BSCS", year_level: "2nd Year", semester: "1st Semester", num_students: 30, status: "Active" },
            { section_id: 4, section_name: "BSCS 2B", program: "BSCS", year_level: "2nd Year", semester: "1st Semester", num_students: 28, status: "Active" },
            { section_id: 5, section_name: "BSCS 3A", program: "BSCS", year_level: "3rd Year", semester: "1st Semester", num_students: 25, status: "Active" },
            { section_id: 6, section_name: "BSCS 3B", program: "BSCS", year_level: "3rd Year", semester: "1st Semester", num_students: 22, status: "Active" },
            { section_id: 7, section_name: "BSCS 4A", program: "BSCS", year_level: "4th Year", semester: "1st Semester", num_students: 20, status: "Active" },
            { section_id: 8, section_name: "BSCS 4B", program: "BSCS", year_level: "4th Year", semester: "1st Semester", num_students: 18, status: "Active" },
            { section_id: 9, section_name: "BSIT 1A", program: "BSIT", year_level: "1st Year", semester: "1st Semester", num_students: 40, status: "Active" },
            { section_id: 10, section_name: "BSIT 1B", program: "BSIT", year_level: "1st Year", semester: "1st Semester", num_students: 38, status: "Active" },
          ];
          
          setSections(sampleSections);
          setLoading(false);
          return;
        }
        
        const data = await response.json();
        setSections(data);
      } catch (err) {
        console.error("Failed to fetch sections:", err);
        
        // Fallback to sample data if API fails
        const sampleSections = [
          { section_id: 1, section_name: "BSCS 1A", program: "BSCS", year_level: "1st Year", semester: "1st Semester", num_students: 35, status: "Active" },
          { section_id: 2, section_name: "BSCS 1B", program: "BSCS", year_level: "1st Year", semester: "1st Semester", num_students: 32, status: "Active" },
          { section_id: 3, section_name: "BSCS 2A", program: "BSCS", year_level: "2nd Year", semester: "1st Semester", num_students: 30, status: "Active" },
          { section_id: 4, section_name: "BSCS 2B", program: "BSCS", year_level: "2nd Year", semester: "1st Semester", num_students: 28, status: "Active" },
          { section_id: 5, section_name: "BSCS 3A", program: "BSCS", year_level: "3rd Year", semester: "1st Semester", num_students: 25, status: "Active" },
        ];
        
        setSections(sampleSections);
      } finally {
        setLoading(false);
      }
    };

    fetchSections();
  }, [department]);

  // Format the data for the table
  const formattedData = useMemo(() => {
    return sections.map(section => ({
      "Section": section.section_name,
      "Program": section.program,
      "Year Level": section.year_level,
      "Semester": section.semester,
      "Students": section.num_students.toString(),
      "Status": section.status,
      originalSection: section
    }));
  }, [sections]);

  // Custom render function for cells
  const renderCell = (row: FormattedSectionData, column: string) => {
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
    return <div className="p-4 text-center">Loading sections...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Sections - {department}</h2>
        <div className="text-sm text-gray-500">
          Total: {sections.length} sections
        </div>
      </div>
      {sections.length === 0 ? (
        <div className="p-4 text-center text-gray-500">
          No sections found for this department.
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