import { findFolder, FolderNode } from "@/lib/data";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const { name } = await req.json();
    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Folder name is required" }, { status: 400 });
    }

    const parent = findFolder(params.id);
    if (!parent) {
      return NextResponse.json({ error: "Parent folder not found" }, { status: 404 });
    }

    const alreadyExists = parent.children.some(
      (child) => child.type === "folder" && child.name.toLowerCase() === name.trim().toLowerCase()
    );
    if (alreadyExists) {
      return NextResponse.json({ error: "Folder with this name already exists" }, { status: 409 });
    }

    const newFolder = {
      id: `folder-${Date.now()}`,
      name: name.trim(),
      type: "folder" as "folder",
      children: [] as FolderNode[],
    };
    parent.children.push(newFolder);

    return NextResponse.json({ success: true, folder: newFolder });
  } catch (error) {
    console.error("Failed to create folder:", error);
    return NextResponse.json({ error: "Failed to create folder" }, { status: 500 });
  }
}
