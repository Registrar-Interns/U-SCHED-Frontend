import { useState } from "react";
import { Link, useLocation } from "react-router";
import {
  ChevronDownIcon,
  GridIcon,
  AcademicCapIcon,
  CurriculumIcon,
  AuditIcon,
} from "../icons";
import { useSidebar } from "../context/SidebarContext";

type NavItem = {
  name: string;
  icon?: React.ReactNode;
  path?: string;
  subItems?: NavItem[];
  pro?: boolean;
  new?: boolean;
};

const navItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    path: "/dashboard",
  },
  {
    name: "College",
    icon: <AcademicCapIcon />,
    subItems: [
      { name: "CCS", path: "/college-css" },
      { name: "COE", path: "/college-coe" },
      { name: "CBAA", path: "/college-cbaa" },
      { name: "COED", path: "/college-coed" },
      { name: "CHAS", path: "/college-chas" },
      { name: "CAS", path: "/college-cas" },
    ],
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
              { name: "BSIT", path: "/department/ccs/bsit" },
              { name: "BSCS", path: "/department/ccs/bscs" },
            ],
          },
          {
            name: "COE",
            subItems: [
              { name: "BSIE", path: "/department/coe/bsie" },
              { name: "BSCPE", path: "/department/coe/bscpe" },
            ],
          },
        ],
      },
    ],
  },
  {
    name: "Audit Logs",
    icon: <AuditIcon />,
    path: "/audit-log"
  },
  // {
  //   icon: <UserCircleIcon />,
  //   name: "User Profile",
  //   path: "/profile",
  // },
  // {
  //   name: "Tables",
  //   icon: <TableIcon />,
  //   subItems: [{ name: "Basic Tables", path: "/basic-tables" }],
  // },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered } = useSidebar();
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const toggleMenu = (key: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const isActive = (path?: string) => (path ? location.pathname === path : false);

  // Recursive function to render menu items
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
                className={`menu-item group menu-item-inactive`}
              >
                <span className="menu-item-icon-size">
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && <span className="menu-item-text">{nav.name}</span>}
                {(isExpanded || isHovered || isMobileOpen) && (
                  <ChevronDownIcon className={`ml-auto w-5 h-5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                )}
              </button>
            ) : (
              nav.path && (
                <Link
                  to={nav.path}
                  className={`menu-item group ${isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"}`}
                >              
                  <span className={`menu-item-icon-size ${isActive(nav.path) ? "menu-item-icon-active" : "menu-item-icon-inactive"}`}>
                    {nav.icon}
                  </span>
                  {(isExpanded || isHovered || isMobileOpen) && <span className="menu-item-text">{nav.name}</span>}
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
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
    >
      <div
        className={`py-8 flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link to="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <img
                className="dark:hidden"
                src="/images/usched-logo.png"
                alt="Logo"
                width={150}
                height={40}
              />
              <img
                className="hidden dark:block"
                src="/images/usched-logo.png"
                alt="Logo"
                width={150}
                height={40}
              />
            </>
          ) : (
            <img
              src="/images/usched-logo.png"
              alt="Logo"
              width={32}
              height={32}
            />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>
          </div>
        </nav>
        {/* {isExpanded || isHovered || isMobileOpen ? <SidebarWidget /> : null} */}
      </div>
    </aside>
  );
};

export default AppSidebar;
