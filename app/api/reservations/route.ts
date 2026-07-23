import { NextResponse } from "next/server";
import { reservationSchema } from "@/lib/validation";
import { generateReference } from "@/lib/paystack";

/** Admin-ready reservation endpoint.
 *  Swap the console persistence for a database/CMS call when the admin panel lands. */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = reservationSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid reservation" },
      { status: 400 },
    );
  }

  const reference = generateReference("FF-RES");

  // TODO(admin-cms): persist to database + send confirmation email.
  console.log("[reservation]", reference, parsed.data);

  return NextResponse.json(
    { reference, reservation: parsed.data },
    { status: 201 },
  );
}
