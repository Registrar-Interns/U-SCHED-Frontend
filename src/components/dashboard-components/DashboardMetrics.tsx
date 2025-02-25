import { UserIcon, GroupIcon, HomeIcon, AcademicCapIcon } from "../../icons";

const metrics = [
  { id: 1, icon: <UserIcon className="w-10 h-10 text-gray-800 dark:text-white" />, value: "148", label: "Professors" },
  { id: 2, icon: <GroupIcon className="w-10 h-10 text-gray-800 dark:text-white" />, value: "180", label: "Sections" },
  { id: 3, icon: <HomeIcon className="w-10 h-10 text-gray-800 dark:text-white" />, value: "80", label: "Rooms" },
  { id: 4, icon: <AcademicCapIcon className="w-10 h-10 text-gray-800 dark:text-white" />, value: "340", label: "Courses" },
];

export default function DashboardMetrics() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:gap-6 p-6">
      {metrics.map((metric) => (
        <div
          key={metric.id}
          className="flex items-center p-5 border border-gray-200 rounded-2xl bg-white dark:border-gray-800 dark:bg-white/[0.03] w-full"
        >
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            {metric.icon}
          </div>
          <div className="ml-4">
            <h4 className="text-lg font-bold text-gray-800 dark:text-white">{metric.value}</h4>
            <span className="text-sm text-gray-500 dark:text-gray-400">{metric.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
