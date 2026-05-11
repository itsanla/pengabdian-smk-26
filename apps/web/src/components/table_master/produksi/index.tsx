"use client";
import InputProduksiForm from "./input";
import { DataTable } from "@/components/table/DataTable";
import { Produksi as ProduksiType, StokHistoriProduksi } from "@/types";
import ConfirmButton from "@/components/common/ConfirmButton";
import toast from "react-hot-toast";
import { useState } from "react";
import { PenBox, Trash2 } from "lucide-react";
import { apiRequest } from "@/services/api.service";
import { usePaginatedApi } from "@/hooks/usePaginatedApi";

export default function Produksi() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUpdateOpen, setIsUpdateOpen] = useState(false);
    const [produksiYgDipilih, setProduksiYgDipilih] = useState<ProduksiType | null>(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const {
        data: produksiList,
        meta,
        page,
        setPage,
        loading,
        refresh,
    } = usePaginatedApi<ProduksiType>("/produksi");
    const pageSize = meta?.pageSize ?? 10;

    const {
        data: historyList,
        meta: historyMeta,
        page: historyPage,
        setPage: setHistoryPage,
        loading: historyLoading,
        refresh: refreshHistory,
    } = usePaginatedApi<StokHistoriProduksi>("/produksi/history");

    const handleOpenUpdateModal = (data: ProduksiType) => {
        setProduksiYgDipilih(data);
        setIsUpdateOpen(true);
    };

    const handleDeleteClick = (id: number) => {
        setDeleteId(id);
        setShowConfirm(true);
    };

    const confirmDelete = async () => {
        if (deleteId !== null) {
            try {
                await apiRequest({
                    endpoint: `/produksi/${deleteId}`,
                    method: "DELETE",
                });
                toast.success("Data berhasil dihapus.");
                refresh(1);
                refreshHistory(1);
            } catch (error) {
                console.error("Gagal hapus data Produksi", error);
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
            accessorKey: "id" as keyof ProduksiType,
            cell: (item: ProduksiType) => (
                (page - 1) * pageSize +
                produksiList.findIndex((p) => p.id === item.id) +
                1
            ).toString(),
        },
        { header: "Kode Produksi", accessorKey: "kode_produksi" as keyof ProduksiType },
        { header: "Asal Produksi", accessorKey: "asal_produksi" as keyof ProduksiType, cell: (item: ProduksiType) => item.asal_produksi.nama },
        { header: "Jenis Komoditas", accessorKey: "komoditas" as keyof ProduksiType, cell: (item: ProduksiType) => item.komoditas?.nama || "" },
        { header: "Kualitas", accessorKey: "kualitas" as keyof ProduksiType },
        {
            header: "Harga per kg",
            accessorKey: "harga_persatuan" as keyof ProduksiType,
            cell: (item: ProduksiType) => (
                <span className="font-medium">
                    {item.harga_persatuan
                        ? `Rp ${new Intl.NumberFormat("id-ID").format(item.harga_persatuan)}`
                        : "Rp 0"}
                </span>
            ),
        },
        { header: "Jumlah Produksi", accessorKey: "jumlah" as keyof ProduksiType },
        {
            header: "Aksi",
            accessorKey: "id" as keyof ProduksiType,
            cell: (item: ProduksiType) => (
                <div className="flex gap-2">
                    <button
                        className="tf-action tf-action-edit"
                        onClick={() =>
                            handleOpenUpdateModal(item)
                        }
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

    const historyColumns = [
        {
            header: "#",
            accessorKey: "id" as keyof StokHistoriProduksi,
            cell: (item: StokHistoriProduksi) => (
                (historyPage - 1) * (historyMeta?.pageSize ?? 10) +
                historyList.findIndex((h) => h.id === item.id) +
                1
            ).toString(),
        },
        { header: "Kode Produksi", accessorKey: "kode_produksi" as keyof StokHistoriProduksi },
        {
            header: "Tipe",
            accessorKey: "tipe" as keyof StokHistoriProduksi,
            cell: (item: StokHistoriProduksi) => {
                const map: Record<string, string> = {
                    buat: "bg-blue-100 text-blue-700",
                    tambah: "bg-green-100 text-green-700",
                    kurang: "bg-red-100 text-red-700",
                    update: "bg-yellow-100 text-yellow-700",
                    hapus: "bg-gray-100 text-gray-700",
                };
                const label: Record<string, string> = {
                    buat: "Buat",
                    tambah: "Tambah",
                    kurang: "Kurang",
                    update: "Update",
                    hapus: "Hapus",
                };
                return (
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${map[item.tipe] ?? "bg-gray-100 text-gray-700"}`}>
                        {label[item.tipe] ?? item.tipe}
                    </span>
                );
            },
        },
        { header: "Jml Sebelum", accessorKey: "jumlah_sebelum" as keyof StokHistoriProduksi },
        { header: "Jml Sesudah", accessorKey: "jumlah_sesudah" as keyof StokHistoriProduksi },
        {
            header: "Selisih",
            accessorKey: "selisih" as keyof StokHistoriProduksi,
            cell: (item: StokHistoriProduksi) => (
                <span className={item.selisih > 0 ? "text-green-600 font-semibold" : item.selisih < 0 ? "text-red-600 font-semibold" : "text-gray-500"}>
                    {item.selisih > 0 ? `+${item.selisih}` : item.selisih}
                </span>
            ),
        },
        { header: "Keterangan", accessorKey: "keterangan" as keyof StokHistoriProduksi },
        {
            header: "Tanggal",
            accessorKey: "createdAt" as keyof StokHistoriProduksi,
            cell: (item: StokHistoriProduksi) =>
                new Date(item.createdAt).toLocaleString("id-ID", {
                    dateStyle: "short",
                    timeStyle: "short",
                }),
        },
    ];

    return (
        <>
            <div className="tf-toolbar" style={{ justifyContent: "flex-end" }}>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="tf-btn-green"
                    type="button">
                    + Tambah Produksi
                </button>
                <InputProduksiForm
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    formMode="create"
                    initialData={null}
                    onSubmitSuccess={() => {
                        setIsModalOpen(false);
                        refresh(1);
                        refreshHistory(1);
                    }}
                />
            </div>
            <DataTable
                data={produksiList}
                columns={columns}
                loading={loading}
                title="Daftar Produksi"
                emptyMessage="Tidak ada data produksi."
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
            <InputProduksiForm
                isOpen={isUpdateOpen}
                onClose={() => setIsUpdateOpen(false)}
                formMode="update"
                initialData={produksiYgDipilih}
                onSubmitSuccess={() => {
                    setIsUpdateOpen(false);
                    refresh(1);
                    refreshHistory(1);
                }}
            />
            {showConfirm && (
                <ConfirmButton
                    message="Yakin ingin menghapus data ini?"
                    onConfirm={confirmDelete}
                    onCancel={() => setShowConfirm(false)}
                />
            )}

            <div className="mt-8">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">History Perubahan Stok</h2>
                <DataTable
                    data={historyList}
                    columns={historyColumns}
                    loading={historyLoading}
                    title=""
                    emptyMessage="Belum ada history perubahan stok."
                    serverPagination={
                        historyMeta
                            ? {
                                page: historyPage,
                                pageSize: historyMeta.pageSize,
                                totalItems: historyMeta.totalItems,
                                totalPages: historyMeta.totalPages,
                                onPageChange: setHistoryPage,
                            }
                            : undefined
                    }
                />
            </div>
        </>
    );
}
