import PageMeta from "../../../../components/common/PageMeta";
import PageBreadcrumb from "../../../../components/common/PageBreadCrumb";
import { UploadIcon } from "../../../../icons"; // adjust path if needed
import BSCPECurriculumTables from "../../../../components/curriculum/BSCPECurriculumTables";

export default function BSCPE() {
  return (
    <>
      <PageMeta
        title="BSCPE Curriculum | iUCSchedProMax+"
        description="BSCPE Curriculum page for iUCSchedProMax+"
      />
      <PageBreadcrumb
        pageTitle="BSCPE"
        segments={[
          { name: "Home", path: "/dashboard" },
          { name: "Curriculum", path: "/department/coe/bscpe" },
          { name: "Department", path: "/department/coe/bscpe" },
          { name: "COE", path: "/department/coe/bscpe" },
          { name: "BSCPE", path: "/department/coe/bscpe" },
        ]}
      />

      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4 mb-4">
          {/* Left side: Year dropdown */}
          <div className="flex items-center gap-2">
            <label htmlFor="yearSelect" className="text-gray-700 dark:text-gray-300">
              Year:
            </label>
            <select
              id="yearSelect"
              className="rounded border border-gray-300 bg-white p-2 text-sm dark:bg-gray-800 dark:text-white"
            >
              <option>First Year</option>
              <option>Second Year</option>
              <option>Third Year</option>
              <option>Fourth Year</option>
            </select>
          </div>

          {/* Right side: Upload button */}
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
          >
            <UploadIcon className="w-4 h-4" />
            Upload
          </button>
        </div>
        {/* Curriculum Tables */}
        <BSCPECurriculumTables />
      </div>
    </>
  );
}