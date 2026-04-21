"use client";
import { useEffect, useState } from "react";
import { apiRequest } from "@/services/api.service";
import toast from "react-hot-toast";

type Props = {
  selectedJenis: any | null;
  setSelectedJenis: (jenis: any | null) => void;
  onSuccess: () => void;
};

export default function InputJenisKomoditas({ selectedJenis, setSelectedJenis, onSuccess }: Props) {
  const [name, setName] = useState("");
  const [formMode, setFormMode] = useState<"create" | "update">("create");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (selectedJenis) {
      setFormMode("update");
      setName(selectedJenis.name);
    } else {
      setFormMode("create");
      setName("");
    }
    setErrors({}); // Clear errors on modal open/data change
  }, [selectedJenis]);

  // Submit create atau update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({}); // Clear previous errors

    try {
      const payload = { name };
      if (formMode === "create") {
        await apiRequest({ endpoint: "/jenis", method: "POST", data: payload });
        toast.success("Jenis berhasil ditambahkan");
      } else if (formMode === "update" && selectedJenis?.id) {
        await apiRequest({ endpoint: `/jenis/${selectedJenis.id}`, method: "PUT", data: payload });
        toast.success("Jenis berhasil diupdate");
      }

      setName("");
      setFormMode("create");
      setSelectedJenis(null);

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
          className="text-sm font-medium text-gray-700 dark:text-gray-300 w-24"
        >
          Nama
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Masukkan jenis"
          required
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
      </div>

      {/* Tombol Simpan */}
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Menyimpan..." : formMode === "create" ? "Simpan" : "Update"}
      </button>
    </form>
  );
}
