# TEFA-26 — Dokumentasi

> Sistem Manajemen Produksi & Transaksi — Teaching Factory SMKN 2 Batusangkar

## Daftar Isi

| Dokumen | Deskripsi |
|---------|-----------|
| [architecture.md](architecture.md) | Arsitektur sistem, diagram alur data, dan keputusan desain |
| [development.md](development.md) | Panduan setup lingkungan pengembangan lokal |
| [docker.md](docker.md) | Menjalankan seluruh stack dengan Docker |
| [deployment.md](deployment.md) | Deploy ke Cloudflare Workers + Pages (production) |
| [api-reference.md](api-reference.md) | Referensi endpoint REST API |

## Ringkasan Cepat

```
Repo        : https://github.com/itsanla/tefa-26
Frontend    : Next.js 14 → Cloudflare Pages  (itsanla/tefa-26)
Backend     : Hono.js   → Cloudflare Workers (itsanla/api-tefa-26)
Database    : Cloudflare D1 (SQLite)
Image store : Cloudinary
```

## Peran Pengguna

| Role | Akses |
|------|-------|
| `admin` | Semua fitur |
| `guru` | Komoditas, produksi, penjualan, barang, transaksi |
| `kepsek` | Dashboard laporan & analitik |
| `siswa` | Kasir / point-of-sale |
