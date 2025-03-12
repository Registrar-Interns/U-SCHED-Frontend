import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import RoomTable from "../../components/room-assignment/RoomTable";

export default function RoomAssignmentPage() {
  return (
    <>
      <PageMeta title="Room Assignment" description="Manage room assignments" />
      <PageBreadcrumb
        pageTitle="Room Assignment"
        segments={[
          { name: "Home", path: "/dashboard" },
          { name: "Room Assignment", path: "/room-assignment" },
        ]}
      />
      <div className="space-y-6">
        <RoomTable />
      </div>
    </>
  );
}