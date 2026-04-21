"use client";
import Komoditas from "@/components/table_master/komoditas";
import DashboardLayout from "@/components/layouts/DashboardLayout";

export default function JenisKomoditasPage() {
    return (
        <DashboardLayout title="Daftar Komoditas" role="">
            <div className="mt-6">
                <Komoditas />
            </div>
        </DashboardLayout>
    );
}
