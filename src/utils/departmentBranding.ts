// Department branding map that can be reused across components
export const departmentBranding: Record<string, { 
  headerColor: string; 
  collegeName: string; 
  logo: string;
  menuActiveColor?: string;
  menuActiveBgColor?: string;
  menuIconColor?: string;
}> = {
  CCS: {
    headerColor: "bg-orange-500",
    collegeName: "College of Computing Studies",
    logo: "/images/ccs-logo.jpg",
    menuActiveColor: "text-orange-600",
    menuActiveBgColor: "bg-orange-50",
    menuIconColor: "text-orange-600",
  },
  COE: {
    headerColor: "bg-red-600",
    collegeName: "College of Engineering",
    logo: "/images/coe-logo.jpg",
    menuActiveColor: "text-red-600",
    menuActiveBgColor: "bg-red-50",
    menuIconColor: "text-red-600",
  },
  CAS: {
    headerColor: "bg-red-800",
    collegeName: "College of Arts and Sciences",
    logo: "/images/cas-logo.jpg",
    menuActiveColor: "text-red-800",
    menuActiveBgColor: "bg-red-50",
    menuIconColor: "text-red-800",
  },
  CHAS: {
    headerColor: "bg-green-500",
    collegeName: "College of Humanities and Social Sciences",
    logo: "/images/chas-logo.jpg",
    menuActiveColor: "text-green-500",
    menuActiveBgColor: "bg-green-50",
    menuIconColor: "text-green-500",
  },
  COED: {
    headerColor: "bg-blue-500",
    collegeName: "College of Education",
    logo: "/images/coed-logo.jpg",
    menuActiveColor: "text-blue-500",
    menuActiveBgColor: "bg-blue-50",
    menuIconColor: "text-blue-500",
  },
  CBAA: {
    headerColor: "bg-yellow-500",
    collegeName: "College of Business and Accountancy",
    logo: "/images/cbaa-logo.png",
    menuActiveColor: "text-yellow-600",
    menuActiveBgColor: "bg-yellow-50",
    menuIconColor: "text-yellow-600",
  },
  default: {
    headerColor: "bg-green-600",
    collegeName: "U-SCHED",
    logo: "/images/usched-logo.png",
    menuActiveColor: "text-green-600",
    menuActiveBgColor: "bg-green-50",
    menuIconColor: "text-green-600",
  },
};

// Helper function to get department branding
export const getDepartmentBranding = (department: string) => {
  const deptKey = department.toUpperCase();
  return departmentBranding[deptKey] || departmentBranding.default;
};

// Helper function to get department header color
export const getDepartmentHeaderColor = (department: string) => {
  return getDepartmentBranding(department).headerColor;
};

// Helper function to get department name
export const getDepartmentName = (department: string) => {
  return getDepartmentBranding(department).collegeName;
};

// Helper function to get department logo
export const getDepartmentLogo = (department: string) => {
  return getDepartmentBranding(department).logo;
};

// Helper function to get menu active color
export const getMenuActiveColor = (department: string) => {
  return getDepartmentBranding(department).menuActiveColor || "text-green-600";
};

// Helper function to get menu active background color
export const getMenuActiveBgColor = (department: string) => {
  return getDepartmentBranding(department).menuActiveBgColor || "bg-green-50";
}; 