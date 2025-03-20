import { useEffect, useState } from "react";
import axios from "axios";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table";
import { Modal } from "../../components/ui/modal";
import Button from "../../components/ui/button/Button";
import Swal from "sweetalert2";

interface YearSection {
  year_id: number;
  year_level: string;
  section: string;
  class_size: number;
  program_id: number;
  program_name: string;
  adviser: string;
}

interface Program {
  program_id: number;
  program_name: string;
}

const safeDisplay = (value: string | number | null | undefined): string => {
  return value !== null && value !== undefined && String(value).trim() !== "" ? String(value) : "N/A";
};

const SectionTable: React.FC = () => {
  const [yearSections, setYearSections] = useState<YearSection[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);


  const [newYearSection, setNewYearSection] = useState({
    year_level: "",
    section: "",
    class_size: 0, 
    program_id: 0,
    adviser: "",
  });

  // Filters
  const [selectedProgram, setSelectedProgram] = useState<number | "">("");
  const [selectedYearLevel, setSelectedYearLevel] = useState<string | "">("");
  const [filteredSections, setFilteredSections] = useState<YearSection[]>([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const sectionsPerPage = 10;

  // Store last sections by program_id AND year_level
  const [lastSections, setLastSections] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchYearSections();
    fetchPrograms();
  }, []);

  useEffect(() => {
    if (newYearSection.program_id && newYearSection.year_level) {
      updateNextSection();
    }
  }, [newYearSection.program_id, newYearSection.year_level]);

  useEffect(() => {
    handleFilterChange();
  }, [selectedProgram, selectedYearLevel, yearSections]);

  const fetchYearSections = async () => {
    try {
      setLoading(true);
      const college_code = localStorage.getItem("department");
      if (!college_code) {
        Swal.fire("Error", "No college code found. Please log in again.", "error");
        return;
      }

      const { data } = await axios.get<YearSection[]>(
        `http://localhost:3001/api/sections?college_code=${encodeURIComponent(college_code)}`,
        { withCredentials: true }
      );

      // Sort sections by year level in ascending order
      const sortedSections = sortByYearLevel(data);
      setYearSections(sortedSections);
      setFilteredSections(sortedSections);

      // Compute the last section for each program AND year level combination
      const lastSectionMap: { [key: string]: string } = {};
      data.forEach((section) => {
        const key = `${section.program_id}_${section.year_level}`;
        if (!lastSectionMap[key] || section.section > lastSectionMap[key]) {
          lastSectionMap[key] = section.section;
        }
      });

      setLastSections(lastSectionMap);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Error fetching year sections:", error.response?.data || error.message);
      }
      Swal.fire("Error", "Failed to fetch year sections.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = () => {
    let filtered = [...yearSections];
  
    if (selectedProgram !== "") {
      filtered = filtered.filter(section => section.program_id === Number(selectedProgram));
    }
  
    if (selectedYearLevel !== "") {
      filtered = filtered.filter(section => section.year_level === selectedYearLevel);
    }
  
    setFilteredSections(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Helper function to sort sections by year level
  const sortByYearLevel = (sections: YearSection[]): YearSection[] => {
    const yearOrder: { [key: string]: number } = {
      "1st Year": 1,
      "2nd Year": 2,
      "3rd Year": 3,
      "4th Year": 4,
    };

    return [...sections].sort((a, b) => {
      // First sort by year level
      const yearComparison = yearOrder[a.year_level] - yearOrder[b.year_level];
      
      // If same year level, then sort by program name
      if (yearComparison === 0) {
        const programComparison = a.program_name.localeCompare(b.program_name);
        
        // If same program, then sort by section
        if (programComparison === 0) {
          return a.section.localeCompare(b.section);
        }
        return programComparison;
      }
      return yearComparison;
    });
  };

  const fetchPrograms = async () => {
    try {
      const college_code = localStorage.getItem("department");
      if (!college_code) {
        Swal.fire("Error", "No college code found. Please log in again.", "error");
        return;
      }
      
      const { data } = await axios.get<Program[]>(
        `http://localhost:3001/api/sections/programs?college_code=${encodeURIComponent(college_code)}`,
        { withCredentials: true }
      );
      
      setPrograms(data);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Error fetching programs:", error);
      }
      Swal.fire("Error", "Failed to fetch programs.", "error");
    }
  };

  // Function to calculate the next section letter
  const updateNextSection = () => {
    if (!newYearSection.program_id || !newYearSection.year_level) return;

    // Create the key for the selected program and year level
    const key = `${newYearSection.program_id}_${newYearSection.year_level}`;
    
    // Get last section for this program and year level
    const lastSection = lastSections[key] || "";
    
    let nextSection = "A"; // Default to A if no section exists
    
    if (lastSection) {
      const lastChar = lastSection.slice(-1); // Get last character
      if (lastChar.match(/[A-Z]/)) {
        // If last character is A-Z, increment it
        nextSection = String.fromCharCode(lastChar.charCodeAt(0) + 1);
      }
    }
    
    setNewYearSection(prev => ({ ...prev, section: nextSection }));
  };

  // Function to handle class size changes with validation
  const handleClassSizeChange = (value: number) => {
    let size = value;
    
    // Enforce only maximum class size
    if (size > 50) size = 50;
    
    setNewYearSection(prev => ({ ...prev, class_size: size }));
  };

  const handleAddSection = () => {
    setNewYearSection({
      year_level: "",
      section: "",
      class_size: 0,
      program_id: 0,
      adviser: "",
    });
    setIsAddModalOpen(true);
  };

  const handleSaveSection = async () => {
    // Add validation to ensure all fields are filled
    if (!newYearSection.year_level || !newYearSection.section || 
        !newYearSection.class_size || !newYearSection.program_id || 
        !newYearSection.adviser.trim()) {
      Swal.fire("Error", "All fields are required", "error");
      return;
    }

    try {
      // Get the college_code from localStorage
      const college_code = localStorage.getItem("department");
      
      if (!college_code) {
        Swal.fire("Error", "No college code found. Please log in again.", "error");
        return;
      }
      
      await axios.post(
        `http://localhost:3001/api/sections?college_code=${encodeURIComponent(college_code)}`, 
        newYearSection, 
        { withCredentials: true }
      );
      
      Swal.fire("Success", "Year section added successfully", "success");
      fetchYearSections();
      setIsAddModalOpen(false);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Error adding section:", error.response?.data || error.message);
        Swal.fire("Error", error.response?.data?.error || "Failed to add year section", "error");
      } else {
        Swal.fire("Error", "Failed to add year section", "error");
      }
    }
  };

  // Pagination Logic
  const indexOfLastSection = currentPage * sectionsPerPage;
  const indexOfFirstSection = indexOfLastSection - sectionsPerPage;
  const currentSections = filteredSections.slice(indexOfFirstSection, indexOfLastSection);
  const totalPages = Math.ceil(filteredSections.length / sectionsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Function to calculate visible page numbers
  const getPageNumbers = () => {
    const totalPageCount = Math.ceil(filteredSections.length / sectionsPerPage);
    
    if (totalPageCount <= 5) {
      // If 5 or fewer pages, show all page numbers
      return Array.from({ length: totalPageCount }, (_, i) => i + 1);
    } else {
      // Show first, last, current, and adjacent pages
      const pageNumbers = [];
      
      pageNumbers.push(1); // Always show first page
      
      if (currentPage > 3) {
        pageNumbers.push(-1); // Show ellipsis if current page is away from start
      }
      
      // Show current page and adjacent pages
      if (currentPage > 2) pageNumbers.push(currentPage - 1);
      if (currentPage !== 1 && currentPage !== totalPageCount) pageNumbers.push(currentPage);
      if (currentPage < totalPageCount - 1) pageNumbers.push(currentPage + 1);
      
      if (currentPage < totalPageCount - 2) {
        pageNumbers.push(-2); // Show ellipsis if current page is away from end
      }
      
      pageNumbers.push(totalPageCount); // Always show last page
      
      return pageNumbers;
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between w-full mb-4">
        {/* Filters (Left Side) */}
        <div className="flex flex-wrap gap-x-4">
          {/* Program Filter */}
          <select
            className="p-3 border border-gray-400 rounded-lg text-black text-sm focus:outline-none w-48"
            value={selectedProgram}
            onChange={(e) => setSelectedProgram(e.target.value ? Number(e.target.value) : "")}
          >
            <option value="">All Programs</option>
            {programs.map(program => (
              <option key={program.program_id} value={program.program_id}>
                {program.program_name}
              </option>
            ))}
          </select>

          {/* Year Level Filter */}
          <select
            className="p-3 border border-gray-400 rounded-lg text-black text-sm focus:outline-none w-48"
            value={selectedYearLevel}
            onChange={(e) => setSelectedYearLevel(e.target.value)}
          >
            <option value="">All Year Levels</option>
            <option value="1st Year">1st Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
            <option value="4th Year">4th Year</option>
          </select>
        </div>

        {/* ADD SECTION Button (Right Side) */}
        <Button onClick={handleAddSection} className="bg-green-600 text-white ml-auto">
          ADD SECTION
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[1102px]">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start">
                    YEAR LEVEL
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start">
                    SECTION
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start">
                    CLASS SIZE
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start">
                    PROGRAM
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start">
                    ADVISER
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="px-5 py-4 text-center text-gray-600">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : currentSections.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="px-5 py-4 text-center text-gray-600">
                      No sections available.
                    </TableCell>
                  </TableRow>
                ) : (
                  currentSections.map((section, index) => (
                    <TableRow
                      key={section.year_id}
                      className={index % 2 === 0 ? "bg-white" : "bg-green-50"}
                    >
                      <TableCell className="px-5 py-4 text-start">
                        {safeDisplay(section.year_level)}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start">
                        {safeDisplay(section.section)}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start">
                        {safeDisplay(section.class_size)}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start">
                        {safeDisplay(section.program_name)}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start">
                        {safeDisplay(section.adviser)}
                      </TableCell>
                     
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            
            {/* Integrated Pagination directly below the table */}
            <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-t border-gray-200">
              <div className="text-md text-gray-600">
                Showing {filteredSections.length > 0 ? indexOfFirstSection + 1 : 0} to {Math.min(indexOfLastSection, filteredSections.length)} of {filteredSections.length} entries
              </div>
              
              <div className="flex items-center space-x-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="rounded px-2 py-1 text-xs text-gray-700 h-7"
                >
                  Prev
                </Button>
                
                {getPageNumbers().map((pageNumber, i) => (
                  pageNumber < 0 ? (
                    // Render ellipsis
                    <span key={`ellipsis-${i}`} className="px-2 py-1 text-gray-500">...</span>
                  ) : (
                    <Button
                      key={pageNumber}
                      variant={currentPage === pageNumber ? "primary" : "outline"}
                      size="sm"
                      onClick={() => paginate(pageNumber)}
                      className={`rounded w-7 h-7 flex items-center justify-center text-md ${
                        currentPage === pageNumber 
                          ? "bg-green-600 text-white" 
                          : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                      }`}
                    >
                      {pageNumber}
                    </Button>
                  )
                ))}
                
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="rounded px-2 py-1 text-xs text-gray-700 h-7"
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Section Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} className="max-w-[700px] m-4">
        {/* Header with background image */}
        <div 
          className="bg-cover bg-center p-4 rounded-t-lg text-white"
          style={{
            backgroundImage: 'url("/images/pnc-bg.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '80px',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <h2 className="text-xl font-semibold">ADDING SECTION</h2>
        </div>

        <div className="p-4 overflow-y-auto max-h-[calc(80vh-80px)]">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="mb-2">Year Level:</div>
              <select
                className="w-full p-2 border rounded"
                value={newYearSection.year_level}
                onChange={(e) => setNewYearSection({ ...newYearSection, year_level: e.target.value })}
              >
                <option value="">Select Year Level</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
            </div>
            
            <div>
              <div className="mb-2">Program:</div>
              <select
                className="w-full p-2 border rounded"
                value={newYearSection.program_id}
                onChange={(e) => setNewYearSection({ ...newYearSection, program_id: Number(e.target.value) })}
              >
                <option value="">Select Program</option>
                {programs.map((program) => (
                  <option key={program.program_id} value={program.program_id}>
                    {program.program_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="mb-2">Section:</div>
              <input
                type="text"
                className="w-full p-2 border rounded bg-gray-200"
                value={newYearSection.section}
                readOnly
                placeholder={newYearSection.program_id && newYearSection.year_level ? "Loading..." : "Select program and year level first"}
              />
              <span className="text-xs text-gray-500">
                Auto-generated based on program and year level
              </span>
            </div>

            <div>
              <div className="mb-2">Class Size:</div>
              <input
                type="number"
                className="w-full p-2 border rounded"
                value={newYearSection.class_size || ""}
                onChange={(e) => handleClassSizeChange(Number(e.target.value))}
                placeholder="Maximum 50 students"
                max="50"
              />
              <span className="text-xs text-gray-500">
                Maximum 50 students per class
              </span>
            </div>

            <div className="col-span-2">
              <div className="mb-2">Adviser:</div>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={newYearSection.adviser}
                onChange={(e) => setNewYearSection({ ...newYearSection, adviser: e.target.value })}
                placeholder="Enter adviser name"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Close
            </Button>
            <Button 
              onClick={handleSaveSection} 
              className="bg-green-700 hover:bg-green-600 text-white"
            >
              Save
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SectionTable;