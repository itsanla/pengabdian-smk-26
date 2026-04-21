"use client";
import Jenis_Komoditas from "@/components/table_master/jenis_komoditas";
import InputJenisKomoditas from "@/components/table_master/jenis_komoditas/input";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { useState } from "react";

export default function JenisKomoditasPage() {
    const [selectedJenis, setSelectedJenis] = useState<any | null>(null);
    const [reloadTable, setReloadTable] = useState(false);

    const handleEdit = (jenis: any) => {
        setSelectedJenis(jenis);
    };

    const refreshJenisList = () => {
        setReloadTable(prev => !prev);
    };

    return (
        <DashboardLayout title="Jenis Komoditas" role="">
            <div className="mt-5">
                <InputJenisKomoditas selectedJenis={selectedJenis} setSelectedJenis={setSelectedJenis}
                onSuccess={refreshJenisList}/>
            </div>
            <div className="mt-6">
                <Jenis_Komoditas onEdit={handleEdit} 
                reloadTrigger={reloadTable}/>
            </div>
        </DashboardLayout>
    );
}
