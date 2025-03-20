import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Swal from "sweetalert2";

// Import SVG icons as React components
import EditIcon from "../../icons/edit.svg";
import DeleteIcon from "../../icons/delete.svg";
import ViewDetailsIcon from "../../icons/view-details-rtl.svg";

interface College {
  college_id: number;
  college_name: string;
  college_code: string;
}

interface Program {
  program_id?: number;
  program_name: string;
  program_code: string;
}

// ========== ADD/EDIT COLLEGE MODAL ==========
interface CollegeModalProps {
  isOpen: boolean;
  onClose: () => void;
  college: College | null; // null when creating new
  onSuccess: () => void;
}

export const CollegeModal: React.FC<CollegeModalProps> = ({
  isOpen,
  onClose,
  college,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    collegeName: "",
    collegeCode: "",
  });
  const [programList, setProgramList] = useState<Program[]>([]);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (college && isOpen) {
      setFormData({
        collegeName: college.college_name,
        collegeCode: college.college_code,
      });
      
      // Fetch programs for this college
      const fetchPrograms = async () => {
        try {
          const { data } = await axios.get(`http://localhost:3001/api/colleges/${college.college_id}/programs`);
          setProgramList(data);
        } catch (error) {
          console.error("Error fetching programs:", error);
          Swal.fire("Error", "Failed to fetch programs", "error");
        }
      };
      
      fetchPrograms();
    } else if (isOpen) {
      // Reset form for new college
      setFormData({
        collegeName: "",
        collegeCode: "",
      });
      setProgramList([]);
    }
  }, [college, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddProgram = () => {
    setProgramList([...programList, { program_name: "", program_code: "" }]);
  };

  const handleProgramChange = (index: number, key: keyof Program, value: string) => {
    const newPrograms = [...programList];
    newPrograms[index] = { ...newPrograms[index], [key]: value };
    setProgramList(newPrograms);
  };

  const handleRemoveProgram = (index: number) => {
    setProgramList(programList.filter((_, i) => i !== index));
  };

  const validateForm = (): boolean => {
    if (!formData.collegeName.trim() || !formData.collegeCode.trim()) {
      setFormError("Please fill all required fields.");
      return false;
    }

    const validPrograms = programList.filter(p => p.program_name && p.program_code);
    if (validPrograms.length === 0) {
      setFormError("Please add at least one program with both name and code.");
      return false;
    }

    setFormError("");
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    setSaving(true);

    try {
      const validPrograms = programList.filter(p => p.program_name && p.program_code);
      
      if (college) {
        // Update existing college
        await axios.put(`http://localhost:3001/api/colleges/${college.college_id}`, {
          college_name: formData.collegeName,
          college_code: formData.collegeCode,
          programs: validPrograms,
        });
        
        setTimeout(() => {
          onSuccess();
          onClose();
          setSaving(false);
          Swal.fire("Success", "College updated successfully", "success");
        }, 2000);
      } else {
        // Create new college
        await axios.post("http://localhost:3001/api/colleges", {
          college_name: formData.collegeName,
          college_code: formData.collegeCode,
          programs: validPrograms,
        });
        
        setTimeout(() => {
          onSuccess();
          onClose();
          setSaving(false);
          Swal.fire("Success", "College created successfully", "success");
        }, 2000);
      }
    } catch (error) {
      console.error("Error saving college:", error);
      setSaving(false);
      Swal.fire("Error", "Failed to save college", "error");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] m-4">
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
      <h2 className="text-xl font-semibold">
        {college ? `Edit College - ${college.college_name}` : "Create New College"}
      </h2>
    </div>

    <div className="p-4 overflow-y-auto max-h-[calc(80vh-80px)]">

        <div className="grid grid-cols-1 gap-4">
          <div>
            <Label>College Name</Label>
            <Input
              name="collegeName"
              value={formData.collegeName}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>College Code</Label>
            <Input
              name="collegeCode"
              value={formData.collegeCode}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Programs</h3>
          <Button
            onClick={handleAddProgram}
            className="mb-4 bg-green-700 hover:bg-green-600 text-white"
          >
            Add Program
          </Button>
          
          {programList.map((program, index) => (
            <div key={index} className="p-3 border rounded bg-gray-50 mb-3">
            <div className="grid grid-cols-1 gap-4">
            <Button
                variant="outline"
                className="!bg-red-500 hover:!bg-red-600 text-white w-40 ml-auto"
                onClick={() => handleRemoveProgram(index)}
              >
                Remove
              </Button>
                <div>
                <Label>Program Name</Label>
                <Input
                  value={program.program_name}
                  onChange={(e) => handleProgramChange(index, "program_name", e.target.value)}
                />
              </div>
              <div>
                <Label>Program Code</Label>
                <Input
                  value={program.program_code}
                  onChange={(e) => handleProgramChange(index, "program_code", e.target.value)}
                />
              </div>
            </div>
          </div>
          ))}
        </div>
        
        {formError && <div className="text-red-500 mt-2">{formError}</div>}
        
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={saving}
            className="bg-green-700 hover:bg-green-600 text-white"
          >
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

const CollegeTable: React.FC = () => {
  const [colleges, setColleges] = useState<College[]>([]);
  const [programs, setPrograms] = useState<Record<number, Program[]>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const collegesPerPage = 9;

  useEffect(() => {
    fetchColleges();
  }, []);

  const fetchColleges = async () => {
    try {
      const { data } = await axios.get("http://localhost:3001/api/colleges");
      setColleges(data);
    } catch (error) {
      Swal.fire("Error", "Failed to fetch colleges", "error");
      console.error("Fetch Colleges Error:", error);
    }
  };

  const fetchPrograms = async (college_id: number) => {
    try {
      const { data } = await axios.get(`http://localhost:3001/api/colleges/${college_id}/programs`);
      return data;
    } catch (error) {
      Swal.fire("Error", "Failed to fetch programs", "error");
      console.error("Fetch Programs Error:", error);
      return [];
    }
  };

  const handleDeleteCollege = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3001/api/colleges/${id}`);
      Swal.fire("Success", "College deleted successfully", "success");
      fetchColleges();
    } catch (error) {
      Swal.fire("Error", "Failed to delete college", "error");
      console.error("Delete College Error:", error);
    }
  };

  const handleViewDetails = async (college_id: number) => {
    if (programs[college_id]) {
      setPrograms(prev => {
        const newPrograms = { ...prev };
        delete newPrograms[college_id];
        return newPrograms;
      });
    } else {
      const data = await fetchPrograms(college_id);
      setPrograms(prev => ({ ...prev, [college_id]: data }));
    }
  };

  const handleEditCollege = (college: College) => {
    setSelectedCollege(college);
    setIsModalOpen(true);
  };
  
  const handleAddCollege = () => {
    setSelectedCollege(null);
    setIsModalOpen(true);
  };

  const handleModalSuccess = () => {
    fetchColleges();
  };

  // Pagination Logic
  const indexOfLastCollege = currentPage * collegesPerPage;
  const indexOfFirstCollege = indexOfLastCollege - collegesPerPage;
  const currentColleges = colleges.slice(indexOfFirstCollege, indexOfLastCollege);
  const totalPages = Math.ceil(colleges.length / collegesPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button 
          variant="primary" 
          className="bg-green-700 hover:bg-green-600 text-white"
          onClick={handleAddCollege}
        >
          ADD COLLEGE
        </Button>
      </div>
      
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="overflow-x-auto">
          <div className="min-w-[1102px]">
            <Table className="w-full border-collapse">
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start">
                    Department Name (Program Name)
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start">
                    College Code
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start">
                    Action
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentColleges.map((college, index) => (
                  <React.Fragment key={college.college_id}>
                    <TableRow className={index % 2 === 0 ? "bg-white" : "bg-green-50"}>
                      <TableCell className="px-5 py-4 text-start">
                        {college.college_name}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start">
                        {college.college_code}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start flex space-x-4">
                        <div 
                          onClick={() => handleEditCollege(college)}
                          className="cursor-pointer p-2 rounded-full hover:bg-green-100 transition-colors"
                        >
                          <img src={EditIcon} alt="Edit" className="w-5 h-5" />
                        </div>

                        <div 
                          onClick={() => handleDeleteCollege(college.college_id)}
                          className="cursor-pointer p-2 rounded-full hover:bg-red-100 transition-colors"
                        >
                          <img src={DeleteIcon} alt="Delete" className="w-5 h-5" />
                        </div>

                        <div 
                          onClick={() => handleViewDetails(college.college_id)}
                          className="cursor-pointer p-2 rounded-full hover:bg-blue-100 transition-colors"
                        >
                          <img src={ViewDetailsIcon} alt="View Details" className="w-5 h-5" />
                        </div>
                      </TableCell>
                    </TableRow>
                    {programs[college.college_id]?.map(program => (
                      <TableRow key={program.program_id} className={index % 2 === 0 ? "bg-white" : "bg-green-50"}>
                        <TableCell className="px-5 py-4 text-start pl-10">
                          {program.program_name}
                        </TableCell>
                        <TableCell className="px-5 py-4 text-start">
                          {program.program_code}
                        </TableCell>
                        <TableCell className="px-5 py-4 text-start"></TableCell>
                      </TableRow>
                    ))}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
            
            {/* Integrated Pagination within the table container */}
            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3">
              <div className="text-sm text-gray-700">
                Showing {indexOfFirstCollege + 1} to {Math.min(indexOfLastCollege, colleges.length)} of {colleges.length} entries
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="rounded px-3 py-1 text-gray-700"
                >
                  Previous
                </Button>
                
                {Array.from({ length: totalPages }, (_, i) => (
                  <Button
                    key={i + 1}
                    variant={currentPage === i + 1 ? "primary" : "outline"}
                    size="sm"
                    onClick={() => paginate(i + 1)}
                    className={`rounded px-3 py-1 ${
                      currentPage === i + 1 
                        ? "bg-green-600 text-white" 
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {i + 1}
                  </Button>
                ))}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="rounded px-3 py-1 text-gray-700"
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* College Modal */}
      <CollegeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        college={selectedCollege}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
};

export default CollegeTable;