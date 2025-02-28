import PaginatedTable from "../common/PaginatedTable";

const columns = ["Section Name", "Department", "Program", "Year Level", "Total Students"];

const sectionData = Array.from({ length: 30 }, (_, i) => ({
  "Section Name": `BSIT-${i + 1}`,
  Department: "CCS",
  Program: "BSIT",
  "Year Level": "3rd Year",
  "Total Students": Math.floor(Math.random() * 50) + 10,
}));

export default function SectionTable() {
  return <PaginatedTable columns={columns} data={sectionData} />;
}