import { env } from "cloudflare:workers";
import { eq } from "drizzle-orm";
import { getDb } from "../../../../db";
import { accounts } from "../../../../db/schema";
import { createSession, hashPassword, isAdminEmail, safeEqual, safeReturnPath, sameOrigin, sessionCookie } from "../../../chatgpt-auth";

const json = (body: unknown, status = 200, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", "cache-control": "no-store", ...headers } });

export async function POST(request: Request) {
  if (!sameOrigin(request)) return json({ error: "Origen no permitido" }, 403);
  let body: { email?: string; password?: string; name?: string; setupCode?: string; returnTo?: string };
  try { body = await request.json(); } catch { return json({ error: "Solicitud no válida" }, 400); }
  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");
  const name = String(body.name ?? "").trim().slice(0, 120) || null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 200) return json({ error: "Email no válido" }, 400);
  if (password.length < 10 || password.length > 200) return json({ error: "La contraseña debe tener al menos 10 caracteres" }, 400);

  const db = getDb();
  const [existingAccount] = await db.select().from(accounts).where(eq(accounts.email, email)).limit(1);
  const existingCred = await env.DB!.prepare("SELECT user_id FROM credentials WHERE email = ?").bind(email).first();
  if (existingCred) return json({ error: "Ya existe una cuenta con ese email. Inicia sesión." }, 409);

  // Cuentas ya existentes (importadas) y administradores: solo se pueden reclamar con el código de configuración.
  if (existingAccount || isAdminEmail(email)) {
    const code = process.env.VHF14_SETUP_CODE ?? "";
    if (!code || !safeEqual(String(body.setupCode ?? ""), code)) {
      return json({ error: "Esta cuenta ya existe. Necesitas el código de configuración para activarla.", needsSetupCode: true }, 403);
    }
  }

  const userId = existingAccount?.userId ?? `u_${crypto.randomUUID().replace(/-/g, "")}`;
  const { hash, salt } = await hashPassword(password);
  await env.DB!.prepare("INSERT INTO credentials (user_id, email, full_name, password_hash, salt) VALUES (?, ?, ?, ?, ?)")
    .bind(userId, email, name ?? existingAccount?.fullName ?? null, hash, salt).run();
  if (!existingAccount) await db.insert(accounts).values({ userId, email, fullName: name });

  const token = await createSession(userId);
  return json({ ok: true, redirect: safeReturnPath(body.returnTo ?? "/account") }, 200, { "set-cookie": sessionCookie(token) });
}
