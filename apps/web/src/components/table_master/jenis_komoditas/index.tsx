"use client";
import { useState } from "react";
import { PenBox, Trash2 } from "lucide-react";
import { apiRequest } from "@/services/api.service";
import { DataTable } from "@/components/table/DataTable";
import { Jenis as JenisType } from "@/types";
import ConfirmButton from "@/components/common/ConfirmButton";
import toast from "react-hot-toast";
import { usePaginatedApi } from "@/hooks/usePaginatedApi";

type Props = {
  onEdit: (jenis: JenisType) => void;
  reloadTrigger: boolean;
};

export default function Jenis_Komoditas({ onEdit, reloadTrigger }: Props) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const {
    data: jenisList,
    meta,
    page,
    setPage,
    loading,
    refresh,
  } = usePaginatedApi<JenisType>("/jenis", [reloadTrigger]);
  const pageSize = meta?.pageSize ?? 10;

  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  // delete data
  const confirmDelete = async () => {
    if (deleteId !== null) {
      try {
        await apiRequest({
          endpoint: `/jenis/${deleteId}`,
          method: "DELETE"
        });
        toast.success("Data berhasil dihapus.");
        refresh(1);
      } catch (error) {
        console.error("Gagal hapus data jenis", error);
        toast.error("Gagal menghapus data.")
      } finally {
        setShowConfirm(false);
        setDeleteId(null);
      }
    }
  };

  const columns = [
    {
      header: "#",
      accessorKey: "id" as keyof JenisType,
      cell: (item: JenisType) => (
        (page - 1) * pageSize +
        jenisList.findIndex((p) => p.id === item.id) +
        1
      ).toString(),
    },
    { header: "Nama", accessorKey: "name" as keyof JenisType },
    {
      header: "Aksi",
      accessorKey: "id" as keyof JenisType,
      cell: (item: JenisType) => (
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(item)}
            className="tf-action tf-action-edit"
          >
            <PenBox size={16} />
          </button>
          <button
            onClick={() => handleDeleteClick(item.id)}
            className="tf-action tf-action-delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <DataTable
        data={jenisList}
        columns={columns}
        loading={loading}
        title="Daftar Jenis Komoditas"
        emptyMessage="Tidak ada data jenis komoditas."
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
      {showConfirm && (
        <ConfirmButton
          message="Yakin ingin menghapus data ini?"
          onConfirm={confirmDelete}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  );
}
