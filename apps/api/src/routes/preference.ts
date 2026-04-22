import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { getDb } from "../db";
import { usersTable } from "../db/schema";
import { handleAnyError } from "../errors/app_error";
import type { Env, Variables } from "../types";

export const preferenceApp = new Hono<{ Bindings: Env; Variables: Variables }>();

preferenceApp.get("/", async (c) => {
  try {
    const user = c.get("user");
    const db = getDb(c.env);
    const row = await db
      .select({ print_preference: usersTable.print_preference })
      .from(usersTable)
      .where(eq(usersTable.id, user.id))
      .get();

    return c.json({
      success: true,
      message: "Berhasil mendapatkan preferensi.",
      data: { print_struk: row ? row.print_preference === 1 : true },
    });
  } catch (error) {
    return handleAnyError(c, error);
  }
});

preferenceApp.put("/", async (c) => {
  try {
    const user = c.get("user");
    const body = await c.req.json<{ print_struk?: boolean }>();
    const db = getDb(c.env);

    await db
      .update(usersTable)
      .set({
        print_preference: body.print_struk ? 1 : 0,
        updatedAt: Math.floor(Date.now() / 1000),
      })
      .where(eq(usersTable.id, user.id));

    return c.json({
      success: true,
      message: "Preferensi berhasil diperbarui.",
      data: { print_struk: body.print_struk ?? true },
    });
  } catch (error) {
    return handleAnyError(c, error);
  }
});
