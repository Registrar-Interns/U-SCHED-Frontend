import React, { useState, useEffect, ChangeEvent } from "react";
import axios from "axios";
import PageMeta from "../../../../components/common/PageMeta";
import PageBreadcrumb from "../../../../components/common/PageBreadCrumb";
import { UploadIcon } from "../../../../icons";
import BSITCurriculumTables from "../../../../components/curriculum/BSITCurriculumTables";
import BSITElectivesTable from "../../../../components/curriculum/BSITElectivesTable";

const BSIT: React.FC = () => {
  const [year, setYear] = useState("First Year");
  const [courses, setCourses] = useState([]);
  const [years, setYears] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);

  // Fetch available years for the dropdown
  useEffect(() => {
    axios
      .get("http://localhost:3001/api/curriculum/years")
      .then((res) => setYears(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Fetch courses for the selected year
  useEffect(() => {
    axios
      .get(
        `http://localhost:3001/api/curriculum?year=${encodeURIComponent(
          year
        )}&program=BSIT`
      )
      .then((res) => setCourses(res.data))
      .catch((err) => console.error(err));
  }, [year]);

  // Handle dropdown change
  const handleYearChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setYear(e.target.value);
  };

  // Handle file input change
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  // Handle file upload
  const handleUpload = () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    axios
      .post("http://localhost:3001/api/curriculum/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        console.log("Upload successful", res.data);
        // Re-fetch courses after upload
        axios
          .get(
            `http://localhost:3001/api/curriculum?year=${encodeURIComponent(
              year
            )}&program=BSIT`
          )
          .then((res) => setCourses(res.data))
          .catch((err) => console.error(err));
      })
      .catch((err) => console.error(err));
  };

  return (
    <>
      <PageMeta
        title="BSIT Curriculum | iUCSchedProMax+"
        description="BSIT Curriculum page for iUCSchedProMax+"
      />

      <PageBreadcrumb
        pageTitle="BSIT"
        segments={[
          { name: "Home", path: "/dashboard" },
          { name: "Curriculum", path: "/department/ccs/bsit" },
          { name: "Department", path: "/department/ccs/bsit" },
          { name: "CCS", path: "/department/ccs/bsit" },
          { name: "BSIT", path: "/department/ccs/bsit" },
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
              className="rounded border border-gray-300 bg-white p-2 text-sm dark:bg-gray-800 dark:text-white"
            >
              {years.map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
          </div>

          {/* Upload file input & button */}
          <div className="flex items-center gap-2">
            <input
              type="file"
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              onChange={handleFileChange}
              className="hidden"
              id="uploadFileInput"
            />
            <label
              htmlFor="uploadFileInput"
              className="inline-flex items-center gap-2 cursor-pointer rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
            >
              <UploadIcon className="w-4 h-4" />
              Upload
            </label>

            {file && (
              <button
                onClick={handleUpload}
                className="inline-flex items-center gap-2 rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
              >
                Confirm Upload
              </button>
            )}
          </div>
        </div>

        {/* Conditionally render normal vs. electives table */}
        {year !== "ELECTIVES" ? (
          <BSITCurriculumTables courses={courses} />
        ) : (
          <BSITElectivesTable courses={courses} />
        )}
      </div>
    </>
  );
};

export default BSIT;
