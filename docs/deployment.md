# Panduan Deployment

## Strategi Deployment

| Layer | Platform | Metode |
|-------|----------|--------|
| Frontend | Cloudflare Pages | Static export (`next build`) |
| Backend | Cloudflare Workers | `wrangler deploy` |
| Database | Cloudflare D1 | Managed SQLite |
| Images | Cloudinary | CDN upload |

---

## Backend — Cloudflare Workers

### 1. Autentikasi Wrangler

```bash
cd apps/api
pnpm wrangler login
```

### 2. Buat Database D1 (sekali)

```bash
pnpm wrangler d1 create sekolah
# Salin database_id ke wrangler.jsonc
```

### 3. Jalankan Migrasi

```bash
# Production
pnpm wrangler d1 migrations apply sekolah

# Local
pnpm wrangler d1 migrations apply sekolah --local
```

### 4. Deploy Worker

```bash
pnpm deploy
# atau
pnpm wrangler deploy --minify
```

### 5. Set Secret

```bash
pnpm wrangler secret put JWT_SECRET
pnpm wrangler secret put CLOUDINARY_API_KEY
pnpm wrangler secret put CLOUDINARY_API_SECRET
```

---

## Frontend — Cloudflare Pages

### Via Cloudflare Dashboard

1. Buat Pages project baru
2. Connect repository GitHub
3. Konfigurasi:
   - **Build command:** `cd apps/web && pnpm install && pnpm build`
   - **Build output dir:** `apps/web/out`
4. Set environment variables:
   - `NEXT_PUBLIC_API_URL` → URL Worker production
   - `NEXT_PUBLIC_JWT_SECRET` → JWT secret

### Via Wrangler (opsional)

```bash
cd apps/web
pnpm build
pnpm wrangler pages deploy out --project-name tefa-26
```

---

## CI/CD — GitHub Actions

Build & push otomatis ke GHCR terjadi di setiap push ke branch `main`.  
Lihat [`.github/workflows/docker.yml`](../.github/workflows/docker.yml).

### Secrets yang Diperlukan di GitHub

| Secret | Keterangan |
|--------|-----------|
| `NEXT_PUBLIC_API_URL` | URL backend production |
| `NEXT_PUBLIC_JWT_SECRET` | JWT secret |

> `GITHUB_TOKEN` tersedia otomatis — tidak perlu dikonfigurasi.

---

## Checklist Pre-Deploy

- [ ] `wrangler.jsonc` memiliki `database_id` yang benar
- [ ] Secrets di-set via `wrangler secret put`
- [ ] `FRONTEND_URL` di `vars` sesuai domain production
- [ ] Migrasi D1 sudah dijalankan
- [ ] `NEXT_PUBLIC_API_URL` di Pages env mengarah ke Worker URL
