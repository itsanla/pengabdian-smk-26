"use client";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { useEffect, useState } from "react";
import { DataTable } from "@/components/table/DataTable";
import { Pencil, Trash2, Plus } from "lucide-react";
import { apiRequest, fetchAllPages } from "@/services/api.service";
import { TransaksiBarang, Barang } from "@/types";
import ConfirmButton from "@/components/common/ConfirmButton";
import { usePaginatedApi } from "@/hooks/usePaginatedApi";

export default function DashboardBarang() {
  const {
    data: barangMasuk,
    meta: metaMasuk,
    page: pageMasuk,
    setPage: setPageMasuk,
    loading: loadingMasuk,
    refresh: refreshMasuk,
  } = usePaginatedApi<TransaksiBarang>("/transaksi-barang?jenis=masuk");
  const {
    data: barangKeluar,
    meta: metaKeluar,
    page: pageKeluar,
    setPage: setPageKeluar,
    loading: loadingKeluar,
    refresh: refreshKeluar,
  } = usePaginatedApi<TransaksiBarang>("/transaksi-barang?jenis=keluar");
  const [barang, setBarang] = useState<Barang[]>([]);
  const [activeTab, setActiveTab] = useState<"masuk" | "keluar">("masuk");
  const [openCreate, setOpenCreate] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "update">("create");
  const [transactionType, setTransactionType] = useState<"masuk" | "keluar">("masuk");
  const [initialData, setInitialData] = useState<any>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isLoadingBarang, setIsLoadingBarang] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<any>({});
  const loading = activeTab === "masuk" ? loadingMasuk : loadingKeluar;
  const pageSizeMasuk = metaMasuk?.pageSize ?? 10;
  const pageSizeKeluar = metaKeluar?.pageSize ?? 10;
  const activePage = activeTab === "masuk" ? pageMasuk : pageKeluar;
  const activePageSize = activeTab === "masuk" ? pageSizeMasuk : pageSizeKeluar;
  
  const fetchBarang = async () => {
    try {
      setIsLoadingBarang(true);
      const data = await fetchAllPages<Barang>({ endpoint: "/barang" });
      setBarang(data);
    } catch (error) {
      console.error("Error fetching barang:", error);
      setBarang([]);
    } finally {
      setIsLoadingBarang(false);
    }
  };

  const handleUpdate = (barangToEdit: TransaksiBarang) => {
    if (barangToEdit) {
      setFormMode("update");
      setInitialData(barangToEdit);
      const type = barangToEdit.masuk > 0 ? "masuk" : "keluar";
      setTransactionType(type);
      setOpenCreate(true);
    }
  };

  const handleDelete = (trans: TransaksiBarang) => {
    setDeleteId(trans.id);
    setShowConfirm(true);
  };

  const deleteData = async () => {
    if (deleteId !== null) {
      try {
        await apiRequest({
          endpoint: `/transaksi-barang/${deleteId}`,
          method: "DELETE",
        });
        refreshMasuk(1);
        refreshKeluar(1);
        setShowConfirm(false);
        setDeleteId(null);
      } catch (error) {
        console.error("Error deleting data:", error);
      }
    }
  };

  // Get selected item stock
  const getSelectedItemStock = () => {
    if (!formData.id_barang) return 0;
    const selectedItem = barang.find(item => item.id === parseInt(formData.id_barang));
    return selectedItem ? selectedItem.jumlah : 0;
  };

  // Get available stock for outgoing transactions (considering current edit)
  const getAvailableStock = () => {
    const currentStock = getSelectedItemStock();
    
    // If updating an existing outgoing transaction, add back the original amount
    if (formMode === "update" && initialData && transactionType === "keluar") {
      return currentStock + initialData.keluar;
    }
    
    return currentStock;
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev: any) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    
    const newErrors: any = {};
    if (!formData.id_barang) newErrors.id_barang = "Barang harus dipilih";
    if (!formData.tanggal) newErrors.tanggal = "Tanggal harus diisi";
    if (!formData.jumlah || formData.jumlah <= 0) newErrors.jumlah = "Jumlah buah harus lebih dari 0";
    
    // Validate stock for outgoing transactions
    if (transactionType === "keluar") {
      const availableStock = getAvailableStock();
      const requestedAmount = parseInt(formData.jumlah) || 0;
      
      if (requestedAmount > availableStock) {
        newErrors.jumlah = `Stok tidak mencukupi. Stok tersedia: ${availableStock}`;
      }
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const apiData = {
        id_barang: parseInt(formData.id_barang),
        tanggal: formData.tanggal,
        masuk: transactionType === "masuk" ? parseInt(formData.jumlah) : 0,
        keluar: transactionType === "keluar" ? parseInt(formData.jumlah) : 0,
        keterangan: formData.keterangan || ""
      };

      await apiRequest({
        endpoint: formMode === "create" ? "/transaksi-barang" : `/transaksi-barang/${initialData?.id}`,
        method: formMode === "create" ? "POST" : "PUT",
        data: apiData,
      });
      if (transactionType === "masuk") {
        refreshMasuk(1);
      } else {
        refreshKeluar(1);
      }
      fetchBarang();
      setOpenCreate(false);
    } catch (error: any) {
      console.error(error);
      if (error.response?.data?.errors) {
        const newErrors: any = {};
        error.response.data.errors.forEach((err: any) => {
          newErrors[err.path] = err.msg;
        });
        setErrors(newErrors);
      }
    }
  };

  const addTransaction = (type: "masuk" | "keluar") => {
    setFormMode("create");
    setTransactionType(type);
    setOpenCreate(true);
  };

  const TabButton = ({ type, isActive, onClick, children }: any) => (
    <button
      onClick={onClick}
      className={`tf-chip ${isActive ? "active" : ""}`}
      type="button"
    >
      {children}
    </button>
  );

  const getCurrentData = () => {
    return activeTab === "masuk" ? barangMasuk : barangKeluar;
  };

  const getCurrentColumns = (): {
    header: string;
    accessorKey: keyof TransaksiBarang;
    cell?: (item: TransaksiBarang) => React.ReactNode;
  }[] => [
    {
      header: "#",
      accessorKey: "id",
      cell: (item: TransaksiBarang) =>
        (activePage - 1) * activePageSize +
        getCurrentData().findIndex((p: any) => p.id === item.id) +
        1,
    },
    {
      header: "Nama Barang",
      accessorKey: "nama",
    },
    {
      header: "Jumlah Buah",
      accessorKey: "jumlah"
    },
    {
      header: "Tanggal",
      accessorKey: "tanggal",
      cell: (item: TransaksiBarang) => {
        const date = new Date(item.tanggal);
        const hari = date.toLocaleDateString("id-ID", { weekday: "long" });
        const tanggal = date.toLocaleDateString("id-ID");
        return `${hari}, ${tanggal}`;
      },
    },
    { 
      header: "Keterangan", 
      accessorKey: "keterangan",
    },
    {
      header: "Aksi",
      accessorKey: "createdAt",
      cell: (item: TransaksiBarang) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleUpdate(item)}
            className="tf-action tf-action-edit"
            title="Edit">
            <Pencil size={16} />
          </button>
          <button
            onClick={() => handleDelete(item)}
            className="tf-action tf-action-delete"
            title="Hapus">
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  // Initialize data on component mount
  useEffect(() => {
    const loadData = async () => {
      await fetchBarang();
    };
    loadData();
  }, []);

  // Setup form data when modal opens
  useEffect(() => {
    if (openCreate) {
      if (formMode === "update" && initialData) {
        const jumlah = initialData.masuk > 0 ? initialData.masuk : initialData.keluar;
        setFormData({
          id_barang: initialData.id_barang,
          tanggal: initialData.tanggal,
          jumlah: jumlah,
          keterangan: initialData.keterangan
        });
      } else {
        setFormData({
          id_barang: "",
          tanggal: new Date().toISOString().split('T')[0],
          jumlah: "",
          keterangan: ""
        });
      }
      setErrors({});
    }
  }, [openCreate, formMode, initialData]);

  // Re-fetch barang when modal opens and data is empty
  useEffect(() => {
    if (openCreate && (!barang || barang.length === 0)) {
      fetchBarang();
    }
  }, [openCreate, barang]);

  return (
    <DashboardLayout title="Barang Masuk dan Keluar" role="">
      <div className="tf-toolbar">
        <TabButton
          type="masuk"
          isActive={activeTab === "masuk"}
          onClick={() => setActiveTab("masuk")}
        >
          Barang Masuk
        </TabButton>
        <TabButton
          type="keluar"
          isActive={activeTab === "keluar"}
          onClick={() => setActiveTab("keluar")}
        >
          Barang Keluar
        </TabButton>
        <div style={{ flex: 1 }} />
        <button
          onClick={() => addTransaction(activeTab)}
          className={activeTab === "masuk" ? "tf-btn-green" : "tf-btn-red"}
          type="button"
        >
          <Plus size={16} />
          Tambah {activeTab === "masuk" ? "Barang Masuk" : "Barang Keluar"}
        </button>
      </div>

      <DataTable
        data={getCurrentData()}
        columns={getCurrentColumns()}
        pageSize={10}
        title={activeTab === "masuk" ? "Data Barang Masuk" : "Data Barang Keluar"}
        emptyMessage={`Tidak ada data barang ${activeTab}.`}
        loading={loading}
        serverPagination={
          activeTab === "masuk" && metaMasuk
            ? {
                page: pageMasuk,
                pageSize: metaMasuk.pageSize,
                totalItems: metaMasuk.totalItems,
                totalPages: metaMasuk.totalPages,
                onPageChange: setPageMasuk,
              }
            : activeTab === "keluar" && metaKeluar
              ? {
                  page: pageKeluar,
                  pageSize: metaKeluar.pageSize,
                  totalItems: metaKeluar.totalItems,
                  totalPages: metaKeluar.totalPages,
                  onPageChange: setPageKeluar,
                }
              : undefined
        }
      />

      {/* Modal Form */}
      {openCreate && (
        <div
          className="fixed inset-0 z-50 flex justify-center items-center"
          style={{
            background: "rgba(0,0,0,0.35)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
          }}
        >
          <div
            className="bg-white rounded-2xl p-6 w-full max-w-md mx-4"
            style={{ boxShadow: "0 32px 80px rgba(0,0,0,.2)", maxHeight: "90vh", overflowY: "auto" }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">
                {formMode === "create" 
                  ? `Tambah Barang ${transactionType === "masuk" ? "Masuk" : "Keluar"}` 
                  : `Edit Barang ${transactionType === "masuk" ? "Masuk" : "Keluar"}`}
              </h2>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                transactionType === "masuk" 
                  ? "bg-green-100 text-green-800" 
                  : "bg-red-100 text-red-800"
              }`}>
                {transactionType === "masuk" ? "Masuk" : "Keluar"}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Pilih Barang */}
              <div>
                <label className="block text-sm font-medium mb-1">Pilih Barang</label>
                {isLoadingBarang ? (
                  <div className="w-full border rounded-lg p-2 bg-gray-100 text-gray-500">
                    Loading barang...
                  </div>
                ) : (
                  <>
                    <select
                      value={formData.id_barang || ""}
                      onChange={(e) => handleChange("id_barang", e.target.value)}
                      className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      disabled={!barang || barang.length === 0}
                    >
                      <option value="">
                        {!barang || barang.length === 0 ? "Tidak ada barang tersedia" : "Pilih Barang"}
                      </option>
                      {barang && barang.length > 0 && barang.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.nama} - Stok: {item.jumlah} {item.satuan}
                        </option>
                      ))}
                    </select>
                    {(!barang || barang.length === 0) && !isLoadingBarang && (
                      <p className="text-yellow-600 text-sm mt-1">
                        Tidak ada data barang. Pastikan data barang sudah ada.
                      </p>
                    )}
                  </>
                )}
                {errors.id_barang && (
                  <p className="text-red-500 text-sm mt-1">{errors.id_barang}</p>
                )}
                
                {/* Stock Information */}
                {formData.id_barang && (
                  <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-blue-800">
                        Stok Tersedia:
                      </span>
                      <span className="text-sm font-bold text-blue-900">
                        {getSelectedItemStock()} {barang.find(b => b.id === parseInt(formData.id_barang))?.satuan}
                      </span>
                    </div>
                    {transactionType === "keluar" && (
                      <div className="mt-1 text-xs text-blue-600">
                        {formMode === "update" && initialData ? 
                          `Dapat dikeluarkan: ${getAvailableStock()} ${barang.find(b => b.id === parseInt(formData.id_barang))?.satuan} (termasuk jumlah sebelumnya: ${initialData.keluar})` :
                          `Maksimal dapat dikeluarkan: ${getAvailableStock()} ${barang.find(b => b.id === parseInt(formData.id_barang))?.satuan}`
                        }
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Tanggal */}
              <div>
                <label className="block text-sm font-medium mb-1">Tanggal</label>
                <input
                  type="date"
                  value={formData.tanggal || ""}
                  onChange={(e) => handleChange("tanggal", e.target.value)}
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.tanggal && (
                  <p className="text-red-500 text-sm mt-1">{errors.tanggal}</p>
                )}
              </div>

              {/* Jumlah Buah */}
              <div>
                <label className="block text-sm font-medium mb-1">Jumlah Buah</label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  max={transactionType === "keluar" ? getAvailableStock() : undefined}
                  value={formData.jumlah || ""}
                  onChange={(e) => handleChange("jumlah", e.target.value)}
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={`Masukkan jumlah buah${transactionType === "keluar" && formData.id_barang ? ` (max: ${getAvailableStock()})` : ""}`}
                />
                {errors.jumlah && (
                  <p className="text-red-500 text-sm mt-1">{errors.jumlah}</p>
                )}
                {transactionType === "keluar" && formData.id_barang && formData.jumlah && (
                  <div className="mt-1">
                    {parseInt(formData.jumlah) > getAvailableStock() ? (
                      <p className="text-red-500 text-xs">
                        ⚠️ Jumlah buah melebihi stok tersedia ({getAvailableStock()})
                      </p>
                    ) : (
                      <p className="text-green-600 text-xs">
                        ✓ Jumlah buah valid
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Keterangan */}
              <div>
                <label className="block text-sm font-medium mb-1">Keterangan</label>
                <textarea
                  value={formData.keterangan || ""}
                  onChange={(e) => handleChange("keterangan", e.target.value)}
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Masukkan keterangan (opsional)"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setOpenCreate(false)}
                  style={{
                    flex: 1, padding: "10px", borderRadius: 10,
                    border: "1.5px solid #E5E7EB", background: "#fff",
                    fontSize: 14, fontWeight: 600, color: "#374151",
                    cursor: "pointer", fontFamily: "inherit",
                  }}>
                  Batal
                </button>
                <button
                  type="submit"
                  className={transactionType === "masuk" ? "tf-btn-green" : "tf-btn-red"}
                  style={{ flex: 1, justifyContent: "center" }}
                >
                  {formMode === "create" ? "Simpan" : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {showConfirm && (
        <ConfirmButton
          message="Yakin hapus data transaksi ini?"
          onConfirm={deleteData}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </DashboardLayout>
  );
}
