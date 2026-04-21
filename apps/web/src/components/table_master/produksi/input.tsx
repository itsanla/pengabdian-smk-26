"use client";
import { apiRequest } from "@/services/api.service";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

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
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">Tambah Produksi</h3>
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

interface InputFormProps {
    isOpen: boolean,
    onClose: () => void,
    formMode: "create" | "update",
    initialData?: any,
    onSubmitSuccess: () => void
}

export default function InputProduksiForm({
    isOpen,
    onClose,
    formMode = "create",
    initialData,
    onSubmitSuccess }: InputFormProps) {
    const [id_asal, setId_Asal] = useState("");
    const [id_komoditas, setIdKomoditas] = useState("");
    const [kode_produksi, setKode_Produksi] = useState("");
    const [ukuran, setUkuran] = useState("");
    const [kualitas, setKualitas] = useState("");
    const [jumlah_diproduksi, setJumlahDiproduksi] = useState("");
    const [harga_persatuan, setHargaPersatuan] = useState("");
    const [isCustomKualitas, setIsCustomKualitas] = useState(false); // New state for custom kualitas input
    const [loading, setLoading] = useState(false);
    const [satuan, setSatuan] = useState("Kg");

    const [asalList, setAsalList] = useState<any[]>([]);
    const [komoditasList, setKomoditasList] = useState<any[]>([]);


    useEffect(() => {
        fetchDataAsal();
        fetchDataKomoditas();

        if (formMode === "update" && initialData) {
            console.log("initialData:", initialData);
            setId_Asal(initialData.id_asal?.toString() || "");
            setIdKomoditas(initialData.id_komoditas?.toString() || "");
            setKode_Produksi(initialData.kode_produksi || "");
            setUkuran(initialData.ukuran || "");
            setKualitas(initialData.kualitas || "");
            setJumlahDiproduksi(initialData.jumlah?.toString() || "");
            setHargaPersatuan(initialData.harga_persatuan?.toString() || "");
            // Set isCustomKualitas based on initialData.kualitas if it's not 'Medium' or 'Premium'
            setIsCustomKualitas(initialData.kualitas && !["Medium", "Premium"].includes(initialData.kualitas));
        }
    }, [formMode, initialData]);

    const fetchDataAsal = async () => {
        try {
            const data = await apiRequest({
                endpoint: "/asal-produksi"
            });
            setAsalList(data);
        } catch (error) {
            console.error("Gagal ambil data Asal:", error);
            toast.error("Gagal mengambil data asal produksi.");
        }
    };

    const fetchDataKomoditas = async () => {
        try {
            const data = await apiRequest({
                endpoint: "/komoditas"
            });
            setKomoditasList(data);
        } catch (error) {
            console.error("Gagal ambil data Komoditas:", error);
            toast.error("Gagal mengambil data komoditas.");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            id_asal: parseInt(id_asal),
            id_komoditas: parseInt(id_komoditas),
            kode_produksi,
            ukuran,
            kualitas,
            jumlah_diproduksi: parseInt(jumlah_diproduksi),
            harga_persatuan: parseFloat(harga_persatuan) // Parse as float for currency
        };

        try {
        
            const endpoint = formMode === "create" ? "/produksi" : `/produksi/${initialData.id}`;
            const method = formMode === "create" ? "POST" : "PUT";

            await apiRequest({
                endpoint,
                method,
                data: payload
            });

            toast.success(
                `produksi berhasil ${formMode === "create" ? "ditambahkan" : "diperbarui"}`
            );
            if (onSubmitSuccess) onSubmitSuccess();
            onClose();
        } catch (error) {
            console.error("Gagal simpan data Produksi:", error);
            toast.error("Gagal menyimpan data.");
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
                    <label>Kode Produksi</label>
                    <input
                        type="text"
                        value={kode_produksi}
                        onChange={(e) => setKode_Produksi(e.target.value)}
                        className="border rounded px-2 py-1 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        required
                    />

                    <div className="flex items-center gap-4">
                        <label>Asal Produksi</label>
                    </div>
                    <select
                        value={id_asal}
                        onChange={(e) => setId_Asal(e.target.value)}
                        className="border rounded px-2 py-1 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white w-full"
                        required
                    >
                        <option value="">Pilih Asal Produksi</option>
                        {asalList.map((asal) => (
                            <option key={asal.id} value={asal.id}>
                                {asal.nama}
                            </option>
                        ))}
                    </select>

                    <div className="flex items-center gap-4">
                        <label>Jenis Komoditas</label>
                    </div>
                    <select
                        value={id_komoditas}
                        onChange={(e) => {
                            const selectedKomoditasId = e.target.value;
                            setIdKomoditas(selectedKomoditasId);
                            const selectedKomoditas = komoditasList.find(
                                (komoditas) => komoditas.id.toString() === selectedKomoditasId
                            );
                            if (selectedKomoditas) {
                                setSatuan(selectedKomoditas.satuan);
                            } else {
                                setSatuan("Kg"); // Default to Kg if no komoditas is selected
                            }
                        }}
                        className="border rounded px-2 py-1 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white w-full"
                        required
                    >
                        <option value="">Pilih Komoditas</option>
                        {komoditasList.map((komoditas) => (
                            <option key={komoditas.id} value={komoditas.id}>
                                {komoditas.nama}
                            </option>
                        ))}
                    </select>

                    <label>Ukuran</label>
                    <input
                        type="text"
                        value={ukuran}
                        onChange={(e) => setUkuran(e.target.value)}
                        className="border rounded px-2 py-1 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        required
                    />

                    <label>Kualitas</label>
                    <select
                        value={isCustomKualitas ? "Isi Sendiri" : kualitas}
                        onChange={(e) => {
                            const selectedValue = e.target.value;
                            if (selectedValue === "Isi Sendiri") {
                                setIsCustomKualitas(true);
                                setKualitas(""); // Clear kualitas when switching to custom
                            } else {
                                setIsCustomKualitas(false);
                                setKualitas(selectedValue);
                            }
                        }}
                        className="border rounded px-2 py-1 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white w-full"
                    >
                        <option value="">Pilih Kualitas</option>
                        <option value="Medium">Medium</option>
                        <option value="Premium">Premium</option>
                        <option value="Isi Sendiri">Isi Sendiri</option>
                    </select>
                    {isCustomKualitas && (
                        <input
                            type="text"
                            value={kualitas}
                            onChange={(e) => setKualitas(e.target.value)}
                            className="border rounded px-2 py-1 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white col-span-2"
                            placeholder="Masukkan kualitas custom"
                        />
                    )}

                    <label>Jumlah</label>
                    <input
                        type="number" // Changed to number type
                        placeholder={`Dalam ${satuan}`}
                        value={jumlah_diproduksi}
                        onChange={(e) => setJumlahDiproduksi(e.target.value)}
                        className="border rounded px-2 py-1 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        min="0" // Allow 0 as input
                    />

                    <label>Harga per Satuan</label>
                    <input
                        type="number" // Changed to number type
                        value={harga_persatuan}
                        onChange={(e) => setHargaPersatuan(e.target.value)}
                        className="border rounded px-2 py-1 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        min="0" // Allow 0 as input
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
