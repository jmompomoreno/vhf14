import { destroySession, readSessionToken, safeReturnPath, sessionCookie } from "../../../chatgpt-auth";

async function handle(request: Request) {
  const token = readSessionToken(request.headers.get("cookie"));
  if (token) await destroySession(token);
  const url = new URL(request.url);
  return new Response(null, { status: 303, headers: { location: safeReturnPath(url.searchParams.get("return_to") ?? "/"), "set-cookie": sessionCookie("", 0), "cache-control": "no-store" } });
}
export const GET = handle;
export const POST = handle;
