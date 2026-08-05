import { NextResponse } from "next/server";
import { isPaystackConfigured, verifyTransaction } from "@/lib/paystack";

/** Poll the status of a Capitec Pay charge while the customer approves the
 *  push notification in their Capitec app.
 *  GET /api/payments/capitec/status?reference=FF-CAP-...
 *
 *  Sandbox references (FFC- prefix) embed their issue timestamp and flip to
 *  success after a short "approval" delay — stateless, so it works across
 *  serverless instances without a database. */
const MOCK_APPROVAL_MS = 8_000;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const reference = searchParams.get("reference");
  if (!reference) {
    return NextResponse.json({ error: "Missing reference" }, { status: 400 });
  }

  // Sandbox flow
  if (reference.startsWith("FFC-") || !isPaystackConfigured()) {
    const issuedAt = parseInt(reference.split("-")[1] ?? "", 36);
    const elapsed = Number.isFinite(issuedAt) ? Date.now() - issuedAt : 0;
    const status = elapsed > MOCK_APPROVAL_MS ? "success" : "pending";
    return NextResponse.json({ reference, status, mock: true });
  }

  try {
    const verified = await verifyTransaction(reference);
    const status =
      verified.status === "success"
        ? "success"
        : verified.status === "failed" || verified.status === "abandoned"
          ? "failed"
          : "pending";
    return NextResponse.json({ reference, status, mock: false });
  } catch (err) {
    console.error("[capitec:status]", err);
    // Transient verification errors shouldn't kill the polling loop.
    return NextResponse.json({ reference, status: "pending", mock: false });
  }
}
