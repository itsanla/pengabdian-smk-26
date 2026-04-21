-- Seed Users
-- Passwords hashed with PBKDF2-SHA256 (100k iterations, 16B salt)
-- admin/guru/kepsek: Password123
-- siswa: 123123123

DELETE FROM User;

INSERT INTO User (nama, email, password, role) VALUES
  ('Admin',         'admin@gmail.com',  'e310c6ae67d3781fe1143cac66fe583e:8ed39813bb4305f44a4968f92c323cb7ca1c191edf7d246d5369aaa3ef664837', 'admin'),
  ('Guru',          'guru@gmail.com',   'e310c6ae67d3781fe1143cac66fe583e:8ed39813bb4305f44a4968f92c323cb7ca1c191edf7d246d5369aaa3ef664837', 'guru'),
  ('Kepala Sekolah','kepsek@gmail.com', 'e310c6ae67d3781fe1143cac66fe583e:8ed39813bb4305f44a4968f92c323cb7ca1c191edf7d246d5369aaa3ef664837', 'kepsek'),
  ('Ucok',          'ucok@gmail.com',   'aeec0d351fac0140570a7501e205bacc:1c74fd30bfd0259daaed5c3e491b52c7f55108d15c0efaee8205a85c05c8f534', 'siswa'),
  ('Siti',          'siti@gmail.com',   'aeec0d351fac0140570a7501e205bacc:1c74fd30bfd0259daaed5c3e491b52c7f55108d15c0efaee8205a85c05c8f534', 'siswa');
