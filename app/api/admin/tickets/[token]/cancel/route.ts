import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin/auth";
import { cancelPayment } from "@/lib/payments";

interface RouteContext {
  params: Promise<{ token: string }>;
}

/** Admin-only: cancel a pending ticket order. Paid orders are rejected —
 *  see lib/payments.ts's cancelPayment for why. Pending cancellation only
 *  touches the payment ledger (never public/cached content), so there's
 *  nothing to revalidate. */
export async function POST(_request: Request, { params }: RouteContext) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { token } = await params;
  const result = await cancelPayment(token);

  if (!result.ok) {
    if (result.reason === "not_found") {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Only pending orders can be cancelled" },
      { status: 409 },
    );
  }

  return NextResponse.json({ payment: result.record });
}
