import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import CollegeTable from "../../components/college/CollegeTable";


export default function CollegePage() {
  return (
    <>
      <PageMeta
        title="College"
        description="College management page "
      />
      <PageBreadcrumb
        pageTitle="College"
        segments={[
          { name: "Home", path: "/dashboard" },
          { name: "College", path: "/colleges" },
        ]}
      />
      <div className="space-y-6">
        <CollegeTable />
      </div>
    </>
  );
}