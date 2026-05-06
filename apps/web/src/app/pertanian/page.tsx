"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Loader2, ArrowLeft, Search, X } from "lucide-react";
import PreviewCard from "@/components/shadcn-space/card/card-02";
import Footer from "@/components/landing/Footer";
import { fetchAllPages } from "@/services/api.service";

// Define TypeScript interfaces for data structure
interface KomoditasDetails {
  brix?: string;
  visual?: string[];
  bentuk?: string;
  tekstur?: string[];
  keunggulan?: string[];
}

interface Komoditas {
  id: string;
  nama: string;
  deskripsi: string;
  foto: string;
  features?: string[];
  jumlah: number;
  satuan: string;
  harga_persatuan?: number;
  jenis?: { name: string };
  updated_at: string;
  details?: KomoditasDetails;
  isNew?: boolean;
}

// API response interface
interface KomoditasApiResponse {
  id: number;
  nama: string;
  deskripsi: string;
  foto?: string;
  jumlah: number;
  satuan: string;
  harga_persatuan?: number;
  jenis?: { name: string };
  updatedAt?: string;
}

const KomoditasPage = () => {
  // State for API data
  const [komoditas, setKomoditas] = useState<Komoditas[]>([]);
  const [filteredKomoditas, setFilteredKomoditas] = useState<Komoditas[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // State for modal
  const [selectedKomoditas, setSelectedKomoditas] = useState<Komoditas | null>(
    null
  );

  // Intersection observer for animations
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  // Fetch komoditas data from API
  useEffect(() => {
    const fetchKomoditas = async () => {
      try {
        setIsLoading(true);
        try {
          const response = await fetchAllPages({
            endpoint: "/komoditas",
          });
          console.log("API response for TefaHybrid:", response);

          if (response && Array.isArray(response)) {
            // Process data to match our interface
            const processedData = (response as KomoditasApiResponse[]).map((item) => ({
              id: String(item.id),
              nama: item.nama,
              deskripsi: item.deskripsi,
              foto: item.foto?.startsWith("http")
                ? item.foto
                : `/image/${item.foto}`,
              jumlah: item.jumlah,
              satuan: item.satuan,
              harga_persatuan: item.harga_persatuan || 0,
              jenis: { name: item.jenis?.name || "Produk Pertanian" },
              updated_at: item.updatedAt || new Date().toISOString(),
              features: [
                item.jenis?.name || "Produk Pertanian",
                `Stok: ${item.jumlah} ${item.satuan}`,
              ],
            }));

            console.log("Fetched komoditas data:", processedData);
            setKomoditas(processedData);
            setFilteredKomoditas(processedData);
          }
        } catch (apiError) {
          console.warn("API fetch failed", apiError);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch komoditas"
        );
        console.error("Error in komoditas component:", err);

        // Fallback to empty arrays if everything fails
        setKomoditas([]);
        setFilteredKomoditas([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchKomoditas();
  }, []);

  // Filter komoditas based on search query
  useEffect(() => {
    if (komoditas) {
      let filtered = [...komoditas];

      // Apply search filter
      if (searchQuery.trim() !== "") {
        filtered = filtered.filter(
          (item) =>
            item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.deskripsi?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.jenis?.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      setFilteredKomoditas(filtered);
    }
  }, [searchQuery, komoditas]);

  // Modal functions
  const sendLog = (action: string, extra?: object) => {
    fetch('/api/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, scrollY: window.scrollY, bodyOverflow: document.body.style.overflow, ...extra }),
    });
  };

  const openKomoditasDetail = (item: Komoditas) => {
    sendLog('OPEN', { item: item.nama, scrollBefore: window.scrollY });
    const scrollY = window.scrollY;
    setSelectedKomoditas(item);
    document.documentElement.style.scrollBehavior = 'auto';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    sendLog('OPEN_AFTER', { scrollAfter: window.scrollY, top: document.body.style.top });
  };

  const closeKomoditasDetail = () => {
    sendLog('CLOSE_BEFORE', { scrollBefore: window.scrollY, top: document.body.style.top });
    const scrollY = Math.abs(parseInt(document.body.style.top || '0'));
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    window.scrollTo(0, scrollY);
    document.documentElement.style.scrollBehavior = '';
    setSelectedKomoditas(null);
    setTimeout(() => sendLog('CLOSE_AFTER', { scrollAfter: window.scrollY }), 100);
  };

  // Clear search function
  const clearSearch = () => {
    setSearchQuery("");
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <>
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Header section */}
      <div className="bg-emerald-800 py-16 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-80 h-80 bg-emerald-700/50 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 right-10 w-60 h-60 bg-emerald-600/40 rounded-full blur-[80px]"></div>

        <div className="container mx-auto relative z-10">
          <div className="flex items-center mb-6">
            <Link
              href="/"
              className="flex items-center text-emerald-100 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span>Kembali ke Beranda</span>
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Produk Pertanian <span className="text-emerald-300">TEFA</span>
            </h1>
            <p className="text-emerald-100 text-lg md:text-xl max-w-3xl mb-10">
              Jelajahi berbagai produk pertanian hasil produksi Teaching Factory SMK
              Negeri 2 Batusangkar dengan kualitas premium dan teknologi modern.
            </p>

            {/* Search bar */}
            <div className="flex justify-start">
              <div className="relative w-full max-w-xl">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-emerald-300" />
                </div>
                <input
                  type="text"
                  placeholder="Cari produk pertanian..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-10 py-4 w-full bg-white/10 border border-emerald-600 rounded-lg text-white placeholder-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-transparent shadow-md"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    aria-label="Clear search"
                  >
                    <X className="h-5 w-5 text-emerald-300 hover:text-white transition-colors" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Catalog grid section */}
      <div className="py-16" ref={ref}>
        <div className="container mx-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 text-emerald-600 animate-spin" />
              <p className="ml-3 text-emerald-800 text-lg">
                Memuat produk pertanian...
              </p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-emerald-800 text-lg">{error}</p>
              <button
                className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-500 transition-colors"
                onClick={() => window.location.reload()}
              >
                Coba lagi
              </button>
            </div>
          ) : filteredKomoditas.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-emerald-800 text-lg">
                Tidak ada produk pertanian yang sesuai dengan pencarian Anda
              </p>
              <button
                className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-500 transition-colors"
                onClick={() => {
                  setSearchQuery("");
                }}
              >
                Reset Pencarian
              </button>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-emerald-800">
                  {filteredKomoditas.length} Produk Pertanian
                  {searchQuery ? ` untuk pencarian "${searchQuery}"` : ""}
                </h2>
              </div>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredKomoditas.map((item, index) => (
                  <motion.div key={index} variants={itemVariants} onClick={() => openKomoditasDetail(item)} className="cursor-pointer [&_.flex:last-child>div]:flex-1">
                    <PreviewCard
                      foto={item.foto}
                      nama={item.nama}
                      jenis={item.jenis?.name || "Produk Pertanian"}
                      deskripsi={item.deskripsi || ""}
                      harga_persatuan={item.harga_persatuan || 0}
                      satuan={item.satuan}
                      jumlah={item.jumlah}
                      updated_at={item.updated_at}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </>
          )}
        </div>
      </div>

      {/* DETAIL MODAL */}
      <AnimatePresence>
        {selectedKomoditas && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={closeKomoditasDetail}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 24 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Hero Image */}
              <div className="relative h-64 sm:h-80 rounded-t-3xl overflow-hidden">
                <Image
                  src={selectedKomoditas.foto || "/image/placeholder.webp"}
                  alt={selectedKomoditas.nama}
                  fill
                  className="object-cover"
                  priority
                  onError={(e) => { (e.target as HTMLImageElement).src = "/image/placeholder.webp"; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                <button
                  onClick={closeKomoditasDetail}
                  className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 backdrop-blur-md p-2 rounded-full transition-all"
                >
                  <X className="h-5 w-5 text-white" />
                </button>

                <div className="absolute bottom-5 left-6 right-6">
                  <span className="bg-emerald-500/90 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full">
                    {selectedKomoditas.jenis?.name || "Produk Pertanian"}
                  </span>
                  <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-white">
                    {selectedKomoditas.nama}
                  </h2>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Stats row */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="bg-emerald-50 rounded-2xl p-4 text-center">
                    <p className="text-xs text-emerald-600 font-medium mb-1">Harga</p>
                    <p className="text-sm font-bold text-emerald-800">
                      {selectedKomoditas.harga_persatuan && selectedKomoditas.harga_persatuan > 0
                        ? `Rp ${selectedKomoditas.harga_persatuan.toLocaleString("id-ID")}`
                        : "—"}
                    </p>
                    <p className="text-xs text-gray-400">per {selectedKomoditas.satuan}</p>
                  </div>
                  <div className="bg-emerald-50 rounded-2xl p-4 text-center">
                    <p className="text-xs text-emerald-600 font-medium mb-1">Stok</p>
                    <p className="text-sm font-bold text-emerald-800">{selectedKomoditas.jumlah}</p>
                    <p className="text-xs text-gray-400">{selectedKomoditas.satuan}</p>
                  </div>
                  <div className="bg-emerald-50 rounded-2xl p-4 text-center">
                    <p className="text-xs text-emerald-600 font-medium mb-1">Diperbarui</p>
                    <p className="text-sm font-bold text-emerald-800">
                      {new Date(selectedKomoditas.updated_at).toLocaleDateString("id-ID", { month: "short", year: "numeric" })}
                    </p>
                  </div>
                </div>

                {/* Deskripsi */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Deskripsi</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {selectedKomoditas.deskripsi || "Informasi detail akan segera hadir."}
                  </p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <p className="text-xs text-gray-400">Bagian dari program TEFA</p>
                    <p className="text-sm font-semibold text-emerald-700">SMKN 2 Batusangkar</p>
                  </div>
                  <button
                    onClick={closeKomoditasDetail}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-xl transition-colors"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
    <Footer />
    </>
  );
};

export default KomoditasPage;
