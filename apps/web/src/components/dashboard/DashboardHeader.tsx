"use client";

import { useState } from "react";
import ToggleDark from "@/components/common/ToggleDark";
import ConfirmButton from "@/components/common/ConfirmButton";

type DashboardHeaderProps = {
  title: string;
  role: any;
};

export default function DashboardHeader({ title, role }: DashboardHeaderProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogoutClick = () => {
    setShowConfirm(true);
  };

  const handleConfirmLogout = async () => {
    try {
      localStorage.removeItem('token');
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      window.location.href = '/';
    } catch (error) {
      console.log("Gagal logout:", error);
    }
    setShowConfirm(false);
  };

  const handleCancelLogout = () => {
    setShowConfirm(false);
  };

  return (
    <>
      <header className="flex justify-between h-15 mb-4 items-center dark:border-gray-700">
        <h1 className="text-2xl font-bold">{title} {role}</h1>
        <div className="flex gap-2 items-center">
          {/* <ToggleDark /> */}
          <button 
            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors" 
            onClick={handleLogoutClick}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Conditional render of ConfirmButton */}
      {showConfirm && (
        <ConfirmButton
          message="Apakah Anda yakin ingin logout?"
          onConfirm={handleConfirmLogout}
          onCancel={handleCancelLogout}
        />
      )}
    </>
  );
}
