"use client";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import Penjualan from "@/components/table_master/penjualan";

export default function JenisKomoditasPage() {
    const username = typeof window != "undefined" ? document.cookie.split('; ').find(row => row.startsWith('username='))?.split('=')[1] ?? "User" : ""

  return (
        <DashboardLayout title="Manajemen Penjualan | " role={username}>
            <div className="mt-6">
                <Penjualan />
            </div>
        </DashboardLayout>
    );
}
