"use client";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import AsalProduksi from "@/components/table_master/asal_produksi";
import InputAsalProduksi from "@/components/table_master/asal_produksi/input";
import { useState } from "react";

export default function AsalProduksiPage() {
    const [selectedAsal, setSelectedAsal] = useState<any | null>(null);
    const [reloadTable, setReloadTable] = useState(false);

    const handleEdit = (asal: any) => {
        setSelectedAsal(asal);
    };

    const refreshAsalList = () => {
        setReloadTable(prev => !prev);
    };


    return (
        <DashboardLayout title="Asal Produksi" role="">
            <div className="mt-5">
                <InputAsalProduksi
                    selelectedAsalProduksi={selectedAsal}
                    setSelectedAsalProduksi={setSelectedAsal}
                    onSuccess={refreshAsalList} />
            </div>
            <div className="mt-6">
                <AsalProduksi
                    onEditAsal={handleEdit}
                    reloadTrigger={reloadTable} />
            </div>
        </DashboardLayout>
    );
}
