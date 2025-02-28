import PageMeta from "../../components/common/PageMeta";
import DashboardMetrics from "../../components/dashboard-components/DashboardMetrics";

export default function Home() {
  return (
    <>
      <PageMeta
        title="Dashboard | iUCSchedProMax+"
        description="Dashboard page for iUCSchedProMax+"
      />
      <DashboardMetrics />
    </>
  );
}