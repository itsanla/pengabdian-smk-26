"use client";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { useState } from "react";
import { DataTable } from "@/components/table/DataTable";
import CreateUpdateModal from "@/components/dashboard/CreateUpdateModal";
import { Pencil, Trash2 } from "lucide-react";
import { apiRequest } from "@/services/api.service";
import { Barang } from "@/types";
import ConfirmButton from "@/components/common/ConfirmButton";
import { usePaginatedApi } from "@/hooks/usePaginatedApi";

export default function DashboardBarang() {
  const [openCreate, setOpenCreate] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "update">("create");
  const [initialData, setInitialData] = useState<any>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const {
    data: barang,
    meta,
    page,
    setPage,
    loading,
    refresh,
  } = usePaginatedApi<Barang>("/barang");
  const pageSize = meta?.pageSize ?? 10;

  const handleCreate = () => {
    setFormMode("create");
    setInitialData(null);
    setOpenCreate(true);
  };

  const handleUpdate = (id: number) => {
    const barangToEdit = barang.find((b) => b.id === id);
    if (barangToEdit) {
      setFormMode("update");
      setInitialData(barangToEdit);
      setOpenCreate(true);
    }
  };

  const handleDelete = (id: number) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  const deleteData = async () => {
    if (deleteId !== null) {
      await apiRequest({
        endpoint: `/barang/${deleteId}`,
        method: "DELETE",
      });
      refresh(1);
      setShowConfirm(false);
      setDeleteId(null);
    }
  };

  return (
    <DashboardLayout title="Data Barang" role="">
      <div>
        <DataTable
          data={barang}
          _create={handleCreate}
          columns={[
            {
              header: "#",
              accessorKey: "id",
              cell: (item) =>
                (page - 1) * pageSize + barang.findIndex((p) => p.id === item.id) + 1,
            },
            { header: "Nama Barang", accessorKey: "nama" },
            { header: "Jumlah", accessorKey: "jumlah" },
            { header: "Satuan", accessorKey: "satuan" },
            {
              header: "Tanggal Masuk",
              accessorKey: "createdAt",
              cell: (item) => new Date(item.createdAt).toLocaleString(),
            },
            {
              header: "Aksi",
              accessorKey: "createdAt",
              cell: (item) => (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdate(item.id)}
                    className="tf-action tf-action-edit"
                    title="Edit"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="tf-action tf-action-delete"
                    title="Hapus"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )

            },
          ]}
          pageSize={10}
          title="Daftar Barang"
          emptyMessage="Tidak ada data barang."
          loading={loading}
          serverPagination={
            meta
              ? {
                  page,
                  pageSize: meta.pageSize,
                  totalItems: meta.totalItems,
                  totalPages: meta.totalPages,
                  onPageChange: setPage,
                }
              : undefined
          }
        />
      </div>

      <CreateUpdateModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onSuccess={() => {
          refresh(1);
          setOpenCreate(false);
        }}
        mode={formMode}
        title="Barang"
        fields={[
          {name: "nama", type:"text"}, 
          {name: "satuan", type:"text"}
        ]}
        endpoint="/barang"
        initialData={initialData}
      />

      {showConfirm && (
        <ConfirmButton
          message="Yakin hapus data ini?"
          onConfirm={deleteData}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </DashboardLayout>
  );
}