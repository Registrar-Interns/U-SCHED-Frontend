import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import AuditLogTable from "../../components/audit/AuditLogTable";

export default function AuditLog() {
  return (
    <>
      <PageMeta
        title="Audit Logs | iUCSchedProMax+"
        description="Audit Logs page for iUCSchedProMax+"
      />
      <PageBreadcrumb
        pageTitle="Audit Logs"
        segments={[
          { name: "Home", path: "/dashboard" },
          { name: "Audit Logs", path: "/audit-log" },
        ]}
      />
      <div className="space-y-6">
        <AuditLogTable />
      </div>
    </>
  );
}