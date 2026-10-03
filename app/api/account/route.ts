import { eq } from "drizzle-orm";
import { getDb } from "../../../db";
import { accounts } from "../../../db/schema";
import { getChatGPTUser } from "../../chatgpt-auth";

export async function GET() {
  const user = await getChatGPTUser();
  if (!user) return Response.json({ error: "Authentication required" }, { status: 401 });
  const db = getDb();
  let [account] = await db.select().from(accounts).where(eq(accounts.userId, user.userId)).limit(1);
  if (!account) {
    [account] = await db.insert(accounts).values({ userId: user.userId, email: user.email, fullName: user.fullName }).returning();
  }
  return Response.json({ account });
}

