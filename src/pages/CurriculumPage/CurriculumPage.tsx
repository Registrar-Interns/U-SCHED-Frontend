import React, { useState, useEffect, ChangeEvent } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { UploadIcon } from "../../icons";
import CurriculumTables from "../../components/curriculum/CurriculumTables";

const CurriculumPage: React.FC = () => {
  // Grabs :dept and :program from the route. e.g. /department/ccs/bsit => dept="ccs", program="bsit"
  const { dept, program } = useParams();

  const [year, setYear] = useState("");
  const [courses, setCourses] = useState([]);
  const [years, setYears] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false);

  // 1) Fetch distinct years for dropdown
  useEffect(() => {
    axios
      .get("http://localhost:3001/api/curriculum/years")
      .then((res) => {
        setYears(res.data);
        // default to first year if not already set
        if (res.data.length > 0 && !year) {
          setYear(res.data[0]);
        }
      })
      .catch((err) => console.error(err));
  }, [year]);

  // 2) Fetch courses for the selected year & program
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

  // 3) Confirm upload => POST file + dept/program
  const confirmUpload = async () => {
    if (!file || !dept || !program) return;
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("department", dept.toUpperCase()); // if you want it uppercase
      formData.append("program", program.toUpperCase()); // same for program

      // 3.1) Upload
      await axios.post("http://localhost:3001/api/curriculum/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Optional: artificial delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // 3.2) success alert
      Swal.fire("Success", "Upload successful", "success");

      // 3.3) re-fetch courses
      const coursesRes = await axios.get(
        `http://localhost:3001/api/curriculum?year=${encodeURIComponent(
          year
        )}&program=${encodeURIComponent(program)}`
      );
      setCourses(coursesRes.data);

      // 3.4) cleanup
      setFile(null);
      setShowModal(false);
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      {/* Page meta and breadcrumb can still be dynamic */}
      <PageMeta
        title={`${program?.toUpperCase()} Curriculum | iUCSchedProMax+`}
        description={`${program?.toUpperCase()} Curriculum page`}
      />

      <PageBreadcrumb
        pageTitle={program?.toUpperCase() || "Curriculum"}
        segments={[
          { name: "Home", path: "/dashboard" },
          { name: "Curriculum", path: `/curriculum/department/${dept}/${program}` },
          { name: "Department", path: `/curriculum/department/${dept}/${program}` },
          { name: dept?.toUpperCase() || "N/A", path: `/curriculum/department/${dept}/${program}` },
          { name: program?.toUpperCase() || "N/A", path: `/curriculum/department/${dept}/${program}` },
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
                onClick={() => setShowModal(true)}
                className="inline-flex items-center gap-2 rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
              >
                Confirm Upload
              </button>
            )}
          </div>
        </div>

        {/* 4) Display the tables. 
            If year is "ELECTIVES", show a distinct grouping. Otherwise normal grouping */}
        <CurriculumTables year={year} courses={courses} />
      </div>

      {/* 5) Modal for upload overview */}
      {showModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96">
            <h2 className="text-xl font-semibold mb-4">Confirm Upload</h2>
            <p className="mb-4">File: {file?.name}</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded bg-gray-300 text-gray-800"
                disabled={uploading}
              >
                Cancel
              </button>
              <button
                onClick={confirmUpload}
                className="px-4 py-2 rounded bg-green-600 text-white flex items-center justify-center gap-2"
                disabled={uploading}
              >
                {uploading ? (
                  <>
                    <span
                      className="
                        inline-block
                        h-5
                        w-5
                        animate-spin
                        rounded-full
                        border-2
                        border-solid
                        border-current
                        border-r-transparent
                        align-[-0.125em]
                      "
                      role="status"
                    >
                      <span className="sr-only">Loading...</span>
                    </span>
                    <span>Loading...</span>
                  </>
                ) : (
                  "Confirm"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CurriculumPage;