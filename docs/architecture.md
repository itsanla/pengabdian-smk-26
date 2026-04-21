# Arsitektur Sistem

## Diagram Tingkat Tinggi

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser / Client                     │
└───────────────────────────┬─────────────────────────────────┘
                            │ HTTPS
                ┌───────────▼───────────┐
                │   Cloudflare CDN /    │
                │   Pages (Next.js      │
                │   static export)      │
                │   smk2batusangkar.tech│
                └───────────┬───────────┘
                            │ REST /api/*
                ┌───────────▼───────────┐
                │  Cloudflare Workers   │
                │  (Hono.js)            │
                │  api.smk2bts.tech     │
                └──────┬────────┬───────┘
                       │        │
          ┌────────────▼──┐  ┌──▼──────────────┐
          │ Cloudflare D1 │  │   Cloudinary     │
          │ (SQLite)      │  │   (image CDN)    │
          └───────────────┘  └─────────────────┘
```

## Stack Teknologi

### Backend — `apps/api`

| Komponen | Teknologi | Versi |
|----------|-----------|-------|
| Runtime | Cloudflare Workers | — |
| Framework | Hono.js | 4.12.x |
| ORM | Drizzle ORM | 0.45.x |
| Database | Cloudflare D1 (SQLite) | — |
| Auth | JWT (HS256, 30 hari) | — |
| Images | Cloudinary | — |
| CLI | Wrangler | 4.83.x |

### Frontend — `apps/web`

| Komponen | Teknologi | Versi |
|----------|-----------|-------|
| Framework | Next.js | 14.2.x |
| UI | React | 18 |
| Bahasa | TypeScript | 5 |
| Styling | Tailwind CSS + shadcn/ui | 3.4.x |
| Tabel | TanStack React Table | 8 |
| Chart | Recharts | 3 |
| HTTP | Axios | 1.9.x |
| Export | jsPDF + XLSX | — |

## Skema Database

```
usersTable
  id · nama · email (unique) · password · role · createdAt · updatedAt

jenisTable (kategori komoditas)
  id · name · isDeleted · createdAt · updatedAt

komoditasTable
  id · id_jenis (FK) · nama · deskripsi · foto · satuan · jumlah · isDeleted

asalProduksiTable
  id · nama · createdAt · updatedAt

produksiTable
  id · id_asal (FK) · id_komoditas (FK) · kode_produksi
  ukuran · kualitas · jumlah · harga_persatuan · createdAt · updatedAt

penjualanTable
  id · id_komodity (FK) · jumlah_terjual · id_produksi (FK)
  total_harga · keterangan · createdAt · updatedAt

barangTable
  id · nama · satuan · createdAt · updatedAt

transaksiBarangTable
  id · id_barang (FK) · tanggal · masuk · keluar · keterangan
```

## Alur Autentikasi

```
POST /api/auth/login
  → validasi email + password (bcrypt)
  → generate JWT (HS256, exp 30d)
  → return { token, user }

Request terproteksi:
  Authorization: Bearer <token>
  → middleware verifikasi JWT
  → role check (admin | guru | kepsek | siswa)
  → lanjut ke handler
```

## Monorepo

```
tefa-26/
├── apps/
│   ├── api/          # Cloudflare Worker
│   └── web/          # Next.js 14 App Router
├── docs/             # Dokumentasi
├── command/          # Shell scripts (build, push, dev)
├── docker-compose.yml
└── package.json      # pnpm workspace root
```
