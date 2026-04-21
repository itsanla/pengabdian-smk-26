# Docker Guide

## Gambaran Umum

| Image | Registry | Deskripsi |
|-------|----------|-----------|
| `itsanla/tefa-26` | Docker Hub / GHCR | Frontend (nginx + static export) |
| `itsanla/api-tefa-26` | Docker Hub / GHCR | Backend (Cloudflare Workers via wrangler dev) |

> **Catatan:** Container API menggunakan `wrangler dev --local` sehingga database berjalan sebagai SQLite lokal di dalam container. Untuk production, deploy ke Cloudflare Workers dengan `pnpm deploy` (lihat [deployment.md](deployment.md)).

---

## Menjalankan dengan Docker Compose

```bash
# 1. Salin env
cp .env.example .env
# Edit .env sesuai kebutuhan

# 2. Build & jalankan
docker compose up --build

# 3. Atau jalankan via script
./command/dev.sh docker
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend  | http://localhost:8787 |

### Menghentikan

```bash
docker compose down          # stop
docker compose down -v       # stop + hapus volumes
```

---

## Build Manual

```bash
# Build kedua image sekaligus
./command/build.sh

# Build dengan tag spesifik
./command/build.sh --tag v1.2.0

# Build multi-platform (untuk CI/CD)
./command/build.sh --tag latest --platform linux/amd64,linux/arm64
```

### Build dengan build args

```bash
docker build \
  --build-arg NEXT_PUBLIC_API_URL=https://api.smk2batusangkar.tech/api \
  --build-arg NEXT_PUBLIC_JWT_SECRET=your-secret \
  -t itsanla/tefa-26:latest \
  apps/web
```

---

## Push ke Registry

### Docker Hub

```bash
./command/push-dockerhub.sh
./command/push-dockerhub.sh --tag v1.2.0 --also-latest
```

### GHCR (GitHub Container Registry)

```bash
# Menggunakan GITHUB_TOKEN env var
GITHUB_TOKEN=ghp_xxxx ./command/push-ghcr.sh

# Atau interaktif
./command/push-ghcr.sh --tag v1.2.0 --also-latest
```

---

## Image Detail

### Web (`itsanla/tefa-26`)

- **Base:** `nginx:1.27-alpine`
- **Build:** Multi-stage — Node.js 20 builder → nginx runner
- **Output:** Static files dari `next build` (`output: 'export'`)
- **Port:** 80
- **Health:** `GET /` harus 200

### API (`itsanla/api-tefa-26`)

- **Base:** `node:20-alpine`
- **Runtime:** `wrangler dev --local` (SQLite lokal)
- **Port:** 8787
- **Health:** `GET http://localhost:8787/`

---

## Variabel Build-Time (Web)

| ARG | Default | Keterangan |
|-----|---------|-----------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8787/api` | URL backend API |
| `NEXT_PUBLIC_JWT_SECRET` | `changeme` | Secret JWT (digunakan client-side) |

Variabel ini di-embed saat `next build` — image harus di-rebuild jika URL berubah.

---

## Tips

```bash
# Lihat log real-time
docker compose logs -f api
docker compose logs -f web

# Masuk ke dalam container
docker compose exec api sh
docker compose exec web sh

# Rebuild satu service saja
docker compose up --build api
```
