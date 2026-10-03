import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "../../../db";
import { watchlist } from "../../../db/schema";
import { getChatGPTUser } from "../../chatgpt-auth";

const itemSchema = z.object({ kind: z.enum(["vessel", "port"]), reference: z.string().trim().min(2).max(32), label: z.string().trim().min(2).max(100) });

export async function GET() {
  const user = await getChatGPTUser();
  if (!user) return Response.json({ error: "Authentication required" }, { status: 401 });
  return Response.json({ items: await getDb().select().from(watchlist).where(eq(watchlist.userId, user.userId)) });
}

export async function POST(request: Request) {
  const user = await getChatGPTUser();
  if (!user) return Response.json({ error: "Authentication required" }, { status: 401 });
  const parsed = itemSchema.safeParse(await request.json());
  if (!parsed.success) return Response.json({ error: "Invalid watchlist item" }, { status: 400 });
  const db = getDb();
  try {
    const [item] = await db.insert(watchlist).values({ userId: user.userId, ...parsed.data }).returning();
    return Response.json({ item }, { status: 201 });
  } catch { return Response.json({ error: "This item is already monitored" }, { status: 409 }); }
}

export async function DELETE(request: Request) {
  const user = await getChatGPTUser();
  if (!user) return Response.json({ error: "Authentication required" }, { status: 401 });
  const id = Number(new URL(request.url).searchParams.get("id"));
  if (!Number.isInteger(id) || id < 1) return Response.json({ error: "Invalid item" }, { status: 400 });
  await getDb().delete(watchlist).where(and(eq(watchlist.id, id), eq(watchlist.userId, user.userId)));
  return Response.json({ ok: true });
}
