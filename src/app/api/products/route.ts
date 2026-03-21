import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const body = await req.json();
    const { title, description, price, fileUrl, thumbnailUrl } = body;

    const creator = await db.user.findUnique({
      where: { clerkId: userId },
    });

    if (!creator) return new NextResponse("Creator not found", { status: 404 });

    const product = await db.product.create({
      data: {
        title,
        description,
        price,
        fileUrl,
        thumbnailUrl,
        creatorId: creator.id,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("[PRODUCTS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
