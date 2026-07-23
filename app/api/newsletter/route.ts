import { NextResponse } from "next/server";
import { newsletterSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = newsletterSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please provide a valid email address" },
      { status: 400 },
    );
  }

  // TODO(admin-cms): push to email marketing provider (e.g. Resend/Mailchimp).
  console.log("[newsletter] subscribe", parsed.data.email);

  return NextResponse.json({ subscribed: true }, { status: 201 });
}
