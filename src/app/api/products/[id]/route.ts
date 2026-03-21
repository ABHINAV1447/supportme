import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const { id } = await params;
    const body = await req.json();
    const { title, description, price, fileUrl, thumbnailUrl } = body;

    const product = await db.product.findUnique({
      where: { id, creator: { clerkId: userId } },
    });

    if (!product) return new NextResponse("Product not found", { status: 404 });

    const updatedProduct = await db.product.update({
      where: { id },
      data: {
        title,
        description,
        price,
        fileUrl,
        thumbnailUrl,
      },
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("[PRODUCT_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const { id } = await params;

    const product = await db.product.findUnique({
      where: { id, creator: { clerkId: userId } },
    });

    if (!product) return new NextResponse("Product not found", { status: 404 });

    await db.product.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[PRODUCT_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
