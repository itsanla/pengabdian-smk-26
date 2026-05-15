"use client";

import { useEffect, useState, useCallback } from "react";
import { apiRequest } from "@/services/api.service";
import { CheckCircle, Clock, AlertCircle, TrendingUp, Calendar } from "lucide-react";

interface StatusStat {
  count: number;
  nominal: number;
  terbayar: number;
  sisa: number;
}

interface SummaryData {
  bulan: string | null;
  lunas: StatusStat;
  angsuran: StatusStat;
  hutang: StatusStat;
  grand: StatusStat;
}

function formatRupiah(n: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
}

function formatBulan(ym: string) {
  const [y, m] = ym.split("-");
  const names = ["", "Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  return `${names[parseInt(m)]} ${y}`;
}

interface CardProps {
  icon: React.ReactNode;
  label: string;
  count: number;
  nominal: number;
  sisa?: number;
  colorClass: string;
  bgClass: string;
  borderClass: string;
}

function StatCard({ icon, label, count, nominal, sisa, colorClass, bgClass, borderClass }: CardProps) {
  return (
    <div className={`rounded-2xl border ${borderClass} ${bgClass} p-4 flex flex-col gap-2`}>
      <div className="flex items-center justify-between">
        <div className={`flex items-center gap-2 text-sm font-semibold ${colorClass}`}>
          {icon}
          {label}
        </div>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${bgClass} ${colorClass} border ${borderClass}`}>
          {count} transaksi
        </span>
      </div>
      <div>
        <p className="text-xs text-gray-500">Total Nominal</p>
        <p className={`text-base font-bold ${colorClass}`}>{formatRupiah(nominal)}</p>
      </div>
      {sisa !== undefined && sisa > 0 && (
        <div className="rounded-lg bg-white/60 px-3 py-1.5 text-xs text-gray-600">
          Sisa tagihan: <span className="font-semibold text-red-600">{formatRupiah(sisa)}</span>
        </div>
      )}
    </div>
  );
}

export default function PenjualanSummary() {
  const [bulanList, setBulanList] = useState<string[]>([]);
  const [selectedBulan, setSelectedBulan] = useState<string>("");
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest({ endpoint: "/penjualan/export/bulan" })
      .then((data) => {
        const list: string[] = Array.isArray(data) ? data : [];
        setBulanList(list);
        // Default ke bulan berjalan jika ada
        const now = new Date();
        const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
        if (list.includes(thisMonth)) {
          setSelectedBulan(thisMonth);
        }
      })
      .catch(() => {});
  }, []);

  const fetchSummary = useCallback(async () => {
    setLoading(true);
    try {
      const qs = selectedBulan ? `?bulan=${selectedBulan}` : "";
      const data = await apiRequest({ endpoint: `/penjualan/summary${qs}` });
      setSummary(data);
    } catch {
      // keep previous summary
    } finally {
      setLoading(false);
    }
  }, [selectedBulan]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
      {/* Header + Filter */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp size={18} className="text-emerald-600" />
          <h2 className="text-sm font-bold text-gray-800">Ringkasan Penjualan</h2>
        </div>

        <div className="flex items-center gap-2">
          <Calendar size={15} className="text-gray-400 shrink-0" />
          <select
            value={selectedBulan}
            onChange={(e) => setSelectedBulan(e.target.value)}
            className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          >
            <option value="">Semua Bulan</option>
            {bulanList.map((b) => (
              <option key={b} value={b}>{formatBulan(b)}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Cards */}
      {loading ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-28 rounded-2xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : summary ? (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <StatCard
              icon={<CheckCircle size={15} />}
              label="Lunas"
              count={summary.lunas.count}
              nominal={summary.lunas.nominal}
              colorClass="text-emerald-700"
              bgClass="bg-emerald-50"
              borderClass="border-emerald-200"
            />
            <StatCard
              icon={<Clock size={15} />}
              label="Angsuran"
              count={summary.angsuran.count}
              nominal={summary.angsuran.nominal}
              sisa={summary.angsuran.sisa}
              colorClass="text-amber-700"
              bgClass="bg-amber-50"
              borderClass="border-amber-200"
            />
            <StatCard
              icon={<AlertCircle size={15} />}
              label="Hutang"
              count={summary.hutang.count}
              nominal={summary.hutang.nominal}
              sisa={summary.hutang.sisa}
              colorClass="text-red-700"
              bgClass="bg-red-50"
              borderClass="border-red-200"
            />
          </div>

          {/* Grand total bar */}
          <div className="flex flex-col gap-2 rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="font-semibold text-gray-800">{summary.grand.count} total transaksi</span>
              {selectedBulan && (
                <span className="text-xs text-gray-400">· {formatBulan(selectedBulan)}</span>
              )}
            </div>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="text-gray-600">
                Omzet: <span className="font-bold text-gray-900">{formatRupiah(summary.grand.nominal)}</span>
              </div>
              <div className="text-gray-600">
                Terbayar: <span className="font-bold text-emerald-700">{formatRupiah(summary.grand.terbayar)}</span>
              </div>
              {summary.grand.sisa > 0 && (
                <div className="text-gray-600">
                  Sisa tagihan: <span className="font-bold text-red-600">{formatRupiah(summary.grand.sisa)}</span>
                </div>
              )}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
