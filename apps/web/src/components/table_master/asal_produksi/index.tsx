"use client";
import { useState } from "react";
import { PenBox, Trash2 } from "lucide-react";
import { apiRequest } from "@/services/api.service";
import { DataTable } from "@/components/table/DataTable";
import { AsalProduksi as AsalProduksiType } from "@/types";
import ConfirmButton from "@/components/common/ConfirmButton";
import toast from "react-hot-toast";
import { usePaginatedApi } from "@/hooks/usePaginatedApi";

type Props = {
    onEditAsal: (asal: AsalProduksiType) => void;
    reloadTrigger: boolean;
};

export default function AsalProduksi({ onEditAsal, reloadTrigger }: Props) {
    const [showConfirm, setShowConfirm] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const {
        data: asalProduksiList,
        meta,
        page,
        setPage,
        loading,
        refresh,
    } = usePaginatedApi<AsalProduksiType>("/asal-produksi", [reloadTrigger]);
    const pageSize = meta?.pageSize ?? 10;

    const handleDeleteClick = (id: number) => {
        setDeleteId(id);
        setShowConfirm(true);
    };

    const confirmDelete = async () => {
        if (deleteId !== null) {
            try {
                await apiRequest({
                    endpoint: `/asal-produksi/${deleteId}`,
                    method: "DELETE",
                });
                toast.success("Data berhasil dihapus.");
                refresh(1);
            } catch (error) {
                console.error("Gagal hapus data Asal Produksi:", error);
                toast.error("Gagal menghapus data.");
            } finally {
                setShowConfirm(false);
                setDeleteId(null);
            }
        }
    };

    const columns = [
        {
            header: "#",
            accessorKey: "id" as keyof AsalProduksiType,
            cell: (item: AsalProduksiType) => (
                (page - 1) * pageSize +
                asalProduksiList.findIndex((p) => p.id === item.id) +
                1
            ).toString(),
        },
        { header: "Nama", accessorKey: "nama" as keyof AsalProduksiType },
        {
            header: "Aksi",
            accessorKey: "id" as keyof AsalProduksiType,
            cell: (item: AsalProduksiType) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => onEditAsal(item)}
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
                data={asalProduksiList}
                columns={columns}
                loading={loading}
                title="Daftar Asal Produksi"
                emptyMessage="Tidak ada data asal produksi."
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
