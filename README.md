# TEFA-26 — Sistem Manajemen Teaching Factory

> Sistem manajemen produksi & transaksi untuk program **Teaching Factory (TEFA)**
> SMKN 2 Batusangkar, dibangun di atas Cloudflare Workers + Next.js 14.

[![Build & Push to GHCR](https://github.com/itsanla/tefa-26/actions/workflows/docker.yml/badge.svg)](https://github.com/itsanla/tefa-26/actions/workflows/docker.yml)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-20_LTS-green.svg)](https://nodejs.org)
[![pnpm](https://img.shields.io/badge/pnpm-10-orange.svg)](https://pnpm.io)

---

## Daftar Isi

- [Fitur](#fitur)
- [Tech Stack](#tech-stack)
- [Mulai Cepat](#mulai-cepat)
- [Development](#development)
- [Docker](#docker)
- [Deployment](#deployment)
- [Struktur Proyek](#struktur-proyek)
- [API](#api)
- [Tim](#tim)

---

## Fitur

| Modul | Deskripsi | Role |
|-------|-----------|------|
| Landing Page | Profil sekolah, katalog produk publik | Publik |
| Kasir / Siswa | Point-of-sale penjualan komoditas | `siswa` |
| Produksi | CRUD batch produksi komoditas | `guru`, `admin` |
| Penjualan | Rekap & ekspor laporan penjualan (PDF/Excel) | `guru`, `admin` |
| Gudang | Manajemen barang & transaksi barang | `guru`, `admin` |
| Dashboard Kepsek | Analitik & laporan ringkasan | `kepsek` |
| Manajemen User | CRUD akun pengguna | `admin` |

---

## Tech Stack

```
Frontend  │ Next.js 14 · React 18 · TypeScript · Tailwind CSS · shadcn/ui
Backend   │ Hono.js 4 · Cloudflare Workers · Drizzle ORM
Database  │ Cloudflare D1 (SQLite)
Storage   │ Cloudinary (foto produk)
Auth      │ JWT HS256 (30 hari)
Infra     │ Cloudflare Pages + Workers · Docker · GitHub Actions
```

---

## Mulai Cepat

### Prasyarat

- Node.js ≥ 20, pnpm ≥ 10
- Akun Cloudflare (D1 + Workers)
- Akun Cloudinary (upload foto)

### Setup & Jalankan

```bash
git clone https://github.com/itsanla/tefa-26.git
cd tefa-26

# Install, copy env, migrasi DB lokal
./command/setup.sh

# Jalankan frontend + backend sekaligus
pnpm dev
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend  | http://localhost:8787 |

---

## Development

### Perintah Utama

```bash
pnpm dev          # Jalankan semua service (paralel)
pnpm dev:f        # Hanya frontend (Next.js)
pnpm dev:b        # Hanya backend  (Wrangler dev)
```

### Konfigurasi Environment

**`apps/web/.env`**
```env
NEXT_PUBLIC_API_URL=http://localhost:8787/api
NEXT_PUBLIC_JWT_SECRET=your-jwt-secret
```

**`apps/api/.env`**
```env
FRONTEND_URL=http://localhost:3000
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
CLOUDFLARE_ACCOUNT_ID=...
CLOUDFLARE_DATABASE_ID=...
CLOUDFLARE_D1_TOKEN=...
```

Lihat panduan lengkap di [docs/development.md](docs/development.md).

---

## Docker

### Jalankan via Docker Compose

```bash
cp .env.example .env   # isi nilai yang diperlukan
docker compose up --build
```

### Build Image Manual

```bash
./command/build.sh                     # build latest
./command/build.sh --tag v1.0.0        # build dengan versi
```

### Push ke Registry

```bash
# Docker Hub
./command/push-dockerhub.sh --tag v1.0.0 --also-latest

# GHCR
GITHUB_TOKEN=ghp_xxxx ./command/push-ghcr.sh --tag v1.0.0
```

| Image | Registry |
|-------|----------|
| `itsanla/tefa-26` | [Docker Hub](https://hub.docker.com/r/itsanla/tefa-26) · `ghcr.io/itsanla/tefa-26` |
| `itsanla/api-tefa-26` | [Docker Hub](https://hub.docker.com/r/itsanla/api-tefa-26) · `ghcr.io/itsanla/api-tefa-26` |

Lihat panduan Docker lengkap di [docs/docker.md](docs/docker.md).

---

## Deployment

### Backend → Cloudflare Workers

```bash
cd apps/api
pnpm wrangler login
pnpm wrangler d1 migrations apply sekolah   # migrasi production
pnpm deploy
```

### Frontend → Cloudflare Pages

Set environment variables di Pages dashboard:
- `NEXT_PUBLIC_API_URL` → URL Worker production
- `NEXT_PUBLIC_JWT_SECRET` → JWT secret

Build command: `cd apps/web && pnpm install && pnpm build`  
Output directory: `apps/web/out`

Panduan lengkap di [docs/deployment.md](docs/deployment.md).

---

## Struktur Proyek

```
tefa-26/
├── apps/
│   ├── api/                    # Cloudflare Worker (Hono.js)
│   │   ├── src/
│   │   │   ├── index.ts        # Entry point & routing
│   │   │   ├── db/schema.ts    # Drizzle ORM schema
│   │   │   ├── routes/         # API route handlers
│   │   │   ├── middlewares/    # JWT auth middleware
│   │   │   └── utils/          # JWT, password, Cloudinary
│   │   ├── drizzle/            # SQL migrations
│   │   ├── wrangler.jsonc      # Cloudflare config
│   │   └── Dockerfile
│   └── web/                    # Next.js 14 App Router
│       ├── src/
│       │   ├── app/            # Pages & layouts
│       │   ├── components/     # UI components
│       │   ├── services/       # Axios API client
│       │   └── types/          # TypeScript interfaces
│       ├── next.config.mjs     # Static export config
│       ├── nginx.conf          # Docker nginx config
│       └── Dockerfile
├── docs/                       # Dokumentasi lengkap
├── command/                    # Shell scripts
│   ├── build.sh
│   ├── push-dockerhub.sh
│   ├── push-ghcr.sh
│   ├── dev.sh
│   └── setup.sh
├── docker-compose.yml
├── .env.example
└── package.json                # pnpm workspace root
```

---

## API

Dokumentasi lengkap endpoint di [docs/api-reference.md](docs/api-reference.md).

**Base URL:** `http://localhost:8787/api`

```
POST /api/auth/login          # Login, dapatkan JWT
GET  /api/komoditas           # List produk (publik)
GET  /api/produksi            # List produksi        [auth]
POST /api/penjualan           # Catat penjualan      [auth]
GET  /api/barang              # List barang          [auth]
GET  /api/users               # List users           [admin]
```

---

## Tim

Proyek pengabdian masyarakat oleh **Politeknik Negeri Padang** di SMKN 2 Batusangkar.

| Nama | Kontribusi |
|------|-----------|
| Firman Ardiansyah | Backend |
| Redho Septayudien | Frontend |
| Bagahztra van Ril | Frontend |
| Pito Desri Pauzi | Backend |
| Azmi Ali | Frontend |

**Dosen Pembimbing:** Defni, S.Si., M.Kom · Ainil Mardiah, S.Kom., M.Cs

---

## Dokumentasi

| Dokumen | Keterangan |
|---------|-----------|
| [docs/architecture.md](docs/architecture.md) | Arsitektur sistem & diagram |
| [docs/development.md](docs/development.md) | Setup lingkungan development |
| [docs/docker.md](docs/docker.md) | Panduan Docker lengkap |
| [docs/deployment.md](docs/deployment.md) | Deploy ke Cloudflare |
| [docs/api-reference.md](docs/api-reference.md) | Referensi REST API |
