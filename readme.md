# 📦 Proyek Pengabdian SMKN 2 Batusangkar

Manajemen produk dan transaksi untuk program TEFA (Teaching Factory) SMAN 2 Batusangkar.Dibangun dengan **Next.js** untuk frontend dan **Express.js** untuk backend. Sistem ini dirancang untuk mendukung kegiatan produksi dan transaksi di lingkungan sekolah.

## 🛠️ Tech Stack

* **Frontend:** Next.js
* **Backend:** Express.js
* **Database:** Prisma ORM + PostgreSQL

## 📑 Fitur Aplikasi

* **Landing Page & Katalog produk**
* **Dashboard Kepala Sekolah**
* **Dashboard Admin:**
* **Manajemen Produk**
* **Siswa (Kasir)**

## 🗃️ Struktur Tabel Database

* User
* Jenis
* Komoditas
* AsalProduksi
* Produksi
* Penjualan
* Barang
* TransaksiBarang

---

## 📥 Clone & Menjalankan Project

### 📦 Clone Repository

```bash
git clone https://github.com/Zephhyyrr/pengabdian-smk-2-batusangkar.git
cd pengabdian-smk-2-batusangkar
```

### 📌 Setup Backend

```bash
cd backend
npm install
cp .env.example .env
npx prisma migrate dev
npm run dev
```

### 📌 Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend dapat diakses di: `http://localhost:3000`
Backend dapat diakses di: `http://localhost:5000` (atau sesuai port di .env)

---

## 📄 Lisensi

Project ini dibuat untuk kebutuhan **Pengabdian Masyarakat** oleh **Politeknik Negeri Padang** di **SMKN 2 Batusangkar**.

Dikerjakan oleh 5 mahasiswa:

* Firman Ardiansyah (Backend)
* Redho Septayudien (Frontend)
* Bagahztra van Ril (Frontend)
* Pito Desri Pauzi (Backend)
* Azmi Ali (Frontend)

dengan bimbingan dosen:

* Defni, S.Si., M.Kom
* Ainil Mardiah, S.Kom., M.Cs


---
