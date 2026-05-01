"use client";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { useEffect, useState } from "react";
import { DataTable } from "@/components/table/DataTable";
import { apiRequest } from "@/services/api.service";
import { Penjualan } from "@/types";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from "recharts";
import { TrendingUp, Package, ShoppingCart, Activity } from "lucide-react";

// Komponen Card untuk statistik
const StatCard = ({
  title,
  value,
  subtitle,
  color = "blue",
  icon,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  color?: "blue" | "green" | "yellow" | "red";
  icon?: React.ReactNode;
}) => {
  const colorStyles = {
    blue: {
      bg: "from-blue-500 to-blue-600",
      text: "text-blue-600",
      iconBg: "bg-blue-100",
    },
    green: {
      bg: "from-green-500 to-green-600",
      text: "text-green-600",
      iconBg: "bg-green-100",
    },
    yellow: {
      bg: "from-yellow-500 to-yellow-600",
      text: "text-yellow-600",
      iconBg: "bg-yellow-100",
    },
    red: {
      bg: "from-red-500 to-red-600",
      text: "text-red-600",
      iconBg: "bg-red-100",
    },
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className={`absolute inset-0 bg-gradient-to-br ${colorStyles[color].bg} opacity-5`} />
      <div className="relative p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{value}</h3>
            {subtitle && (
              <p className="text-xs text-gray-500">{subtitle}</p>
            )}
          </div>
          {icon && (
            <div className={`${colorStyles[color].iconBg} ${colorStyles[color].text} p-3 rounded-xl`}>
              {icon}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

type AnalyticsData = {
  overview: {
    totalPenjualan: number;
    totalKomoditas: number;
    komoditasAktif: number;
  };
  penjualanTerbaru: Penjualan[];
  distribusiJenis: { name: string; value: number }[];
  kodeProduksiTerlaris: { name: string; transaksi: number }[];
  trendPenjualan: {
    "7days": { name: string; transaksi: number; revenue: number }[];
    weekly: { name: string; transaksi: number; revenue: number }[];
    monthly: { name: string; transaksi: number; revenue: number }[];
  };
};

export default function DashboardKepsek() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [chartPeriod, setChartPeriod] = useState<
    "7days" | "weekly" | "monthly"
  >("7days");

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await apiRequest({ 
        endpoint: "/analytics",
        returnFullResponse: true 
      });
      console.log("Analytics data received:", data);
      setAnalyticsData(data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout title="Dashboard" role="Kepala Sekolah">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!analyticsData) {
    return (
      <DashboardLayout title="Dashboard" role="Kepala Sekolah">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-600">Gagal memuat data analytics</div>
        </div>
      </DashboardLayout>
    );
  }

  const { overview, penjualanTerbaru, distribusiJenis, kodeProduksiTerlaris, trendPenjualan } = analyticsData;

  // Format data untuk chart
  const barData = kodeProduksiTerlaris?.map((item) => ({
    name: item.name.length > 15 ? item.name.substring(0, 15) + "..." : item.name,
    fullName: item.name,
    transaksi: item.transaksi,
  })) || [];

  // Format trend data berdasarkan periode
  const formatTrendData = (data: { name: string; transaksi: number; revenue: number }[]) => {
    if (!data) return [];
    if (chartPeriod === "7days") {
      return data.map((item) => ({
        ...item,
        name: new Date(item.name).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
        }),
      }));
    } else if (chartPeriod === "weekly") {
      return data.map((item) => ({
        ...item,
        name: `Minggu ${item.name.split("W")[1]} ${item.name.split("-")[0]}`,
      }));
    } else {
      return data.map((item) => ({
        ...item,
        name: new Date(item.name).toLocaleDateString("id-ID", {
          year: "numeric",
          month: "short",
        }),
      }));
    }
  };

  const combinedTrendData = formatTrendData(trendPenjualan?.[chartPeriod] || []);

  // Warna untuk grafik
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  const username =
    document.cookie
      .split("; ")
      .find((row) => row.startsWith("username="))
      ?.split("=")[1] ?? "User";

  return (
    <DashboardLayout title="Dashboard Kepsek" role={username}>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-600 via-green-700 to-green-800 shadow-2xl">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0YzMuMzEgMCA2IDIuNjkgNiA2cy0yLjY5IDYtNiA2LTYtMi42OS02LTYgMi42OS02IDYtNnpNNiAzNGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6TTM2IDM0YzMuMzEgMCA2IDIuNjkgNiA2cy0yLjY5IDYtNiA2LTYtMi42OS02LTYgMi42OS02IDYtNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
          <div className="relative p-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Selamat Datang, {username} 👋
                </h1>
                <p className="text-green-100 text-lg">
                  Ringkasan aktivitas program Teaching Factory hari ini
                </p>
              </div>
              <div className="hidden md:block">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                  <Activity className="w-12 h-12 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Total Penjualan"
            value={overview?.totalPenjualan || 0}
            subtitle="Transaksi tercatat"
            color="blue"
            icon={<ShoppingCart className="w-6 h-6" />}
          />
          <StatCard
            title="Total Komoditas"
            value={overview?.totalKomoditas || 0}
            subtitle="Jenis produk"
            color="green"
            icon={<Package className="w-6 h-6" />}
          />
          <StatCard
            title="Komoditas Aktif"
            value={overview?.komoditasAktif || 0}
            subtitle="Tersedia stok"
            color="yellow"
            icon={<TrendingUp className="w-6 h-6" />}
          />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 gap-6">
          {/* Penjualan Terbaru */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <ShoppingCart className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Penjualan Terbaru
                  </h2>
                  <p className="text-sm text-gray-600">5 transaksi terakhir</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <DataTable
                data={penjualanTerbaru || []}
                columns={[
                  {
                    header: "Jumlah Produk",
                    accessorKey: "jumlah_produk",
                    cell: (item: Penjualan) =>
                      `${item.jumlah_produk ?? item.items?.length ?? 0} produk`,
                  },
                  {
                    header: "Kode Produksi",
                    accessorKey: "kode_produksi_list",
                    cell: (item: Penjualan) => {
                      const kodeList = item.kode_produksi_list ?? [];
                      if (kodeList.length === 0) return "-";
                      const visible = kodeList.slice(0, 2).join(", ");
                      const moreCount = Math.max(kodeList.length - 2, 0);
                      return moreCount > 0
                        ? `${visible} (+${moreCount})`
                        : visible;
                    },
                  },
                  {
                    header: "Total Harga",
                    accessorKey: "total_harga",
                    cell: (item: Penjualan) =>
                      `Rp${new Intl.NumberFormat("id-ID").format(item.total_harga)},-`,
                  },
                  {
                    header: "Tanggal",
                    accessorKey: "createdAt",
                    cell: (item: Penjualan) =>
                      new Date(item.createdAt).toLocaleDateString("id-ID"),
                  },
                ]}
                emptyMessage="Belum ada penjualan"
              />
            </div>
          </div>
        </div>

        {/* Grafik Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Distribusi Jenis Komoditas */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Package className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Distribusi Jenis Komoditas
                  </h2>
                  <p className="text-sm text-gray-600">Berdasarkan kategori</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={distribusiJenis || []}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${percent !== undefined ? (percent * 100).toFixed(0) : "0"}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {(distribusiJenis || []).map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Komoditas Terlaris */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Kode Produksi Terlaris
                  </h2>
                  <p className="text-sm text-gray-600">
                    Top 5 berdasarkan transaksi
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name, props) => [
                      `${value} transaksi`,
                      "Jumlah Transaksi",
                    ]}
                    labelFormatter={(label) => {
                      const item = barData.find((d) => d.name === label);
                      return item ? item.fullName : label;
                    }}
                  />
                  <Bar dataKey="transaksi" fill="#0088FE" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Combined Trend Chart */}
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 border-b border-gray-200">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Activity className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">
                      Trend Penjualan & Pendapatan
                    </h2>
                    <p className="text-sm text-gray-600">Analisis performa penjualan</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setChartPeriod("7days")}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      chartPeriod === "7days"
                        ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/50"
                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    7 Hari
                  </button>
                  <button
                    onClick={() => setChartPeriod("weekly")}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      chartPeriod === "weekly"
                        ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/50"
                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    Mingguan
                  </button>
                  <button
                    onClick={() => setChartPeriod("monthly")}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      chartPeriod === "monthly"
                        ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/50"
                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    Bulanan
                  </button>
                </div>
              </div>
            </div>
            <div className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={combinedTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" stroke="#00C49F" />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="#FFBB28"
                    tickFormatter={(value: number) =>
                      `Rp${new Intl.NumberFormat("id-ID").format(value)}`
                    }
                  />
                  <Tooltip
                    formatter={
                      ((value: any, name: any) => {
                        if (name === "transaksi") {
                          return [`${value} transaksi`, "Jumlah Transaksi"];
                        } else if (name === "revenue") {
                          return [
                            `Rp${new Intl.NumberFormat("id-ID").format(Number(value))},-`,
                            "Pendapatan",
                          ];
                        }
                        return [value, name];
                      }) as any
                    }
                  />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="transaksi"
                    stroke="#00C49F"
                    strokeWidth={2}
                    name="Jumlah Transaksi"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="revenue"
                    stroke="#FFBB28"
                    strokeWidth={2}
                    name="Pendapatan"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
