// Kita sragamkan buat per-kerud-an guys v:
"use client";

import { ReactNode } from "react";
import DashboardSidebar from "../dashboard/DashboardSidebar";
import DashboardHeader from "../dashboard/DashboardHeader";

type DashboardLayoutProps = {
  children: ReactNode;
  title: string;
  role: string;
};

export default function DashboardLayout({ children, title, role }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <DashboardSidebar />

      <div className="p-4 sm:ml-64">
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
          <DashboardHeader title={title} role={role} />
          {children}
        </div>
      </div>
    </div>
  );
}
