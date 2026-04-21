"use client";
import { apiRequest } from "@/services/api.service";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type Props = {
  selelectedAsalProduksi: any | null;
  setSelectedAsalProduksi: (asal: any | null) => void;
  onSuccess: () => void;
};

export default function InputAsalProduksi({ selelectedAsalProduksi, setSelectedAsalProduksi, onSuccess }: Props) {
  const [nama, setNama] = useState("");
  const [formMode, setFormMode] = useState<"create" | "update">("create");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (selelectedAsalProduksi) {
      setFormMode("update");
      setNama(selelectedAsalProduksi.nama);
    } else {
      setFormMode("create");
      setNama("");
    }
    setErrors({}); // Clear errors on modal open/data change
  }, [selelectedAsalProduksi]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({}); // Clear previous errors

    try {
      const payload = { nama };
      if (formMode === "create") {
        await apiRequest({ endpoint: "/asal-produksi", method: "POST", data: payload });
        toast.success("Asal Produksi berhasil ditambahkan");
      } else if (formMode === "update" && selelectedAsalProduksi?.id) {
        await apiRequest({ endpoint: `/asal-produksi/${selelectedAsalProduksi.id}`, method: "PUT", data: payload });
        toast.success("Asal Produksi berhasil diupdate");
      }

      setNama("");
      setFormMode("create");
      setSelectedAsalProduksi(null);

      onSuccess();
    } catch (err: any) {
      console.error("Error submitting form:", err);
      if (err.response?.data?.errors) {
        const newErrors: Record<string, string> = {};
        err.response.data.errors.forEach((error: any) => {
          newErrors[error.path] = error.msg;
        });
        setErrors(newErrors);
        toast.error(err.response.data.message || "Validasi gagal.");
      } else {
        toast.error(err.message || "Terjadi kesalahan.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center justify-between gap-4 bg-white dark:bg-gray-900 p-4 rounded-md shadow-sm w-full"
    >
      {/* Label dan Input */}
      <div className="flex items-center gap-4 flex-1">
        <label
          htmlFor="nama"
          className="text-sm font-medium text-gray-700 dark:text-gray-300 w-24"
        >
          Asal Produksi
        </label>
        <input
          type="text"
          id="nama"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          className="flex-1 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Masukkan nama"
          required
        />
        {errors.nama && <p className="text-red-500 text-sm mt-1">{errors.nama}</p>}
      </div>

      {/* Tombol Simpan */}
      <button
        type="submit"
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Menyimpan..." : formMode === "create" ? "Simpan" : "Update"}
      </button>
    </form>
  );
}
