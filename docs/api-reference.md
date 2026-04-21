# API Reference

**Base URL:** `https://<worker>.workers.dev/api`  
**Local:** `http://localhost:8787/api`

Semua endpoint (kecuali `/auth` dan `GET /komoditas`) memerlukan header:
```
Authorization: Bearer <jwt_token>
```

---

## Auth

### POST `/api/auth/login`
Login dan dapatkan JWT token.

**Body:**
```json
{ "email": "admin@smk.sch.id", "password": "secret" }
```

**Response `200`:**
```json
{
  "token": "eyJ...",
  "user": { "id": 1, "nama": "Admin", "email": "...", "role": "admin" }
}
```

---

## Komoditas (Produk)

| Method | Path | Role | Deskripsi |
|--------|------|------|-----------|
| GET | `/api/komoditas` | Public | List semua komoditas |
| GET | `/api/komoditas/:id` | Public | Detail komoditas |
| POST | `/api/komoditas` | admin, guru | Tambah komoditas |
| PUT | `/api/komoditas/:id` | admin, guru | Update komoditas |
| DELETE | `/api/komoditas/:id` | admin | Hapus (soft delete) |

**Body POST/PUT:**
```json
{
  "id_jenis": 1,
  "nama": "Keripik Singkong",
  "deskripsi": "...",
  "foto": "<base64 atau URL>",
  "satuan": "bungkus",
  "jumlah": 100
}
```

---

## Jenis Komoditas

| Method | Path | Role | Deskripsi |
|--------|------|------|-----------|
| GET | `/api/jenis` | auth | List jenis |
| POST | `/api/jenis` | admin, guru | Tambah jenis |
| PUT | `/api/jenis/:id` | admin, guru | Update jenis |
| DELETE | `/api/jenis/:id` | admin | Hapus |

---

## Produksi

| Method | Path | Role | Deskripsi |
|--------|------|------|-----------|
| GET | `/api/produksi` | auth | List produksi |
| GET | `/api/produksi/:id` | auth | Detail produksi |
| POST | `/api/produksi` | admin, guru, siswa | Tambah produksi |
| PUT | `/api/produksi/:id` | admin, guru | Update |
| DELETE | `/api/produksi/:id` | admin | Hapus |

---

## Penjualan

| Method | Path | Role | Deskripsi |
|--------|------|------|-----------|
| GET | `/api/penjualan` | auth | List penjualan |
| POST | `/api/penjualan` | admin, guru, siswa | Catat penjualan |
| PUT | `/api/penjualan/:id` | admin, guru | Update |
| DELETE | `/api/penjualan/:id` | admin | Hapus |

---

## Barang & Transaksi Barang

| Method | Path | Role | Deskripsi |
|--------|------|------|-----------|
| GET | `/api/barang` | auth | List barang |
| POST | `/api/barang` | admin, guru | Tambah barang |
| PUT | `/api/barang/:id` | admin, guru | Update |
| DELETE | `/api/barang/:id` | admin | Hapus |
| GET | `/api/transaksi-barang` | auth | List transaksi |
| POST | `/api/transaksi-barang` | admin, guru | Catat transaksi |

---

## Users (Admin Only)

| Method | Path | Role | Deskripsi |
|--------|------|------|-----------|
| GET | `/api/users` | admin | List users |
| POST | `/api/users` | admin | Buat user |
| PUT | `/api/users/:id` | admin | Update user |
| DELETE | `/api/users/:id` | admin | Hapus user |

---

## Format Response

**Sukses:**
```json
{ "success": true, "data": { ... } }
```

**Error:**
```json
{ "success": false, "message": "Pesan error" }
```

**Status Code:**

| Code | Arti |
|------|------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request / Validation Error |
| 401 | Unauthorized (token tidak valid) |
| 403 | Forbidden (role tidak cukup) |
| 404 | Not Found |
| 500 | Internal Server Error |
