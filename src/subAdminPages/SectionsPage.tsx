import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import SectionTable from "../subAdminComponents/section/SectionTable";

export default function SectionPage() {
  return (
    <>
      <PageMeta title="Sections" description="Manage sections" />
      <PageBreadcrumb
        pageTitle="Sections"
        segments={[
          { name: "Home", path: "/dashboard" },
          { name: "Sections", path: "/sections" },
        ]}
      />
      <div className="space-y-6">
        <SectionTable />
      </div>
    </>
  );
}