import { Hono } from "hono";
import { and, desc, eq, sql } from "drizzle-orm";
import { getDb } from "../db";
import { bahanBakuTable } from "../db/schema";
import { Validator } from "../utils/validation";
import { handleAnyError } from "../errors/app_error";
import { convertTimestamps } from "../utils/date";
import { buildPaginationMeta, parsePagination } from "../utils/pagination";
import type { Env, Variables } from "../types";

export const bahanBakuApp = new Hono<{ Bindings: Env; Variables: Variables }>();

bahanBakuApp.get("/", async (c) => {
  try {
    const db = getDb(c.env);
    const { page, pageSize, offset } = parsePagination(c.req.query());

    const totalRow = await db
      .select({ count: sql<number>`count(*)` })
      .from(bahanBakuTable)
      .where(eq(bahanBakuTable.isDeleted, 0))
      .get();
    const totalItems = Number(totalRow?.count ?? 0);

    const data = await db
      .select()
      .from(bahanBakuTable)
      .where(eq(bahanBakuTable.isDeleted, 0))
      .orderBy(desc(bahanBakuTable.createdAt))
      .limit(pageSize)
      .offset(offset)
      .all()
      .then((rows) => rows.map(convertTimestamps));

    return c.json({
      success: true,
      message: "Berhasil mengambil semua bahan baku.",
      data,
      meta: buildPaginationMeta(page, pageSize, totalItems),
    });
  } catch (error) {
    return handleAnyError(c, error);
  }
});

bahanBakuApp.post("/", async (c) => {
  try {
    const body = await c.req.json<{ nama?: string; satuan?: string; jumlah?: number }>();
    const v = new Validator();
    v.required(body.nama, "nama", "Nama bahan baku harus diisi.");
    v.required(body.satuan, "satuan", "Satuan harus diisi.");
    if (v.hasErrors()) {
      return c.json(
        { success: false, message: "Validasi gagal", errors: v.getErrors() },
        400,
      );
    }

    const db = getDb(c.env);
    const [newBahanBaku] = await db
      .insert(bahanBakuTable)
      .values({
        nama: body.nama!,
        satuan: body.satuan!,
        jumlah: body.jumlah ?? 0,
      })
      .returning();

    return c.json(
      {
        success: true,
        message: `Berhasil menambahkan bahan baku: ${body.nama}`,
        data: convertTimestamps(newBahanBaku),
      },
      201,
    );
  } catch (error) {
    return handleAnyError(c, error);
  }
});

bahanBakuApp.put("/:id", async (c) => {
  try {
    const id = Number(c.req.param("id"));
    const body = await c.req.json<{ nama?: string; satuan?: string; jumlah?: number }>();
    const v = new Validator();
    v.required(body.nama, "nama", "Nama bahan baku harus diisi.");
    v.required(body.satuan, "satuan", "Satuan harus diisi.");
    if (v.hasErrors()) {
      return c.json(
        { success: false, message: "Validasi gagal", errors: v.getErrors() },
        400,
      );
    }

    const db = getDb(c.env);
    const [updated] = await db
      .update(bahanBakuTable)
      .set({
        nama: body.nama!,
        satuan: body.satuan!,
        jumlah: body.jumlah ?? 0,
        updatedAt: Math.floor(Date.now() / 1000),
      })
      .where(and(eq(bahanBakuTable.id, id), eq(bahanBakuTable.isDeleted, 0)))
      .returning();

    if (!updated) {
      return c.json(
        { success: false, message: `Bahan baku dengan id ${id} tidak ditemukan.` },
        404,
      );
    }

    return c.json({
      success: true,
      message: `Berhasil memperbarui bahan baku: ${updated.nama}`,
      data: convertTimestamps(updated),
    });
  } catch (error) {
    return handleAnyError(c, error);
  }
});

bahanBakuApp.delete("/:id", async (c) => {
  try {
    const id = Number(c.req.param("id"));
    const db = getDb(c.env);
    const [deleted] = await db
      .update(bahanBakuTable)
      .set({ isDeleted: 1, updatedAt: Math.floor(Date.now() / 1000) })
      .where(and(eq(bahanBakuTable.id, id), eq(bahanBakuTable.isDeleted, 0)))
      .returning();

    if (!deleted) {
      return c.json(
        { success: false, message: `Bahan baku dengan id ${id} tidak ditemukan.` },
        404,
      );
    }

    return c.json({
      success: true,
      message: `Berhasil menghapus bahan baku: ${deleted.nama}`,
    });
  } catch (error) {
    return handleAnyError(c, error);
  }
});
