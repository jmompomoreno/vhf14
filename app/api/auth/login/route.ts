import { env } from "cloudflare:workers";
import { createSession, hashPassword, safeEqual, safeReturnPath, sameOrigin, sessionCookie } from "../../../chatgpt-auth";

const json = (body: unknown, status = 200, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", "cache-control": "no-store", ...headers } });

export async function POST(request: Request) {
  if (!sameOrigin(request)) return json({ error: "Origen no permitido" }, 403);
  let body: { email?: string; password?: string; returnTo?: string };
  try { body = await request.json(); } catch { return json({ error: "Solicitud no válida" }, 400); }
  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");
  const row = await env.DB!.prepare("SELECT user_id, password_hash, salt FROM credentials WHERE email = ?").bind(email).first<{ user_id: string; password_hash: string; salt: string }>();
  // Se calcula el hash aunque no exista el usuario para no delatar qué emails existen.
  const { hash } = await hashPassword(password, row?.salt ?? btoa("0000000000000000"));
  if (!row || !safeEqual(hash, row.password_hash)) return json({ error: "Email o contraseña incorrectos" }, 401);
  const token = await createSession(row.user_id);
  return json({ ok: true, redirect: safeReturnPath(body.returnTo ?? "/account") }, 200, { "set-cookie": sessionCookie(token) });
}
