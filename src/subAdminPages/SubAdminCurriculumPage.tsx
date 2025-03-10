import React, { useState, useEffect, ChangeEvent } from "react";
import axios from "axios";
import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import CurriculumTables from "../components/curriculum/CurriculumTables";

// Map departments to their available programs.
// You can update this mapping as necessary.
const programsMap: Record<string, string[]> = {
  CCS: ["BSIT", "BSCS"],
  COE: ["BSIE", "BSCPE", "BSECE"],
  CBAA: ["BSA", "BSBA-MM", "BSBA-FM"],
  COED: ["BEED", "BSEDE", "BSEDF", "BSEDM", "BSEDS"],
  CAS: ["BSPSY"],
  CHAS: ["BSN"],
};

const SubAdminCurriculumPage: React.FC = () => {
  // Retrieve user's department from localStorage.
  // For sub-admins, the department is the one stored (from login or profile).
  const userDept = localStorage.getItem("department") || "";
  // Get the list of programs for the user's department from the mapping.
  const availablePrograms = programsMap[userDept.toUpperCase()] || [];
  
  // If there are multiple programs, let the user select one.
  // Otherwise, use the only available program.
  const [program, setProgram] = useState<string>(
    availablePrograms.length > 0 ? availablePrograms[0] : ""
  );
  const [year, setYear] = useState("");
  const [courses, setCourses] = useState([]);
  const [years, setYears] = useState<string[]>([]);

  // Fetch distinct years for dropdown
  useEffect(() => {
    axios
      .get("http://localhost:3001/api/curriculum/years")
      .then((res) => {
        setYears(res.data);
        // Default to first year if not already set
        if (res.data.length > 0 && !year) {
          setYear(res.data[0]);
        }
      })
      .catch((err) => console.error(err));
  }, [year]);

  // Fetch courses for the selected year & program
  useEffect(() => {
    if (!year || !program) return;
    axios
      .get(
        `http://localhost:3001/api/curriculum?year=${encodeURIComponent(
          year
        )}&program=${encodeURIComponent(program)}`
      )
      .then((res) => setCourses(res.data))
      .catch((err) => console.error(err));
  }, [year, program]);

  // Handle dropdown change for year
  const handleYearChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setYear(e.target.value);
  };

  // Handle dropdown change for program (if more than one available)
  const handleProgramChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setProgram(e.target.value);
  };

  return (
    <>
      <PageMeta
        title={`${program.toUpperCase()} Curriculum | iUCSchedProMax+`}
        description={`${program.toUpperCase()} Curriculum page`}
      />

      <PageBreadcrumb
        pageTitle={`${program.toUpperCase()} Curriculum`}
        segments={[
          { name: "Home", path: "/dashboard" },
          { name: "Curriculum", path: "/curriculum" },
          { name: userDept.toUpperCase(), path: "/curriculum" },
          { name: program.toUpperCase(), path: "/curriculum" },
        ]}
      />

      <div className="space-y-6">
        {/* Controls row */}
        <div className="flex items-center justify-between gap-4 mb-4">
          {/* Year dropdown */}
          <div className="flex items-center gap-2">
            <label htmlFor="yearSelect" className="text-gray-700 dark:text-gray-300">
              Year:
            </label>
            <select
              id="yearSelect"
              value={year}
              onChange={handleYearChange}
              className="w-48 rounded border border-gray-300 bg-white p-2 text-sm dark:bg-gray-800 dark:text-white"
            >
              {years.map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
          </div>

          {/* Program dropdown (only if more than one program exists) */}
          {availablePrograms.length > 1 && (
            <div className="flex items-center gap-2">
              <label htmlFor="programSelect" className="text-gray-700 dark:text-gray-300">
                Program:
              </label>
              <select
                id="programSelect"
                value={program}
                onChange={handleProgramChange}
                className="w-48 rounded border border-gray-300 bg-white p-2 text-sm dark:bg-gray-800 dark:text-white"
              >
                {availablePrograms.map((prog) => (
                  <option key={prog} value={prog}>
                    {prog}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Display the curriculum tables */}
        <CurriculumTables year={year} courses={courses} department={userDept} />
      </div>
    </>
  );
};

export default SubAdminCurriculumPage;