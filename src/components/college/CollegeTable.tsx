import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { useModal } from "../../hooks/useModal";
import Swal from "sweetalert2";

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

const CollegeTable: React.FC = () => {
  const [colleges, setColleges] = useState<College[]>([]);
  const [programs, setPrograms] = useState<Record<number, Program[]>>({});
  const { isOpen, openModal, closeModal } = useModal();

  const [collegeName, setCollegeName] = useState("");
  const [collegeCode, setCollegeCode] = useState("");
  const [programList, setProgramList] = useState<Program[]>([]);
  const [editingCollege, setEditingCollege] = useState<College | null>(null);

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



  const handleAddProgram = () => {
    setProgramList([...programList, { program_id: undefined, program_name: "", program_code: "" }]);


  };

  const handleProgramChange = (index: number, key: keyof Program, value: string) => {
    const newPrograms = [...programList];
    newPrograms[index] = { ...newPrograms[index], [key]: value };
    setProgramList(newPrograms);
  };

  const handleRemoveProgram = (index: number) => {
    setProgramList(programList.filter((_, i) => i !== index));
  };

  const handleEditCollege = async (college: College) => {
    setEditingCollege(college);
    setCollegeName(college.college_name);
    setCollegeCode(college.college_code);
    const fetchedPrograms = await fetchPrograms(college.college_id);
    setProgramList(fetchedPrograms);
    openModal();
  };

  const handleSaveCollege = async () => {
    if (!collegeName.trim() || !collegeCode.trim()) {
      Swal.fire("Error", "Please fill all fields", "error");
      return;
    }

    const validPrograms = programList.filter(p => p.program_name && p.program_code);
    if (validPrograms.length === 0) {
      Swal.fire("Error", "Please add at least one program", "error");
      return;
    }

    try {
      if (editingCollege) {
        await axios.put(`http://localhost:3001/api/colleges/${editingCollege.college_id}`, {
          college_name: collegeName,
          college_code: collegeCode,
          programs: validPrograms,
        });

        Swal.fire("Success", "College updated successfully!", "success");
      } else {
        await axios.post("http://localhost:3001/api/colleges", {
          college_name: collegeName,
          college_code: collegeCode,
          programs: validPrograms,
        });

        Swal.fire("Success", "College added successfully!", "success");
      }

      setCollegeName("");
      setCollegeCode("");
      setProgramList([]);
      setEditingCollege(null);
      fetchColleges();
      closeModal();
    } catch (error) {
      Swal.fire("Error", "Failed to save college. Check console for details.", "error");
      console.error("Save College Error:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button className="bg-green-600 px-4 py-2 rounded text-white" onClick={() => {
          setEditingCollege(null);
          setCollegeName("");
          setCollegeCode("");
          setProgramList([]);
          openModal();
        }}>
          ADD COLLEGE
        </button>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="text-gray-500">
            <TableCell className="border p-2 font-medium">Department Name (Program Name)</TableCell>
            <TableCell className="text-center">College Code</TableCell>
            <TableCell className="text-center">Action</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {colleges.map((college, index) => (
            <React.Fragment key={college.college_id}>
              <TableRow className={index % 2 === 0 ? "bg-white" : "bg-green-50"}>
                <TableCell>{college.college_name}</TableCell>
                <TableCell className="text-center">{college.college_code}</TableCell>
                <TableCell className="text-center space-x-2">
                  <button className="bg-blue-500 px-3 py-1 text-white rounded-md" onClick={() => handleEditCollege(college)}>
                    EDIT
                  </button>
                  <button className="bg-red-500 px-3 py-1 text-white rounded-md" onClick={() => handleDeleteCollege(college.college_id)}>
                    DELETE
                  </button>
                  <button className="bg-green-600 px-3 py-1 text-white rounded-md" onClick={() => handleViewDetails(college.college_id)}>
                    VIEW DETAILS
                  </button>
                </TableCell>
              </TableRow>
               {programs[college.college_id]?.map(program => (
                  <TableRow key={program.program_id} className="bg-gray-100">
                  <TableCell className="border p-2">{program.program_name}</TableCell>
                  <TableCell className="border p-2 text-center">{program.program_code}</TableCell>
                  <TableCell className="border p-2"></TableCell>
                 </TableRow>
              ))}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>

      <Modal isOpen={isOpen} onClose={closeModal}>
        <div className="p-6 max-w-lg w-full mx-auto">
          <Label>College Name</Label>
          <Input value={collegeName} onChange={e => setCollegeName(e.target.value)} />

          <Label>College Code</Label>
          <Input value={collegeCode} onChange={e => setCollegeCode(e.target.value)} />

          <Button className="mt-4 bg-green-600 text-white" onClick={handleAddProgram}>
            Add Program
          </Button>

          {programList.map((program, index) => (
            <div key={index} className="mt-4 p-3 border rounded bg-gray-50">
              <Label>Program Name</Label>
              <Input value={program.program_name} onChange={e => handleProgramChange(index, "program_name", e.target.value)} />

              <Label>Program Code</Label>
              <Input value={program.program_code} onChange={e => handleProgramChange(index, "program_code", e.target.value)} />

              <Button className="bg-red-500 text-white px-2 py-1 mt-2" onClick={() => handleRemoveProgram(index)}>
                Remove
              </Button>
            </div>
          ))}

          <Button className="mt-4 w-full bg-green-600 text-white py-2 rounded" onClick={handleSaveCollege}>
            {editingCollege ? "UPDATE" : "SAVE"}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default CollegeTable;
