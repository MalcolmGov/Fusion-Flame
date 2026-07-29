import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { put } from "@vercel/blob";
import { isAdminAuthenticated } from "@/lib/admin/auth";

const MAX_BYTES = 8 * 1024 * 1024;

/** Image upload for admin content. Vercel Blob in production; falls back to
 *  public/uploads locally so the panel works before any store is connected. */
export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Only images are allowed" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Image must be under 8MB" }, { status: 400 });
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();
  const filename = `${Date.now().toString(36)}-${safeName}`;

  try {
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(`uploads/${filename}`, file, {
        access: "public",
        addRandomSuffix: false,
      });
      return NextResponse.json({ url: blob.url });
    }

    if (process.env.VERCEL) {
      return NextResponse.json(
        {
          error:
            "No Blob store connected. Add a Blob store to this Vercel project (Storage → Create → Blob) to enable uploads, or paste an image URL instead.",
        },
        { status: 503 },
      );
    }

    const dir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(
      path.join(dir, filename),
      Buffer.from(await file.arrayBuffer()),
    );
    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch (err) {
    console.error("[admin:upload]", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
