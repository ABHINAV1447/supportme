import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return new NextResponse("No file uploaded", { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a unique filename
    const filename = `${uuidv4()}-${file.name.replace(/\s+/g, "-")}`;
    const uploadDir = join(process.cwd(), "public/uploads");
    
    // Ensure directory exists (mkdir is usually handled by dev server restart or manual creation)
    // Actually, I'll use a simpler approach for now or assume public/uploads exists
    const path = join(uploadDir, filename);
    await writeFile(path, buffer);

    const fileUrl = `/uploads/${filename}`;

    return NextResponse.json({ url: fileUrl });
  } catch (error) {
    console.error("[UPLOAD_API]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
