-- Seed Jenis
-- Clear dependent tables in FK-safe order
DELETE FROM PenjualanItem;
DELETE FROM Penjualan;
DELETE FROM Produksi;
DELETE FROM Komoditas;
DELETE FROM Jenis;

INSERT INTO Jenis (id, name) VALUES (1, 'Melon');
