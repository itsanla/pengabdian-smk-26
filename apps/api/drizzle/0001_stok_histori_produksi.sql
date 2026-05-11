CREATE TABLE `StokHistoriProduksi` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`id_produksi` integer,
	`kode_produksi` text NOT NULL,
	`jumlah_sebelum` integer DEFAULT 0 NOT NULL,
	`jumlah_sesudah` integer DEFAULT 0 NOT NULL,
	`selisih` integer DEFAULT 0 NOT NULL,
	`tipe` text NOT NULL,
	`keterangan` text DEFAULT '' NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL
);
