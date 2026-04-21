'use client';

import { XMarkIcon } from '@heroicons/react/24/outline';
import { apiRequest } from '@/services/api.service';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    // Handle ESC key to close modal
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEsc);
        }

        return () => {
            document.removeEventListener('keydown', handleEsc);
        };
    }, [isOpen, onClose]);

    // Handle click outside to close
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) onClose();
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[9999] bg-[rgba(0,0,0,0.5)] backdrop-blur-sm flex justify-center items-center"
            onClick={handleBackdropClick}
        >
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">Tambahkan Penjualan</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white focus:outline-none"
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>
                <div className="p-4 text-gray-800 dark:text-gray-200">
                    {children}
                </div>
            </div>
        </div>
    );
};

interface InputPenjualanFormProps {
    isOpen: boolean;
    onClose: () => void;
    formMode?: 'create' | 'update';
    initialData?: any;
    onSubmitSuccess?: () => void;
}

export default function InputPenjualanForm({ isOpen, onClose, formMode = "create", initialData, onSubmitSuccess }: InputPenjualanFormProps) {
    const [id_komodity, setIdKomodity] = useState('');
    const [id_produksi, setIdProduksi] = useState('');
    const [jumlah_terjual, setJumlah_Terjual] = useState('');
    const [keterangan, setKeterangan] = useState('');
    const [loading, setLoading] = useState(false);

    const [komodityList, setKomodityList] = useState<any[]>([]);
    const [produksiList, setProduksiList] = useState<any[]>([]);

    useEffect(() => {
        fetchDataKomodity();
        fetchDataProduksi();

        if (formMode === 'update' && initialData) {
            setIdKomodity(initialData.id_komodity.toString() || "");
            setIdProduksi(initialData.id_produksi.toString() || "");
            setJumlah_Terjual(initialData.jumlah_terjual.toString() || "");
            setKeterangan(initialData.keterangan);
        }
    }, [formMode, initialData]);

    const fetchDataKomodity = async () => {
        try {
            const data = await apiRequest({
                endpoint: '/komoditas',
            });
            setKomodityList(Array.isArray(data) ? data : [data]);
        } catch (error) {
            console.error('Error fetching komoditas:', error);
            toast.error('Gagal mengambil data komoditas.');
        }
    };

    const fetchDataProduksi = async () => {
        try {
            const data = await apiRequest({
                endpoint: '/produksi',
            });
            setProduksiList(Array.isArray(data) ? data : [data]);
        } catch (error) {
            console.error('Error fetching produksi:', error);
            toast.error('Gagal mengambil data produksi.');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            id_komodity: parseInt(id_komodity),
            id_produksi: parseInt(id_produksi),
            jumlah_terjual: parseInt(jumlah_terjual),
            keterangan,
        };

        try {
            const endpoint = formMode === 'create' ? '/penjualan' : `/penjualan/${initialData.id}`;
            const method = formMode === 'create' ? 'POST' : 'PUT';

            await apiRequest({
                endpoint,
                method,
                data: payload,
            });

            toast.success(formMode === 'create' ? 'Data berhasil ditambahkan.' : 'Data berhasil diperbarui.');
            onSubmitSuccess?.();
            onClose();
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error('Gagal menyimpan data.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="p-4">
                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-2 gap-4 text-gray-900 dark:text-gray-100"
                >
                    <div className="flex items-center gap-4">
                        <label>Pilih Komoditas</label>
                    </div>
                    <select
                        value={id_komodity}
                        onChange={(e) => setIdKomodity(e.target.value)}
                        className="border rounded px-2 py-1 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white w-full"
                        required
                    >
                        <option value="">Pilih Komoditas</option>
                        {komodityList.map((komoditas) => (
                            <option key={komoditas.id} value={komoditas.id}>
                                {komoditas.nama}
                            </option>
                        ))}
                    </select>

                    <div className="flex items-center gap-4">
                        <label>Pilih Produksi</label>
                    </div>
                    <select
                        value={id_produksi}
                        onChange={(e) => setIdProduksi(e.target.value)}
                        className="border rounded px-2 py-1 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white w-full"
                        required
                    >
                        <option value="">Pilih Produk</option>
                        {produksiList.map((produksi) => (
                            <option key={produksi.id} value={produksi.id}>
                                {produksi.asal_produksi.nama} - {produksi.kode_produksi}
                            </option>
                        ))}
                    </select>

                    <label>Jumlah Terjual</label>
                    <input
                        type="number"
                        value={jumlah_terjual}
                        onChange={(e) => setJumlah_Terjual(e.target.value)}
                        className="border rounded px-2 py-1 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        required
                    />

                    <label>Keterangan</label>
                    <textarea
                        value={keterangan}
                        onChange={(e) => setKeterangan(e.target.value)}
                        className="border rounded px-2 py-1 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-y"
                        rows={4}
                    />

                    <div className="col-span-2 mt-4 flex justify-end space-x-2">
                        <button
                            type="button"
                            className="px-4 py-2 bg-gray-200 dark:bg-gray-600 dark:text-white text-gray-800 rounded hover:bg-gray-300 dark:hover:bg-gray-500"
                            onClick={onClose}
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                            {loading ? "Menyimpan..." : formMode === "create" ? "Submit" : "Update"}
                        </button>
                    </div>
                </form>

            </div>
        </Modal>
    );
}
