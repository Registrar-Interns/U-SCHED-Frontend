import React from "react";
import { Link } from "react-router-dom";

interface BreadcrumbSegment {
  name: string;
  path: string;
}

interface BreadcrumbProps {
  pageTitle: string;            // Big heading on the left
  segments: BreadcrumbSegment[]; // For navigable breadcrumb
}

const PageBreadcrumb: React.FC<BreadcrumbProps> = ({ pageTitle, segments }) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
      {/* Left-side heading (only displays the pageTitle) */}
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
        {pageTitle}
      </h2>

      {/* Breadcrumb nav */}
      <nav>
        <ol className="flex items-center gap-1.5">
          {segments.map((segment, index) => {
            const isLast = index === segments.length - 1;
            return (
              <li key={index}>
                {!isLast ? (
                  <Link
                    to={segment.path}
                    className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400"
                  >
                    {segment.name}
                    {/* Separator icon */}
                    <svg
                      className="stroke-current"
                      width="17"
                      height="16"
                      viewBox="0 0 17 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Link>
                ) : (
                  <span className="text-sm text-gray-800 dark:text-white/90">
                    {segment.name}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
};

export default PageBreadcrumb;
