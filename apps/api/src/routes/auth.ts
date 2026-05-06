import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { getDb } from "../db";
import { usersTable } from "../db/schema";
import { verifyPassword } from "../utils/password";
import { generateToken } from "../utils/jwt";
import { Validator } from "../utils/validation";
import { handleAnyError } from "../errors/app_error";
import type { Env, Variables } from "../types";

export const authApp = new Hono<{ Bindings: Env; Variables: Variables }>();

authApp.post("/login", async (c) => {
  try {
    const body = await c.req.json<{ username?: string; password?: string }>();
    const username = body.username?.trim();
    const password = body.password;

    const v = new Validator();
    v.required(username, "username");
    v.required(password, "password");
    if (v.hasErrors()) {
      return c.json(
        { success: false, message: "Validasi gagal", errors: v.getErrors() },
        400,
      );
    }

    const db = getDb(c.env);
    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.username, username!))
      .get();

    const passwordOk = user
      ? await verifyPassword(password!, user.password)
      : false;

    if (!user || !passwordOk) {
      return c.json(
        { success: false, message: "Login gagal, cek username dan password." },
        400,
      );
    }

    const token = await generateToken(
      {
        id: user.id,
        nama: user.nama,
        email: user.email,
        username: user.username,
        role: user.role,
      },
      c.env.JWT_SECRET,
    );

    const { password: _password, ...safeUser } = user;

    return c.json({
      success: true,
      message: "Login berhasil",
      data: { token, user: safeUser },
    });
  } catch (error) {
    return handleAnyError(c, error);
  }
});
