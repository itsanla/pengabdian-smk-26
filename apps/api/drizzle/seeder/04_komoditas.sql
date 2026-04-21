-- Seed Komoditas (7 Melon varieties)
DELETE FROM Komoditas;

INSERT INTO Komoditas (id, id_jenis, nama, deskripsi, foto, satuan, jumlah) VALUES
  (1, 1, 'Greenigal',
   'Melon Greenigal memiliki Brix 12-15. Secara visual, netnya berwarna putih dengan persentase 90%, tangkai berbentuk huruf T sepanjang 20cm dari ujung ke ujung, buahnya keras merata di seluruh bagian, tidak ada spot gundul, dan tidak ada net berwarna kecoklatan/hitam. Ukurannya berkisar 800gr hingga 2000gr. Bentuknya bulat simetris dengan tekstur sedikit crunchy dan biji yang masih menempel sempurna tidak rontok.',
   'melon_greenigal.jpg', 'Kg', 0),
  (2, 1, 'Dalmatian',
   'Melon Dalmatian memiliki Brix 12-15. Secara visual, permukaannya halus, terkadang memiliki net dan kering/berwarna putih. Tangkainya berbentuk huruf T sepanjang 20cm dari ujung ke ujung. Memiliki bintik hijau merata, tidak ada retakan basah, buahnya keras merata, dan ukurannya berkisar 800gr hingga 2000gr. Bentuknya bulat simetris dengan tekstur padat dan biji yang masih menempel sempurna tidak rontok.',
   'melon_dalmatian.jpg', 'Kg', 0),
  (3, 1, 'Greenie Sweet',
   'Melon Greenie Sweet memiliki Brix 12-15. Secara visual, permukaannya halus/memiliki net tipis dan kering. Tangkainya berbentuk huruf T sepanjang 20cm dari ujung ke ujung. Tidak ada spot hijau, tidak ada retakan basah, buahnya keras merata, dan ukurannya berkisar 800gr hingga 2000gr. Bentuknya bulat simetris dengan tekstur padat dan biji yang masih menempel sempurna tidak rontok.',
   'melon_greeniesweet.jpg', 'Kg', 0),
  (4, 1, 'Aruni',
   'Melon Aruni memiliki Brix 12-15. Secara visual, permukaannya halus/memiliki net tipis dan kering. Tangkainya berbentuk huruf T sepanjang 20cm dari ujung ke ujung. Tidak ada spot hijau, tidak ada retakan basah, buahnya keras merata, dan ukurannya berkisar 800gr hingga 2000gr. Bentuknya oval/bulat dan simetris dengan tekstur padat dan biji yang masih menempel sempurna tidak rontok.',
   'melon_aruni.jpg', 'Kg', 0),
  (5, 1, 'Elysia',
   'Melon Elysia memiliki Brix 13-15. Secara visual, net putihnya merata di atas 70%. Tangkainya berbentuk huruf T dengan panjang total 20cm dari ujung ke ujung. Tidak ada net retak basah (berwarna cokelat/hitam). Buahnya keras merata dan ukurannya berkisar 800gr hingga 2000gr. Bentuknya lonjong simetris dengan tekstur crunchy dan biji yang masih menempel sempurna tidak rontok.',
   'melon_elysia.jpg', 'Kg', 0),
  (6, 1, 'Midori',
   'Melon Midori memiliki Brix 13-15. Secara visual, net putihnya merata di atas 70%. Tangkainya berbentuk huruf T sepanjang 20cm dari ujung ke ujung. Tidak ada net retak basah (berwarna cokelat/hitam). Buahnya keras merata dan ukurannya berkisar 800gr hingga 2000gr. Bentuknya lonjong simetris dengan tekstur crunchy dan biji yang masih menempel sempurna tidak rontok.',
   'melon_midori.jpg', 'Kg', 0),
  (7, 1, 'Sunray',
   'Melon Sunray memiliki Brix 13-15. Secara visual, warnanya hijau gelap dengan semburat kuning. Tangkainya berbentuk huruf T sepanjang 20cm dari ujung ke ujung. Terkadang memiliki net berwarna putih dan tidak ada net retak basah (berwarna cokelat/hitam). Buahnya keras merata dan ukurannya berkisar 800gr hingga 2000gr. Bentuknya lonjong simetris dengan tekstur crunchy dan biji yang masih menempel sempurna tidak rontok.',
   'melon_sunray.jpg', 'Kg', 0);
