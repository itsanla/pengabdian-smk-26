"use client";
import { useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import BahanBakuTable from "@/components/table_master/bahan_baku";
import InputBahanBaku from "@/components/table_master/bahan_baku/input";
import { BahanBaku } from "@/types";

export default function BahanBakuPage() {
  const [selectedItem, setSelectedItem] = useState<BahanBaku | null>(null);
  const [reloadTrigger, setReloadTrigger] = useState(false);

  const handleEdit = (item: BahanBaku) => setSelectedItem(item);
  const refreshList = () => setReloadTrigger((prev) => !prev);

  return (
    <DashboardLayout title="Bahan Baku" role="">
      <div className="mt-5">
        <InputBahanBaku
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
          onSuccess={refreshList}
        />
      </div>
      <div className="mt-6">
        <BahanBakuTable onEdit={handleEdit} reloadTrigger={reloadTrigger} />
      </div>
    </DashboardLayout>
  );
}
