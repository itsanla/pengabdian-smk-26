"use client";

import { useState } from "react";
import { apiRequest } from "@/services/api.service";
import { ShieldAlert, Eye, EyeOff, AlertTriangle } from "lucide-react";

interface AdminConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function AdminConfirmModal({
  isOpen,
  onClose,
  onConfirm,
}: AdminConfirmModalProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleClose = () => {
    setPassword("");
    setError("");
    setShowPassword(false);
    onClose();
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError("Password harus diisi.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await apiRequest({
        endpoint: "/users/verify-password",
        method: "POST",
        data: { password },
      });
      handleClose();
      onConfirm();
    } catch {
      setError("Password salah. Akses ditolak.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100">
            <ShieldAlert size={20} className="text-red-600" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900">
              Konfirmasi Akses Admin
            </h2>
            <p className="text-xs text-gray-500">Verifikasi identitas sebelum melanjutkan</p>
          </div>
        </div>

        {/* Warning Banner */}
        <div className="mx-6 mt-5 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <AlertTriangle size={18} className="text-amber-600 mt-0.5 shrink-0" />
          <div className="text-sm text-amber-800 leading-snug">
            <p className="font-semibold mb-1">Data Penjualan Bersifat Sensitif</p>
            <p>
              Pastikan perubahan yang akan dilakukan telah disetujui oleh{" "}
              <span className="font-semibold">kepala sekolah</span> atau{" "}
              <span className="font-semibold">pihak yang berwenang</span>.
              Setiap perubahan akan mempengaruhi laporan keuangan dan stok produksi.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleVerify} className="px-6 pt-5 pb-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Password Admin
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                placeholder="Masukkan password admin"
                className={`w-full rounded-lg border px-3 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 ${
                  error ? "border-red-400 bg-red-50" : "border-gray-300"
                }`}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {error && (
              <p className="mt-1.5 text-xs text-red-600 font-medium">{error}</p>
            )}
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60 transition-colors"
            >
              {loading ? "Memverifikasi..." : "Verifikasi & Lanjutkan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
