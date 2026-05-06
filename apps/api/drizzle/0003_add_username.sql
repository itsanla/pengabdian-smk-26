-- Add username column and make email optional
PRAGMA foreign_keys=off;

CREATE TABLE "User_new" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nama TEXT NOT NULL,
  email TEXT,
  username TEXT NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL,
  print_preference INTEGER NOT NULL DEFAULT 1,
  createdAt INTEGER NOT NULL DEFAULT (unixepoch()),
  updatedAt INTEGER NOT NULL DEFAULT (unixepoch())
);

INSERT INTO "User_new" (id, nama, email, username, password, role, print_preference, createdAt, updatedAt)
SELECT id,
  nama,
  email,
  COALESCE(email, 'user_' || id),
  password,
  role,
  print_preference,
  createdAt,
  updatedAt
FROM "User";

DROP TABLE "User";
ALTER TABLE "User_new" RENAME TO "User";

CREATE UNIQUE INDEX IF NOT EXISTS "User_email_unique" ON "User"(email);
CREATE UNIQUE INDEX IF NOT EXISTS "User_username_unique" ON "User"(username);

PRAGMA foreign_keys=on;
