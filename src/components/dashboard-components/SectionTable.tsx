import { useState, useEffect } from "react";
import PaginatedTable from "../common/PaginatedTable";

// Define the Section interface
interface Section {
  section_id: number;
  section_name: string;
  department: string;
  program: string;
  year_level: string;
  total_students: number;
}

// Define the formatted data interface with index signature
interface FormattedSectionData {
  [key: string]: string | number | Section;
  "Section Name": string;
  "Department": string;
  "Program": string;
  "Year Level": string;
  "Total Students": number;
  originalSection: Section;
}

const columns = ["Section Name", "Department", "Program", "Year Level", "Total Students"];

export default function SectionTable() {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // For now, we'll use mock data since the actual API endpoint might not exist yet
    // In a real implementation, you would fetch this from the API
    const fetchSections = async () => {
      try {
        setLoading(true);
        
        // Mock data - replace with actual API call when available
        // Example: const response = await fetch('http://localhost:3001/api/sections');
        // if (!response.ok) throw new Error(`API Error: ${response.status}`);
        // const data = await response.json();
        
        // Using mock data for now
        const mockData: Section[] = Array.from({ length: 30 }, (_, i) => ({
          section_id: i + 1,
          section_name: `BSIT-${i + 1}`,
          department: "CCS",
          program: "BSIT",
          year_level: "3rd Year",
          total_students: Math.floor(Math.random() * 50) + 10,
        }));
        
        setTimeout(() => {
          setSections(mockData);
          setLoading(false);
        }, 500); // Simulate network delay
      } catch (err) {
        console.error("Failed to fetch sections:", err);
        setError("Failed to load sections. Please try again later.");
        setLoading(false);
      }
    };

    fetchSections();
  }, []);

  // Format the data for the table
  const formattedData = sections.map(section => ({
    "Section Name": section.section_name,
    "Department": section.department,
    "Program": section.program,
    "Year Level": section.year_level,
    "Total Students": section.total_students,
    // Keep the original data for reference if needed
    originalSection: section
  }));

  // Custom render function for cells
  const renderCell = (row: FormattedSectionData, column: string) => {
    if (column === "Total Students") {
      return row[column].toString();
    }
    
    const value = row[column];
    return typeof value === 'string' ? value : "N/A";
  };

  if (loading) {
    return <div className="p-4 text-center">Loading sections...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Sections</h2>
      <PaginatedTable 
        columns={columns} 
        data={formattedData} 
        renderCell={renderCell}
      />
    </div>
  );
}