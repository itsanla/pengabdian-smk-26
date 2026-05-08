-- Seed Users
-- Passwords hashed with PBKDF2-SHA256 (100k iterations, fixed salt)
-- Semua user: password = "password"

DELETE FROM User;

INSERT INTO User (nama, email, username, password, role) VALUES
  ('Admin',         'admin@gmail.com',  'admin',  '0102030405060708090a0b0c0d0e0f10:edcc81643686f4e956b14698b0d2460877a2fdc111c51fc514f7d1af547803d3', 'admin'),
  ('Guru',          'guru@gmail.com',   'guru',   '0102030405060708090a0b0c0d0e0f10:edcc81643686f4e956b14698b0d2460877a2fdc111c51fc514f7d1af547803d3', 'guru'),
  ('Kepala Sekolah','kepsek@gmail.com', 'kepsek', '0102030405060708090a0b0c0d0e0f10:edcc81643686f4e956b14698b0d2460877a2fdc111c51fc514f7d1af547803d3', 'kepsek'),
  ('Ucok',          'ucok@gmail.com',   'ucok',   '0102030405060708090a0b0c0d0e0f10:edcc81643686f4e956b14698b0d2460877a2fdc111c51fc514f7d1af547803d3', 'siswa'),
  ('Siti',          'siti@gmail.com',   'siti',   '0102030405060708090a0b0c0d0e0f10:edcc81643686f4e956b14698b0d2460877a2fdc111c51fc514f7d1af547803d3', 'siswa');
