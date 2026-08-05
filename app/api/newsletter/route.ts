import { NextResponse } from "next/server";
import { after } from "next/server";
import { newsletterSchema } from "@/lib/validation";
import { sendEmail } from "@/lib/email";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = newsletterSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please provide a valid email address" },
      { status: 400 },
    );
  }

  console.log("[newsletter] subscribe", parsed.data.email);

  after(() =>
    sendEmail({
      subject: `New newsletter signup — ${parsed.data.email}`,
      text: `New subscriber via the website newsletter form:\n\n${parsed.data.email}`,
      replyTo: parsed.data.email,
    }),
  );

  return NextResponse.json({ subscribed: true }, { status: 201 });
}
