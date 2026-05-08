"use client";

import { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx-js-style";
import { apiRequest } from "@/services/api.service";

interface ExportPenjualanModalProps {
  penjualanList: any[];
  onClose: () => void;
  isOpen: boolean;
}

export default function ExportPenjualanModal({
  onClose,
  isOpen,
}: ExportPenjualanModalProps) {
  const [selectedMonth, setSelectedMonth] = useState("");
  const [loading, setLoading] = useState(false);
  const [availableMonths, setAvailableMonths] = useState<string[]>([]);
  const [loadingMonths, setLoadingMonths] = useState(false);

  const monthFormatter = useMemo(
    () => new Intl.DateTimeFormat("id-ID", { month: "long", year: "numeric" }),
    [],
  );

  const monthOptions = useMemo(() => {
    return availableMonths.map((value) => {
      const [year, month] = value.split("-").map(Number);
      const date = new Date(year, month - 1, 1);
      return { value, label: monthFormatter.format(date) };
    });
  }, [availableMonths, monthFormatter]);

  useEffect(() => {
    if (!isOpen) return;

    setLoadingMonths(true);
    apiRequest({ endpoint: "/penjualan/export/bulan" })
      .then((data: string[]) => {
        setAvailableMonths(Array.isArray(data) ? data : []);
      })
      .catch(() => setAvailableMonths([]))
      .finally(() => setLoadingMonths(false));
  }, [isOpen]);

  useEffect(() => {
    if (monthOptions.length === 0) {
      setSelectedMonth("");
      return;
    }
    const isValid = monthOptions.some((m) => m.value === selectedMonth);
    if (!isValid) setSelectedMonth(monthOptions[0].value);
  }, [monthOptions]);

  if (!isOpen) return null;

  const fetchMonthData = async (): Promise<any[]> => {
    const data = await apiRequest({
      endpoint: `/penjualan/export/data?bulan=${selectedMonth}`,
    });
    return Array.isArray(data) ? data : [];
  };

  const handleExport = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedMonth) {
      alert("Silakan pilih bulan terlebih dahulu.");
      return;
    }

    setLoading(true);

    try {
      const filteredData = await fetchMonthData();

      if (filteredData.length === 0) {
        alert("Tidak ada data penjualan pada bulan ini.");
        return;
      }

      const totalHarga = filteredData.reduce(
        (sum, item) => sum + (item?.total_harga ?? 0),
        0,
      );
      const totalBerat = filteredData.reduce(
        (sum, item) => sum + (item?.total_berat_kg ?? 0),
        0,
      );

      const excelData = filteredData.map((item, index) => ({
        No: index + 1,
        Tanggal: new Date(item.createdAt).toLocaleDateString("id-ID"),
        Bulan: new Date(item.createdAt).toLocaleString("default", { month: "short" }),
        "Jumlah Produk": item?.jumlah_produk ?? 0,
        "Kode Produksi":
          Array.isArray(item?.kode_produksi_list) && item.kode_produksi_list.length > 0
            ? item.kode_produksi_list.join(", ")
            : "-",
        "Total Harga": item?.total_harga ?? 0,
        "Berat (kg)": item?.total_berat_kg ?? 0,
        Keterangan: item?.keterangan || "-",
      }));

      excelData.push({
        No: "" as any,
        Tanggal: "",
        Bulan: "",
        "Jumlah Produk": "" as any,
        "Kode Produksi": "TOTAL",
        "Total Harga": totalHarga,
        "Berat (kg)": totalBerat,
        Keterangan: "",
      });

      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const range = XLSX.utils.decode_range(worksheet["!ref"]!);
      const totalRowIndex = range.e.r;

      for (let R = range.s.r; R <= range.e.r; ++R) {
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const cell_ref = XLSX.utils.encode_cell({ r: R, c: C });
          if (!worksheet[cell_ref]) continue;

          const isHeader = R === 0;
          const isTotalRow = R === totalRowIndex;
          const isNoColumn = C === 0;

          worksheet[cell_ref].s = {
            border: {
              top: { style: "thin", color: { rgb: "000000" } },
              bottom: { style: "thin", color: { rgb: "000000" } },
              left: { style: "thin", color: { rgb: "000000" } },
              right: { style: "thin", color: { rgb: "000000" } },
            },
            alignment: {
              vertical: "center",
              horizontal: isHeader || isNoColumn || isTotalRow ? "center" : "left",
              wrapText: true,
            },
            fill:
              isHeader || isTotalRow
                ? { fgColor: { rgb: "4C9900" } }
                : undefined,
            font: {
              name: "Arial",
              sz: 11,
              bold: isHeader || isTotalRow,
              color: { rgb: isHeader || isTotalRow ? "FFFFFF" : "000000" },
            },
          };
        }
      }

      const colWidths = (
        Object.keys(excelData[0]) as (keyof (typeof excelData)[0])[]
      ).map((key) => {
        const maxLength = Math.max(
          String(key).length,
          ...excelData.map((item) => String(item[key] ?? "").length),
        );
        return { wch: maxLength + 2 };
      });

      worksheet["!cols"] = colWidths;

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Penjualan");
      XLSX.writeFile(workbook, `Laporan-Penjualan-${selectedMonth}.xlsx`);
      onClose();
    } catch (err) {
      console.error("Gagal mengekspor data:", err);
      alert("Terjadi kesalahan saat mengekspor data.");
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = async () => {
    if (!selectedMonth) {
      alert("Silakan pilih bulan terlebih dahulu.");
      return;
    }

    setLoading(true);

    try {
      const filteredData = await fetchMonthData();

      if (filteredData.length === 0) {
        alert("Tidak ada data penjualan pada bulan ini.");
        return;
      }

      const fmt = (n: number) =>
        `Rp${new Intl.NumberFormat("id-ID").format(n)},-`;

      const totalHarga = filteredData.reduce(
        (sum, item) => sum + (item?.total_harga ?? 0),
        0,
      );
      const totalBerat = filteredData.reduce(
        (sum, item) => sum + (item?.total_berat_kg ?? 0),
        0,
      );

      const pdfData = filteredData.map((item, index) => [
        index + 1,
        new Date(item.createdAt).toLocaleDateString("id-ID"),
        new Date(item.createdAt).toLocaleString("default", { month: "short" }),
        item?.jumlah_produk ?? 0,
        Array.isArray(item?.kode_produksi_list) && item.kode_produksi_list.length > 0
          ? item.kode_produksi_list.join(", ")
          : "-",
        fmt(item?.total_harga ?? 0),
        `${item?.total_berat_kg ?? 0} kg`,
        item?.keterangan || "-",
      ]);

      const doc = new (await import("jspdf")).jsPDF({ orientation: "landscape" });
      const autoTable = (await import("jspdf-autotable")).default;

      const [year, month] = selectedMonth.split("-").map(Number);
      const bulanLabel = monthFormatter.format(new Date(year, month - 1, 1));

      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text(`Laporan Penjualan - ${bulanLabel}`, 14, 14);

      autoTable(doc, {
        head: [
          ["No", "Tanggal", "Bulan", "Jumlah Produk", "Kode Produksi", "Total Harga", "Berat (kg)", "Keterangan"],
        ],
        body: pdfData,
        foot: [
          ["", "", "", "", "TOTAL", fmt(totalHarga), `${totalBerat} kg`, ""],
        ],
        styles: {
          font: "helvetica",
          fontSize: 8,
          cellPadding: 3,
          overflow: "linebreak",
          valign: "middle",
        },
        headStyles: {
          fillColor: [76, 153, 0],
          textColor: 255,
          fontStyle: "bold",
          halign: "center",
        },
        footStyles: {
          fillColor: [76, 153, 0],
          textColor: 255,
          fontStyle: "bold",
          halign: "center",
        },
        columnStyles: {
          0: { halign: "center", cellWidth: 10 },
          5: { halign: "right" },
          6: { halign: "center" },
        },
        theme: "grid",
        margin: { top: 22 },
        showFoot: "lastPage",
      });

      doc.save(`Laporan-Penjualan-${selectedMonth}.pdf`);
      onClose();
    } catch (error) {
      console.error("Gagal ekspor PDF:", error);
      alert("Terjadi kesalahan saat mengekspor ke PDF.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-[rgba(0,0,0,0.5)] backdrop-blur-sm flex justify-center items-center">
      <div className="bg-white rounded-xl p-6 w-96 shadow-xl">
        <h2 className="text-lg font-semibold mb-4">Export Laporan Penjualan</h2>
        <form onSubmit={handleExport} className="space-y-4">
          <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
            Pilih Bulan
          </label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-full p-2 border rounded-md dark:bg-gray-900 dark:text-white"
            disabled={loadingMonths || loading || monthOptions.length === 0}
          >
            {loadingMonths ? (
              <option value="">Memuat daftar bulan...</option>
            ) : monthOptions.length === 0 ? (
              <option value="">Belum ada data</option>
            ) : null}
            {monthOptions.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="bg-gray-300 px-4 py-2 rounded"
              onClick={onClose}
              disabled={loading}
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading || loadingMonths || !selectedMonth}
              className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {loading ? "Mengekspor..." : "Excel"}
            </button>
            <button
              type="button"
              disabled={loading || loadingMonths || !selectedMonth}
              onClick={handleExportPDF}
              className="bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {loading ? "Mengekspor..." : "PDF"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
