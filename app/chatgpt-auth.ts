// Autenticación propia (email + contraseña) sobre Cloudflare D1.
// Se mantiene el nombre del módulo y de las funciones exportadas para no tocar el resto de la app.
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { env } from "cloudflare:workers";
import { eq } from "drizzle-orm";
import { getDb } from "../db";
import { accounts } from "../db/schema";

export type ChatGPTUser = {
  userId: string;
  displayName: string;
  email: string;
  fullName: string | null;
};

export const SESSION_COOKIE = "vhf14_session";
export const SESSION_DAYS = 30;
const PBKDF2_ITERATIONS = 100000; // máximo permitido en Cloudflare Workers

export function isVHF14Admin(user: Pick<ChatGPTUser, "email">): boolean {
  return adminEmails().includes(user.email.toLowerCase());
}
function adminEmails(): string[] {
  return (process.env.VHF14_ADMIN_EMAILS ?? "").toLowerCase().split(",").map((v) => v.trim()).filter(Boolean);
}
export function isAdminEmail(email: string) { return adminEmails().includes(email.toLowerCase()); }

const enc = new TextEncoder();
const b64 = (buf: ArrayBuffer | Uint8Array) => {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  let s = ""; for (const b of bytes) s += String.fromCharCode(b); return btoa(s);
};
const unb64 = (s: string) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

export async function hashPassword(password: string, saltB64?: string) {
  const salt = saltB64 ? unb64(saltB64) : crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations: PBKDF2_ITERATIONS }, key, 256);
  return { hash: b64(bits), salt: b64(salt) };
}
export function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let d = 0; for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
}
async function sha256Hex(value: string) {
  const d = await crypto.subtle.digest("SHA-256", enc.encode(value));
  return [...new Uint8Array(d)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
function newToken() { return b64(crypto.getRandomValues(new Uint8Array(32))).replace(/[+/=]/g, (c) => ({ "+": "-", "/": "_", "=": "" }[c] as string)); }

export async function createSession(userId: string): Promise<string> {
  const token = newToken();
  const expires = new Date(Date.now() + SESSION_DAYS * 86400000).toISOString();
  await env.DB!.prepare("INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)").bind(await sha256Hex(token), userId, expires).run();
  return token;
}
export async function destroySession(token: string) {
  await env.DB!.prepare("DELETE FROM sessions WHERE token_hash = ?").bind(await sha256Hex(token)).run();
}
export function readSessionToken(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;
  for (const part of cookieHeader.split(";")) {
    const [k, ...rest] = part.trim().split("=");
    if (k === SESSION_COOKIE) return rest.join("=") || null;
  }
  return null;
}
export function sessionCookie(token: string, maxAgeSeconds = SESSION_DAYS * 86400) {
  return `${SESSION_COOKIE}=${token}; Path=/; Max-Age=${maxAgeSeconds}; HttpOnly; Secure; SameSite=Lax`;
}
export function sameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try { return new URL(origin).host === new URL(request.url).host; } catch { return false; }
}

export async function getChatGPTUser(): Promise<ChatGPTUser | null> {
  const requestHeaders = await headers();
  const token = readSessionToken(requestHeaders.get("cookie"));
  if (!token) return null;
  const row = await env.DB!.prepare(
    "SELECT s.user_id AS userId, s.expires_at AS expiresAt, c.email AS email, c.full_name AS fullName FROM sessions s JOIN credentials c ON c.user_id = s.user_id WHERE s.token_hash = ?",
  ).bind(await sha256Hex(token)).first<{ userId: string; expiresAt: string; email: string; fullName: string | null }>();
  if (!row || row.expiresAt < new Date().toISOString()) return null;
  const user: ChatGPTUser = { userId: row.userId, email: row.email, fullName: row.fullName, displayName: row.fullName || row.email };
  if (!isVHF14Admin(user)) {
    const [account] = await getDb().select({ status: accounts.status }).from(accounts).where(eq(accounts.userId, user.userId)).limit(1);
    if (account?.status === "suspended") return null;
  }
  return user;
}

export async function requireChatGPTUser(returnTo: string): Promise<ChatGPTUser> {
  const user = await getChatGPTUser();
  if (user) return user;
  redirect(vhf14SignInPath(returnTo));
}
export async function requireVHF14Admin(returnTo: string): Promise<ChatGPTUser> {
  const user = await requireChatGPTUser(returnTo);
  if (!isVHF14Admin(user)) redirect("/");
  return user;
}

export function vhf14SignInPath(returnTo: string): string {
  return `/signin?return_to=${encodeURIComponent(safeRelativeReturnPath(returnTo))}`;
}
export function chatGPTSignInPath(returnTo: string): string { return vhf14SignInPath(returnTo); }
export function safeReturnPath(value: string): string { return safeRelativeReturnPath(value); }
export function chatGPTSignOutPath(returnTo = "/"): string {
  return `/api/auth/logout?return_to=${encodeURIComponent(safeRelativeReturnPath(returnTo))}`;
}

function safeRelativeReturnPath(value: string): string {
  if (!value.startsWith("/") || value.startsWith("//")) return "/";
  let url: URL;
  try { url = new URL(value, "https://app.local"); } catch { return "/"; }
  if (url.origin !== "https://app.local") return "/";
  if (url.pathname === "/signin" || url.pathname.startsWith("/api/auth/")) return "/";
  return `${url.pathname}${url.search}${url.hash}`;
}
