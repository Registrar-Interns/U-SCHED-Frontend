import PageMeta from "../../../../components/common/PageMeta";
import PageBreadcrumb from "../../../../components/common/PageBreadCrumb";
import { UploadIcon } from "../../../../icons"; // Adjust if needed
import BSITCurriculumTables from "../../../../components/curriculum/BSITCurriculumTables";

export default function BSIT() {
  return (
    <>
      {/* Page Meta */}
      <PageMeta
        title="BSIT Curriculum | iUCSchedProMax+"
        description="BSIT Curriculum page for iUCSchedProMax+"
      />

      {/* Breadcrumb */}
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
        <BSITCurriculumTables />
      </div>
    </>
  );
}