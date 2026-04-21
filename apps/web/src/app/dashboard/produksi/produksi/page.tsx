"use client";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import InputProduksi from "@/components/table_master/produksi/input";
import Produksi from "@/components/table_master/produksi";

export default function JenisKomoditasPage() {
    return (
        <DashboardLayout title="Produksi" role="">
            <div className="mt-6">
                <Produksi />
            </div>
        </DashboardLayout>
    );
}
