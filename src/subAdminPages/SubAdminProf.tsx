import React from "react";
//import { useNavigate } from "react-router-dom";
import ProfessorTable from "../subAdminComponents/ProfessorTable";

const SubAdminProf: React.FC = () => {
  return (
    <div className="p-6 bg-white rounded shadow-md">
      {/* Professors Table */}
      <ProfessorTable />
    </div>
  );
};

export default SubAdminProf;