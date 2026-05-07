"use client";
import { useState } from "react";
import { PenBox, Trash2 } from "lucide-react";
import { apiRequest } from "@/services/api.service";
import { DataTable } from "@/components/table/DataTable";
import { BahanBaku } from "@/types";
import ConfirmButton from "@/components/common/ConfirmButton";
import toast from "react-hot-toast";
import { usePaginatedApi } from "@/hooks/usePaginatedApi";

type Props = {
  onEdit: (item: BahanBaku) => void;
  reloadTrigger: boolean;
};

export default function BahanBakuTable({ onEdit, reloadTrigger }: Props) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data: bahanBakuList, meta, page, setPage, loading, refresh } =
    usePaginatedApi<BahanBaku>("/bahan-baku", [reloadTrigger]);
  const pageSize = meta?.pageSize ?? 10;

  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    if (deleteId !== null) {
      try {
        await apiRequest({ endpoint: `/bahan-baku/${deleteId}`, method: "DELETE" });
        toast.success("Bahan baku berhasil dihapus.");
        refresh(1);
      } catch (error) {
        toast.error("Gagal menghapus bahan baku.");
      } finally {
        setShowConfirm(false);
        setDeleteId(null);
      }
    }
  };

  const columns = [
    {
      header: "#",
      accessorKey: "id" as keyof BahanBaku,
      cell: (item: BahanBaku) =>
        ((page - 1) * pageSize + bahanBakuList.findIndex((b) => b.id === item.id) + 1).toString(),
    },
    { header: "Nama", accessorKey: "nama" as keyof BahanBaku },
    { header: "Satuan", accessorKey: "satuan" as keyof BahanBaku },
    {
      header: "Jumlah",
      accessorKey: "jumlah" as keyof BahanBaku,
      cell: (item: BahanBaku) => `${item.jumlah.toLocaleString("id-ID")}`,
    },
    {
      header: "Aksi",
      accessorKey: "id" as keyof BahanBaku,
      cell: (item: BahanBaku) => (
        <div className="flex gap-2">
          <button onClick={() => onEdit(item)} className="tf-action tf-action-edit">
            <PenBox size={16} />
          </button>
          <button onClick={() => handleDeleteClick(item.id)} className="tf-action tf-action-delete">
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <DataTable
        data={bahanBakuList}
        columns={columns}
        loading={loading}
        title="Daftar Bahan Baku"
        emptyMessage="Tidak ada data bahan baku."
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
          message="Yakin ingin menghapus bahan baku ini?"
          onConfirm={confirmDelete}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  );
}
