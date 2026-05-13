import { Hono } from "hono";
import { and, desc, eq, ne, sql } from "drizzle-orm";
import { getDb } from "../db";
import { roleEnum, usersTable } from "../db/schema";
import { hashPassword, verifyPassword } from "../utils/password";
import { Validator } from "../utils/validation";
import { handleAnyError } from "../errors/app_error";
import type { Env, Variables } from "../types";
import { convertTimestamps, convertTimestampsArray } from "../utils/date";
import { buildPaginationMeta, parsePagination } from "../utils/pagination";


export const usersApp = new Hono<{ Bindings: Env; Variables: Variables }>();

usersApp.get("/", async (c) => {
  try {
    const db = getDb(c.env);
    const { page, pageSize, offset } = parsePagination(c.req.query());

    const totalRow = await db
      .select({ count: sql<number>`count(*)` })
      .from(usersTable)
      .get();
    const totalItems = Number(totalRow?.count ?? 0);

    const users = await db
      .select()
      .from(usersTable)
      .orderBy(desc(usersTable.createdAt))
      .limit(pageSize)
      .offset(offset)
      .all();
    return c.json({
      success: true,
      message: "Mendapatkan data user.",
      data: convertTimestampsArray(users),
      meta: buildPaginationMeta(page, pageSize, totalItems),
    });
  } catch (error) {
    return handleAnyError(c, error);
  }
});

usersApp.post("/", async (c) => {
  try {
    const body = await c.req.json<{
      email?: string;
      username?: string;
      nama?: string;
      password?: string;
      role?: string;
    }>();
    const email = body.email?.trim() || undefined;
    const username = body.username?.trim();
    const { nama, password, role } = body;

    const v = new Validator();
    v.required(username, "username");
    v.isEmail(email, "email");
    v.required(nama, "nama");
    v.required(password, "password");
    v.required(role, "role");
    v.isIn(role, roleEnum, "role");

    const db = getDb(c.env);

    if (email) {
      const existing = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, email))
        .get();
      if (existing) {
        v.check(false, "email", "Email sudah tersedia.");
      }
    }

    if (username) {
      const existingUsername = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.username, username))
        .get();
      if (existingUsername) {
        v.check(false, "username", "Username sudah tersedia.");
      }
    }

    if (v.hasErrors()) {
      return c.json(
        { success: false, message: "Validasi gagal", errors: v.getErrors() },
        400,
      );
    }

    const hashed = await hashPassword(password!);
    const [newUser] = await db
      .insert(usersTable)
      .values({
        email,
        username: username!,
        nama: nama!,
        password: hashed,
        role: role as (typeof roleEnum)[number],
      })
      .returning();

    return c.json({
      success: true,
      message: `Berhasil manambahkan user: ${newUser.nama}.`,
      data: convertTimestamps(newUser),
    });
  } catch (error) {
    return handleAnyError(c, error);
  }
});

usersApp.put("/:id", async (c) => {
  try {
    const id = Number(c.req.param("id"));
    const body = await c.req.json<{
      email?: string;
      username?: string;
      nama?: string;
      password?: string;
      role?: string;
    }>();
    const email = body.email?.trim() || undefined;
    const username = body.username?.trim();
    const { nama, password, role } = body;

    const v = new Validator();
    v.required(username, "username");
    v.isEmail(email, "email");
    v.required(nama, "nama");
    v.required(role, "role");
    v.isIn(role, roleEnum, "role");
    if (password !== undefined) v.required(password, "password");

    const db = getDb(c.env);
    if (email) {
      const existing = await db
        .select()
        .from(usersTable)
        .where(and(eq(usersTable.email, email), ne(usersTable.id, id)))
        .get();
      if (existing) v.check(false, "email", "Email sudah tersedia.");
    }

    if (username) {
      const existingUsername = await db
        .select()
        .from(usersTable)
        .where(and(eq(usersTable.username, username), ne(usersTable.id, id)))
        .get();
      if (existingUsername) v.check(false, "username", "Username sudah tersedia.");
    }

    if (v.hasErrors()) {
      return c.json(
        { success: false, message: "Validasi gagal", errors: v.getErrors() },
        400,
      );
    }

    const update: Record<string, unknown> = {
      email,
      username,
      nama,
      role,
      updatedAt: Math.floor(Date.now() / 1000),
    };
    if (password) update.password = await hashPassword(password);

    const [updated] = await db
      .update(usersTable)
      .set(update)
      .where(eq(usersTable.id, id))
      .returning();

    if (!updated) {
      return c.json(
        { success: false, message: `User dengan id: ${id}, tidak tersedia.` },
        400,
      );
    }

    return c.json({
      success: true,
      message: `Berhasil mengupdate user: ${updated.nama}.`,
      data: convertTimestamps(updated),
    });
  } catch (error) {
    return handleAnyError(c, error);
  }
});

usersApp.post("/verify-password", async (c) => {
  try {
    const authUser = c.get("user");
    const body = await c.req.json<{ password?: string }>();

    if (!body.password) {
      return c.json({ success: false, message: "Password harus diisi." }, 400);
    }

    const db = getDb(c.env);
    const dbUser = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, authUser.id))
      .get();

    if (!dbUser) {
      return c.json({ success: false, message: "User tidak ditemukan." }, 404);
    }

    const isValid = await verifyPassword(body.password, dbUser.password);
    if (!isValid) {
      return c.json({ success: false, message: "Password salah." }, 401);
    }

    return c.json({ success: true, message: "Password valid." });
  } catch (error) {
    return handleAnyError(c, error);
  }
});

usersApp.delete("/:id", async (c) => {
  try {
    const id = Number(c.req.param("id"));
    const authUser = c.get("user");

    if (authUser?.id === id) {
      return c.json(
        { success: false, message: "Tidak bisa menghapus akun sendiri." },
        400,
      );
    }

    const db = getDb(c.env);
    const [deleted] = await db
      .delete(usersTable)
      .where(eq(usersTable.id, id))
      .returning();

    if (!deleted) {
      return c.json(
        { success: false, message: `User dengan id: ${id}, tidak tersedia.` },
        400,
      );
    }

    return c.json({
      success: true,
      message: `Berhasil menghapus user: ${deleted.nama}`,
    });
  } catch (error) {
    return handleAnyError(c, error);
  }
});
