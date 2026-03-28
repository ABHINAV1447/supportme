import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    // Ensure Cloudinary is configured at runtime
    cloudinary.config({
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    if (!process.env.CLOUDINARY_API_SECRET) {
      console.error("CRITICAL: CLOUDINARY_API_SECRET is missing from environment variables.");
      return NextResponse.json({ error: "Missing Cloudinary secret on server" }, { status: 500 });
    }


    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return new NextResponse("No file uploaded", { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary using a stream
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "supportme",
          resource_type: "auto", // Automatically detect if it's an image or a raw file
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    }) as any;

    return NextResponse.json({ url: result.secure_url });
  } catch (error: any) {
    console.error("[UPLOAD_API_ERROR]", error);
    return NextResponse.json(
      { error: error?.message || "Unknown upload error" },
      { status: 500 }
    );
  }
}
