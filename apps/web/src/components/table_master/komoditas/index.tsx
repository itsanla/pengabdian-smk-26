"use client";
import { useState } from "react";
import { InfoIcon, PenBox, Trash2 } from "lucide-react";
import { apiRequest } from "@/services/api.service";
import InputKomoditasForm from "./input";
import InfoKomoditasForm from "./info";
import { DataTable } from "@/components/table/DataTable";
import { Komoditas as KomoditasType } from "@/types";
import ConfirmButton from "@/components/common/ConfirmButton";
import toast from "react-hot-toast";
import { usePaginatedApi } from "@/hooks/usePaginatedApi";

export default function Komoditas() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUpdateOpen, setIsUpdateOpen] = useState(false);
    const [isInfoOpen, setIsInfoOpen] = useState(false);
    const [selectedKomoditas, setSelectedKomoditas] = useState<KomoditasType | null>(null);
    const [komoditasYgDipilih, setKomoditasYgDipilih] = useState<KomoditasType | null>(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const {
        data: komoditasList,
        meta,
        page,
        setPage,
        loading,
        refresh,
    } = usePaginatedApi<KomoditasType>("/komoditas");

    const pageSize = meta?.pageSize ?? 10;

    // update modal
    const handleOpenUpdateModal = (data: KomoditasType) => {
        setKomoditasYgDipilih(data);
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
                    endpoint: `/komoditas/${deleteId}`,
                    method: "DELETE",
                });
                toast.success("Data berhasil dihapus.");
                refresh(1);
            } catch (error) {
                console.error("Gagal hapus data Komoditas", error);
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
            accessorKey: "id" as keyof KomoditasType,
            cell: (item: KomoditasType) => (
                (page - 1) * pageSize +
                komoditasList.findIndex((k) => k.id === item.id) +
                1
            ).toString(),
        },
        { header: "Jenis Komoditas", accessorKey: "jenis" as keyof KomoditasType, cell: (item: KomoditasType) => item.jenis.name },
        { header: "Nama", accessorKey: "nama" as keyof KomoditasType },
        { header: "Jumlah", accessorKey: "jumlah" as keyof KomoditasType },
        {
            header: "Aksi",
            accessorKey: "id" as keyof KomoditasType,
            cell: (item: KomoditasType) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => handleOpenUpdateModal(item)}
                        className="tf-action tf-action-edit"
                        title="Edit"
                    >
                        <PenBox size={16} />
                    </button>
                    <button
                        className="tf-action tf-action-info"
                        onClick={() => {
                            setSelectedKomoditas(item);
                            setIsInfoOpen(true);
                        }}
                        title="Detail">
                        <InfoIcon size={16} />
                    </button>
                    <button
                        onClick={() => handleDeleteClick(item.id)}
                        className="tf-action tf-action-delete"
                        title="Hapus"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <>
            <div className="tf-toolbar" style={{ justifyContent: "flex-end" }}>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="tf-btn-green"
                    type="button">
                    + Buat Komoditas Baru
                </button>
                <InputKomoditasForm
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmitSuccess={() => refresh(1)}
                />
            </div>
            <DataTable
                data={komoditasList}
                columns={columns}
                loading={loading}
                title="Daftar Komoditas"
                emptyMessage="Tidak ada data komoditas."
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
            <InfoKomoditasForm
                isOpen={isInfoOpen}
                onClose={() => setIsInfoOpen(false)}
                selectedKomoditas={selectedKomoditas}
            />
            <InputKomoditasForm
                isOpen={isUpdateOpen}
                onClose={() => setIsUpdateOpen(false)}
                formMode="update"
                initialData={komoditasYgDipilih}
                onSubmitSuccess={() => {
                    setIsUpdateOpen(false);
                    refresh(1);
                }}
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
