# Panduan Development Lokal

## Prasyarat

| Tools | Versi Minimum |
|-------|---------------|
| Node.js | 20 LTS |
| pnpm | 10+ |
| Wrangler CLI | 4+ |
| Akun Cloudflare | (untuk D1 & Workers) |

Aktifkan pnpm via corepack:
```bash
corepack enable
corepack prepare pnpm@latest --activate
```

## Setup Cepat

```bash
# 1. Clone & setup otomatis
git clone https://github.com/itsanla/tefa-26.git
cd tefa-26
./command/setup.sh
```

Script `setup.sh` akan:
- Install semua dependencies (`pnpm install`)
- Buat file `.env` dari `.env.example`
- Jalankan migrasi database lokal (D1)

## Setup Manual

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Konfigurasi Environment

**Root** (untuk Docker Compose):
```bash
cp .env.example .env
```

**Backend** (`apps/api/.env`):
```env
FRONTEND_URL=http://localhost:3000
CLOUDINARY_CLOUD_NAME=<cloud-name>
CLOUDINARY_API_KEY=<api-key>
CLOUDINARY_API_SECRET=<api-secret>
CLOUDFLARE_ACCOUNT_ID=<account-id>
CLOUDFLARE_DATABASE_ID=<database-id>
CLOUDFLARE_D1_TOKEN=<d1-api-token>
```

**Frontend** (`apps/web/.env`):
```env
NEXT_PUBLIC_API_URL=http://localhost:8787/api
NEXT_PUBLIC_JWT_SECRET=your-jwt-secret
```

### 3. Migrasi Database Lokal

```bash
cd apps/api
pnpm wrangler d1 migrations apply sekolah --local
```

### 4. Menjalankan Dev Server

```bash
# Kedua service sekaligus (paralel)
pnpm dev

# Hanya backend
pnpm dev:b

# Hanya frontend
pnpm dev:f
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend  | http://localhost:8787 |

## Perintah Berguna

```bash
# Generate Cloudflare type bindings
cd apps/api && pnpm cf-typegen

# Deploy backend ke Cloudflare Workers
cd apps/api && pnpm deploy

# Build frontend untuk production
cd apps/web && pnpm build
```

## Struktur Environment Variable

Backend membaca variabel dari dua sumber:
1. **`wrangler.jsonc` → `vars`** — variabel non-sensitif (CLOUDINARY_CLOUD_NAME, FRONTEND_URL)
2. **`.env`** — kredensial sensitif yang *tidak* di-commit (CLOUDFLARE_D1_TOKEN, API secrets)

Frontend hanya menggunakan `NEXT_PUBLIC_*` yang di-embed saat build time.
