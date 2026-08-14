import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { isAdminAuthenticated } from "@/lib/admin/auth";
import {
  contentTag,
  isCollectionKey,
  readCollection,
  writeCollection,
} from "@/lib/content-store";
import { getCollectionDef } from "@/lib/admin/schema";

interface RouteContext {
  params: Promise<{ collection: string }>;
}

export async function GET(_request: Request, { params }: RouteContext) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { collection } = await params;
  if (!isCollectionKey(collection)) {
    return NextResponse.json({ error: "Unknown collection" }, { status: 404 });
  }
  const data = await readCollection(collection);
  return NextResponse.json({ data });
}

export async function PUT(request: Request, { params }: RouteContext) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { collection } = await params;
  if (!isCollectionKey(collection)) {
    return NextResponse.json({ error: "Unknown collection" }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const data = body?.data;
  const def = getCollectionDef(collection);

  // Structural guard so a bad save can't take the site down.
  const expectArray = def?.kind === "list" || def?.kind === "menu";
  if (
    data === null ||
    data === undefined ||
    (expectArray && !Array.isArray(data)) ||
    (!expectArray && (typeof data !== "object" || Array.isArray(data)))
  ) {
    return NextResponse.json(
      { error: "Invalid content shape for this collection" },
      { status: 400 },
    );
  }

  try {
    await writeCollection(collection, data);
  } catch (err) {
    console.error("[admin:save]", collection, err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Save failed" },
      { status: 500 },
    );
  }

  revalidateTag(contentTag(collection));
  revalidateTag("content");
  // Content reads are uncached, so regenerating the prerendered pages is
  // what actually surfaces the change.
  revalidatePath("/", "layout");
  console.log("[admin:save]", collection, "published");
  return NextResponse.json({ ok: true });
}
