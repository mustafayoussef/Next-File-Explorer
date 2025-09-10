import { addFile, findFolder } from "@/lib/data";
import { mkdir, writeFile } from "fs/promises";
import { NextResponse } from "next/server";
import { basename, join } from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const providedName = formData.get("name")?.toString();
  const parent = findFolder(params.id);
  if (!parent || !file) {
    return NextResponse.json({ error: "Invalid request: missing parent or file" }, { status: 400 });
  }

  // Decide filename: prefer 'name' field, fallback to uploaded file's original name
  const rawName = providedName && providedName.trim() ? providedName.trim() : file.name;
  const safeName = basename(rawName);
  if (!safeName) {
    return NextResponse.json({ error: "Invalid file name" }, { status: 400 });
  }
  const publicDir = join(process.cwd(), "public");
  const filePath = join(publicDir, safeName);

  try {
    // Ensure public directory exists and create the file (fail if it already exists)
    await mkdir(publicDir, { recursive: true });
    const bytes = await file.arrayBuffer();
    await writeFile(filePath, Buffer.from(bytes), { flag: "wx" });

    const success = addFile(params.id, safeName);

    if (!success) {
      return NextResponse.json({ error: "Parent folder not found" }, { status: 404 });
    }
  } catch (err: any) {
    if (err && typeof err === "object" && "code" in err && (err as any).code === "EEXIST") {
      return NextResponse.json({ error: "File already exists in public folder" }, { status: 409 });
    }
    console.error("Failed to create file in public folder:", err);
    return NextResponse.json({ error: "Failed to create file" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  return NextResponse.json({ success: true });
}
