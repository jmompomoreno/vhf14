import { z } from "zod";
import { getChatGPTUser } from "../../chatgpt-auth";

export async function POST(request: Request) {
  const user = await getChatGPTUser();
  if (!user) return Response.json({ error: "Sign in before choosing a plan" }, { status: 401 });
  const parsed = z.object({ plan: z.enum(["watch", "operations"]), cycle: z.enum(["monthly", "annual"]), acceptedTerms: z.literal(true) }).safeParse(await request.json());
  if (!parsed.success) return Response.json({ error: "Choose a valid plan and accept the terms" }, { status: 400 });
  return Response.json({
    status: "configuration_required",
    message: "Secure checkout is ready to connect. No charge has been made.",
    selected: parsed.data,
    customer: user.email,
  }, { status: 503 });
}

