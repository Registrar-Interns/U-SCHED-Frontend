import PaginatedTable from "../common/PaginatedTable";

const columns = ["Full Name", "Specialization", "Degree", "Time Availability", "Faculty Type", "Position"];

const professorData = Array.from({ length: 25 }, (_, i) => ({
  "Full Name": `Professor ${i + 1}`,
  Specialization: "Mathematics",
  Degree: "PhD",
  "Time Availability": "9AM - 5PM",
  "Faculty Type": "Full-time",
  Position: "Professor",
}));

export default function ProfessorTable() {
  return <PaginatedTable columns={columns} data={professorData} />;
}