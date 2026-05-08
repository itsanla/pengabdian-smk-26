"use client";

import { useState } from "react";
import { apiRequest } from "@/services/api.service";
import toast from "react-hot-toast";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface BayarPenjualanModalProps {
  isOpen: boolean;
  onClose: () => void;
  penjualan: {
    id: number;
    total_harga: number;
    total_terbayar: number;
    sisa_bayar: number;
    status: string;
  };
  onSubmitSuccess: () => void;
}

const fmt = (n: number) => new Intl.NumberFormat("id-ID").format(n);

export default function BayarPenjualanModal({
  isOpen,
  onClose,
  penjualan,
  onSubmitSuccess,
}: BayarPenjualanModalProps) {
  const [jumlahBayar, setJumlahBayar] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sisa = penjualan.sisa_bayar;

  const handleClose = () => {
    setJumlahBayar("");
    setKeterangan("");
    setError("");
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(jumlahBayar);
    if (!amount || amount <= 0) {
      setError("Jumlah bayar harus lebih dari 0");
      return;
    }
    if (amount > sisa) {
      setError(`Jumlah bayar tidak boleh melebihi sisa tagihan (Rp${fmt(sisa)})`);
      return;
    }
    setError("");
    setLoading(true);
    try {
      await apiRequest({
        endpoint: `/penjualan/${penjualan.id}/bayar`,
        method: "POST",
        data: { jumlah_bayar: amount, keterangan },
      });
      toast.success("Pembayaran berhasil dicatat.");
      onSubmitSuccess();
      handleClose();
    } catch {
      toast.error("Gagal mencatat pembayaran.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-sm mx-4">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">Tambah Pembayaran</h3>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 space-y-3">
          {/* Ringkasan tagihan */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Total tagihan</span>
              <span className="font-medium">Rp{fmt(penjualan.total_harga)},-</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Sudah dibayar</span>
              <span className="font-medium text-green-600">Rp{fmt(penjualan.total_terbayar)},-</span>
            </div>
            <div className="flex justify-between border-t border-gray-200 dark:border-gray-600 pt-1 mt-1">
              <span className="font-semibold text-red-600">Sisa tagihan</span>
              <span className="font-bold text-red-600">Rp{fmt(sisa)},-</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Jumlah Bayar (Rp) *
              </label>
              <input
                type="number"
                min={1}
                max={sisa}
                value={jumlahBayar}
                onChange={(e) => { setJumlahBayar(e.target.value); setError(""); }}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder={`Maks. Rp${fmt(sisa)}`}
                required
              />
              {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
              {jumlahBayar && Number(jumlahBayar) > 0 && Number(jumlahBayar) <= sisa && (
                <p className="mt-1 text-xs text-gray-500">
                  Sisa setelah bayar: Rp{fmt(sisa - Number(jumlahBayar))}
                  {Number(jumlahBayar) === sisa && (
                    <span className="ml-1 text-green-600 font-medium">→ Lunas</span>
                  )}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Keterangan (opsional)
              </label>
              <input
                type="text"
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Mis: Cicilan ke-2"
              />
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-800"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 text-sm rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? "Menyimpan..." : "Simpan Pembayaran"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
