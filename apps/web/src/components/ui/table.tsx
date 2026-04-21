import React, { ReactNode } from "react";

// Props for Table
interface TableProps {
    children: ReactNode;
    className?: string;
}

// Props for TableHeader
interface TableHeaderProps {
    children: ReactNode;
    className?: string;
}

// Props for TableBody
interface TableBodyProps {
    children: ReactNode;
    className?: string;
}

// Props for TableRow
interface TableRowProps {
    children: ReactNode;
    className?: string;
}

// Props for TableCell
interface TableCellProps {
    children: ReactNode;
    isHeader?: boolean;
    className?: string;
}

// Table Component
const Table: React.FC<TableProps> = ({ children, className = "" }) => {
    return (
        <table
            className={`w-full border-collapse ${className}`}
        >
            {children}
        </table>
    );
};

// TableHeader Component
const TableHeader: React.FC<TableHeaderProps> = ({ children, className = "" }) => {
    return (
        <thead className={`bg-gray-50 dark:bg-gray-700 ${className}`}>
            {children}
        </thead>
    );
};

// TableBody Component
const TableBody: React.FC<TableBodyProps> = ({ children, className = "" }) => {
    return (
        <tbody
            className={`divide-y divide-gray-200 ${className}`}
        >
            {children}
        </tbody>
    );
};

// TableRow Component
const TableRow: React.FC<TableRowProps> = ({ children, className = "" }) => {
    return (
        <tr className={`hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${className}`}>
            {children}
        </tr>
    );
};

// TableCell Component
const TableCell: React.FC<TableCellProps> = ({
    children,
    isHeader = false,
    className = "",
}) => {
    const baseClasses = "px-6 py-4 whitespace-nowrap text-sm";

    if (isHeader) {
        return (
            <th className={`${baseClasses} font-semibold text-gray-900 dark:text-white text-left ${className}`}>
                {children}
            </th>
        );
    }

    return (
        <td className={`${baseClasses} text-gray-700 dark:text-gray-300 ${className}`}>
            {children}
        </td>
    );
};

export { Table, TableHeader, TableBody, TableRow, TableCell };