import { ReactNode } from "react";
import clsx from "clsx";

// Props for Table
interface TableProps {
  children: ReactNode; // Table content (thead, tbody, etc.)
  className?: string; // Optional className for styling
}

// Props for TableHeader
interface TableHeaderProps {
  children: ReactNode; // Header row(s)
  className?: string; // Optional className for styling
}

// Props for TableBody
interface TableBodyProps {
  children: ReactNode; // Body row(s)
  className?: string; // Optional className for styling
}

// Props for TableRow
interface TableRowProps {
  children?: React.ReactNode; // Cells (th or td)
  className?: string; // Optional className for styling
}

// Props for TableCell
interface TableCellProps
  extends React.ThHTMLAttributes<HTMLTableHeaderCellElement>,
    React.TdHTMLAttributes<HTMLTableDataCellElement> {
  isHeader?: boolean;
  className?: string;
  children?: React.ReactNode;
}

// Table Component
const Table: React.FC<TableProps> = ({ children, className }) => {
  return <table className={`min-w-full  ${className}`}>{children}</table>;
};

// TableHeader Component
const TableHeader: React.FC<TableHeaderProps> = ({ children, className }) => {
  return <thead className={className}>{children}</thead>;
};

// TableBody Component
const TableBody: React.FC<TableBodyProps> = ({ children, className }) => {
  return <tbody className={className}>{children}</tbody>;
};

// TableRow Component
const TableRow: React.FC<TableRowProps> = ({ children, className }) => {
  return <tr className={className}>{children}</tr>;
};

// TableCell Component
const TableCell: React.FC<TableCellProps> = ({
  isHeader = false,
  className,
  children,
  ...rest
}) => {
  // Decide if we render <th> or <td>
  const Component = isHeader ? "th" : "td";

  return (
    <Component
      {...rest} // <-- Forward all extra props, including colSpan
      className={clsx("px-4 py-2", className)}
    >
      {children}
    </Component>
  );
};

export { Table, TableHeader, TableBody, TableRow, TableCell };
