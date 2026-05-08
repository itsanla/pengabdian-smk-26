-- Add payment status and tracking to Penjualan
ALTER TABLE "Penjualan" ADD COLUMN status TEXT NOT NULL DEFAULT 'lunas';
ALTER TABLE "Penjualan" ADD COLUMN total_terbayar INTEGER NOT NULL DEFAULT 0;

-- Existing records are all considered lunas
UPDATE "Penjualan" SET total_terbayar = total_harga WHERE status = 'lunas';

-- Payment history table
CREATE TABLE "PembayaranPenjualan" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  id_penjualan INTEGER NOT NULL REFERENCES "Penjualan"(id) ON DELETE CASCADE,
  jumlah_bayar INTEGER NOT NULL DEFAULT 0,
  keterangan TEXT NOT NULL DEFAULT '',
  createdAt INTEGER NOT NULL DEFAULT (unixepoch()),
  updatedAt INTEGER NOT NULL DEFAULT (unixepoch())
);
