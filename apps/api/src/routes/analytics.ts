import { Hono } from "hono";
import type { Env, Variables } from "../types";
import { getDb } from "../db";
import { penjualanTable, komoditasTable, jenisTable, penjualanItemTabel, produksiTable } from "../db/schema";
import { sql, desc, eq, inArray, asc } from "drizzle-orm";
import { convertTimestamps } from "../utils/date";

export const analyticsApp = new Hono<{ Bindings: Env; Variables: Variables }>();

analyticsApp.get("/", async (c) => {
  const db = getDb(c.env);

  try {
    // 1. Overview Statistics
    const [totalPenjualanResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(penjualanTable);
    
    const [totalKomoditasResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(komoditasTable);
    
    const [komoditasAktifResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(komoditasTable)
      .where(sql`${komoditasTable.jumlah} > 0`);

    // 2. Penjualan Terbaru (5 teratas) dengan jumlah produk dan kode produksi
    const penjualanHeaders = await db
      .select({
        id: penjualanTable.id,
        total_harga: penjualanTable.total_harga,
        keterangan: penjualanTable.keterangan,
        createdAt: penjualanTable.createdAt,
      })
      .from(penjualanTable)
      .orderBy(desc(penjualanTable.createdAt))
      .limit(5);

    const headerIds = penjualanHeaders.map((h) => h.id);
    
    let penjualanTerbaru = [];
    if (headerIds.length > 0) {
      const itemRows = await db
        .select({
          id_penjualan: penjualanItemTabel.id_penjualan,
          id_produksi: penjualanItemTabel.id_produksi,
        })
        .from(penjualanItemTabel)
        .where(inArray(penjualanItemTabel.id_penjualan, headerIds))
        .all();

      const produksiIds = Array.from(new Set(itemRows.map((row) => row.id_produksi)));
      const produksiRows = produksiIds.length
        ? await db
            .select({
              id: produksiTable.id,
              kode_produksi: produksiTable.kode_produksi,
            })
            .from(produksiTable)
            .where(inArray(produksiTable.id, produksiIds))
            .all()
        : [];

      const produksiMap = new Map(produksiRows.map((row) => [row.id, row.kode_produksi]));
      const itemsByPenjualan = new Map();
      
      for (const item of itemRows) {
        const current = itemsByPenjualan.get(item.id_penjualan) ?? [];
        current.push(item);
        itemsByPenjualan.set(item.id_penjualan, current);
      }

      penjualanTerbaru = penjualanHeaders.map((header) => {
        const relatedItems = itemsByPenjualan.get(header.id) ?? [];
        const kodeProduksiList = relatedItems
          .map((item: any) => produksiMap.get(item.id_produksi))
          .filter((kode: any): kode is string => Boolean(kode));

        return convertTimestamps({
          ...header,
          jumlah_produk: relatedItems.length,
          kode_produksi_list: kodeProduksiList,
        });
      });
    }

    // 3. Distribusi Jenis Komoditas
    const distribusiJenis = await db
      .select({
        name: jenisTable.name,
        count: sql<number>`count(${komoditasTable.id})`,
      })
      .from(komoditasTable)
      .leftJoin(jenisTable, sql`${komoditasTable.id_jenis} = ${jenisTable.id}`)
      .groupBy(jenisTable.name);

    // 4. Kode Produksi Terlaris (Top 5)
    const allItems = await db
      .select({
        id_produksi: penjualanItemTabel.id_produksi,
      })
      .from(penjualanItemTabel);

    const produksiIdsForTop = Array.from(new Set(allItems.map((item) => item.id_produksi)));
    const allProduksi = produksiIdsForTop.length
      ? await db
          .select({
            id: produksiTable.id,
            kode_produksi: produksiTable.kode_produksi,
          })
          .from(produksiTable)
          .where(inArray(produksiTable.id, produksiIdsForTop))
          .all()
      : [];

    const produksiMapForCount = new Map(allProduksi.map((p) => [p.id, p.kode_produksi]));
    const kodeProduksiCount: Record<string, number> = {};
    
    allItems.forEach((item) => {
      const kode = produksiMapForCount.get(item.id_produksi);
      if (kode) {
        kodeProduksiCount[kode] = (kodeProduksiCount[kode] || 0) + 1;
      }
    });

    const kodeProduksiTerlaris = Object.entries(kodeProduksiCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, transaksi]) => ({ name, transaksi }));

    // 5. Trend Penjualan (7 hari, mingguan, bulanan)
    const allPenjualanForTrend = await db
      .select({
        createdAt: penjualanTable.createdAt,
        total_harga: penjualanTable.total_harga,
      })
      .from(penjualanTable);

    // Helper function untuk trend 7 hari
    const get7DaysTrend = () => {
      const dataMap: Record<string, { transaksi: number; revenue: number }> = {};
      const today = new Date();

      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateString = date.toISOString().split("T")[0];
        dataMap[dateString] = { transaksi: 0, revenue: 0 };
      }

      allPenjualanForTrend.forEach((item) => {
        const date = new Date(item.createdAt * 1000);
        const dateString = date.toISOString().split("T")[0];
        if (dataMap[dateString]) {
          dataMap[dateString].transaksi += 1;
          dataMap[dateString].revenue += item.total_harga;
        }
      });

      return Object.entries(dataMap).map(([date, data]) => ({
        name: date,
        ...data,
      }));
    };

    // Helper function untuk trend mingguan
    const getWeeklyTrend = () => {
      const dataMap: Record<string, { transaksi: number; revenue: number }> = {};

      allPenjualanForTrend.forEach((item) => {
        const date = new Date(item.createdAt * 1000);
        const year = date.getFullYear();
        const week = Math.ceil(
          ((date.getTime() - new Date(year, 0, 1).getTime()) / 86400000 +
            new Date(year, 0, 1).getDay() +
            1) /
            7
        );
        const weekString = `${year}-W${week.toString().padStart(2, "0")}`;

        if (!dataMap[weekString]) {
          dataMap[weekString] = { transaksi: 0, revenue: 0 };
        }
        dataMap[weekString].transaksi += 1;
        dataMap[weekString].revenue += item.total_harga;
      });

      return Object.entries(dataMap)
        .map(([week, data]) => ({
          name: week,
          ...data,
        }))
        .sort((a, b) => a.name.localeCompare(b.name));
    };

    // Helper function untuk trend bulanan
    const getMonthlyTrend = () => {
      const dataMap: Record<string, { transaksi: number; revenue: number }> = {};

      allPenjualanForTrend.forEach((item) => {
        const date = new Date(item.createdAt * 1000);
        const yearMonth = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`;

        if (!dataMap[yearMonth]) {
          dataMap[yearMonth] = { transaksi: 0, revenue: 0 };
        }
        dataMap[yearMonth].transaksi += 1;
        dataMap[yearMonth].revenue += item.total_harga;
      });

      return Object.entries(dataMap)
        .map(([month, data]) => ({
          name: month,
          ...data,
        }))
        .sort((a, b) => a.name.localeCompare(b.name));
    };

    return c.json({
      overview: {
        totalPenjualan: totalPenjualanResult.count,
        totalKomoditas: totalKomoditasResult.count,
        komoditasAktif: komoditasAktifResult.count,
      },
      penjualanTerbaru,
      distribusiJenis: distribusiJenis.map((item) => ({
        name: item.name || "Lainnya",
        value: item.count,
      })),
      kodeProduksiTerlaris,
      trendPenjualan: {
        "7days": get7DaysTrend(),
        weekly: getWeeklyTrend(),
        monthly: getMonthlyTrend(),
      },
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return c.json({ error: "Failed to fetch analytics data" }, 500);
  }
});
