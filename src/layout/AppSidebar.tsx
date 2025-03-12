import { useState } from "react";
import { Link, useLocation } from "react-router-dom"; // Ensure using react-router-dom v6
import {
  ChevronDownIcon,
  GridIcon,
  AcademicCapIcon,
  CurriculumIcon,
  AuditIcon,
  HomeIcon,
  GenerateIcon,
  UserCircleIcon,
  ConstraintIcon,
} from "../icons";
import { useSidebar } from "../context/SidebarContext";

// Department branding map
const departmentBranding: Record<string, { headerColor: string; collegeName: string; logo: string }> = {
  CCS: {
    headerColor: "bg-orange-600",
    collegeName: "College of Computing Studies",
    logo: "/images/ccs-logo.jpg",
  },
  COE: {
    headerColor: "bg-red-600",
    collegeName: "College of Engineering",
    logo: "/images/coe-logo.jpg",
  },
  CAS: {
    headerColor: "bg-red-800",
    collegeName: "College of Arts and Sciences",
    logo: "/images/cas-logo.jpg",
  },
  CHAS: {
    headerColor: "bg-green-500",
    collegeName: "College of Humanities and Social Sciences",
    logo: "/images/chas-logo.jpg",
  },
  COED: {
    headerColor: "bg-blue-500",
    collegeName: "College of Education",
    logo: "/images/coed-logo.jpg",
  },
  CBAA: {
    headerColor: "bg-yellow-500",
    collegeName: "College of Business and Accountancy",
    logo: "/images/cbaa-logo.png",
  },
  default: {
    headerColor: "bg-green-600",
    collegeName: "U-SCHED",
    logo: "/images/usched-logo.png",
  },
};

type NavItem = {
  name: string;
  icon?: React.ReactNode;
  path?: string;
  subItems?: NavItem[];
};

// Define the nav items for admin users
const adminNavItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    path: "/dashboard",
  },
  {
    icon: <UserCircleIcon />,
    name: "Users",
    path: "/users",
  },
  {
    name: "College",
    icon: <AcademicCapIcon />,
    path: "/colleges",
  },
  {
    name: "Curriculum",
    icon: <CurriculumIcon />,
    subItems: [
      {
        name: "Department",
        subItems: [
          {
            name: "CCS",
            subItems: [
              { name: "BSIT", path: "/curriculum/department/ccs/bsit" },
              { name: "BSCS", path: "/curriculum/department/ccs/bscs" },
            ],
          },
          {
            name: "CBAA",
            subItems: [
              { name: "BSA", path: "/curriculum/department/cbaa/bsa" },
              { name: "BSBA-MM", path: "/curriculum/department/cbaa/bsba-mm" },
              { name: "BSBA-FM", path: "/curriculum/department/cbaa/bsba-fm" },
            ],
          },
          {
            name: "COE",
            subItems: [
              { name: "BSIE", path: "/curriculum/department/coe/bsie" },
              { name: "BSCPE", path: "/curriculum/department/coe/bscpe" },
              { name: "BSECE", path: "/curriculum/department/coe/bsece" },
            ],
          },
          {
            name: "COED",
            subItems: [
              { name: "BEED", path: "/curriculum/department/coed/beed" },
              { name: "BSEDE", path: "/curriculum/department/coed/bsede" },
              { name: "BSEDF", path: "/curriculum/department/coed/bsedf" },
              { name: "BSEDM", path: "/curriculum/department/coed/bsedm" },
              { name: "BSEDS", path: "/curriculum/department/coed/bseds" },
            ],
          },
          {
            name: "CAS",
            subItems: [{ name: "BSPSY", path: "/curriculum/department/cas/bspsy" }],
          },
          {
            name: "CHAS",
            subItems: [{ name: "BSN", path: "/curriculum/department/chas/bsn" }],
          },
        ],
      },
    ],
  },
  {
    name: "Room Assignment",
    icon: <HomeIcon />,
    path: "/room-assignment",
  },
  {
    name: "Generate Schedule",
    icon: <GenerateIcon />,
    path: "/generate-schedule",
  },
  {
    name: "Constraints",
    icon: <ConstraintIcon />,
    path: "/constraints",
  },
  {
    name: "Audit Logs",
    icon: <AuditIcon />,
    path: "/audit-log",
  },
];

// Define the nav items for sub-admin users (Dean/Department Chair)
const subAdminNavItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    path: "/dashboard",
  },
  {
    icon: <UserCircleIcon />,
    name: "Professors",
    path: "/professors",
  },
  {
    name: "Schedule",
    icon: <GenerateIcon />,
    path: "/schedule",
  },
  {
    name: "Room Plotting",
    icon: <HomeIcon />,
    path: "/room-plotting",
  },
  {
    name: "Curriculum",
    icon: <CurriculumIcon />,
    path: "/curriculum",
  },
  {
    name: "Section",
    icon: <AuditIcon />,
    path: "/sections",
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  // Grab user info from localStorage
  const userType = localStorage.getItem("userType"); // e.g. "ADMIN" or "PROFESSOR"
  const position = localStorage.getItem("position"); // e.g. "Dean", "Department Chair", etc.
  const department = localStorage.getItem("department") || "";

  // Select which set of nav items to show:
  // For sub-admins (Dean or Department Chair), only show subAdminNavItems.
  const navItems =
    userType === "PROFESSOR" && (position === "Dean" || position === "Department Chair")
      ? subAdminNavItems
      : adminNavItems;

  // 1) Decide which branding to use for the logo
  let sidebarLogo = departmentBranding.default.logo; // default
  if (userType === "PROFESSOR" && (position === "Dean" || position === "Department Chair")) {
    const branding = departmentBranding[department] || departmentBranding.default;
    sidebarLogo = branding.logo;
  }

  const toggleMenu = (key: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const isActive = (path?: string) => (path ? location.pathname === path : false);

  const renderMenuItems = (items: NavItem[], parentKey = "") => (
    <ul className="flex flex-col gap-2">
      {items.map((nav, index) => {
        const menuKey = `${parentKey}-${index}`;
        const isOpen = openMenus[menuKey];

        return (
          <li key={menuKey}>
            {nav.subItems ? (
              <button
                onClick={() => toggleMenu(menuKey)}
                className="menu-item group menu-item-inactive"
              >
                <span className="menu-item-icon-size">{nav.icon}</span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
                {(isExpanded || isHovered || isMobileOpen) && (
                  <ChevronDownIcon
                    className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                )}
              </button>
            ) : (
              nav.path && (
                <Link
                  to={nav.path}
                  className={`menu-item group ${
                    isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                  }`}
                >
                  <span
                    className={`menu-item-icon-size ${
                      isActive(nav.path)
                        ? "menu-item-icon-active"
                        : "menu-item-icon-inactive"
                    }`}
                  >
                    {nav.icon}
                  </span>
                  {(isExpanded || isHovered || isMobileOpen) && (
                    <span className="menu-item-text">{nav.name}</span>
                  )}
                </Link>
              )
            )}

            {nav.subItems && isOpen && (
              <div className="ml-5 border-l border-gray-300 pl-3">
                {renderMenuItems(nav.subItems, menuKey)}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${(isExpanded || isMobileOpen || isHovered) ? "w-[290px]" : "w-[90px]"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
        onMouseEnter={() => !isExpanded && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`py-8 flex ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`}>
      <Link to="/">
          {(isExpanded || isHovered || isMobileOpen) ? (
            <>
              {/* 2) Use the dynamic logo for the sub-admin's department */}
              <img
                className="dark:hidden"
                src={sidebarLogo}
                alt="Logo"
                width={238}
                height={70}
              />
              <img
                className="hidden dark:block"
                src={sidebarLogo}
                alt="Logo"
                width={238}
                height={70}
              />
            </>
          ) : (
            <img
              src={sidebarLogo}
              alt="Logo"
              width={70}
              height={70}
            />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            {renderMenuItems(navItems, "main")}
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;