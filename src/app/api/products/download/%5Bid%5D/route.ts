import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: productId } = await params;
    const { searchParams: urlSearchParams } = new URL(req.url); // Renamed to avoid conflict
    const orderId = urlSearchParams.get("orderId");

    if (!orderId) {
      return new NextResponse("Unauthorized: Missing order ID", { status: 401 });
    }

    // Verify payment from DB
    const payment = await db.payment.findUnique({
      where: { razorpayOrderId: orderId },
      include: {
        product: true,
      },
    });

    if (!payment || payment.status !== "SUCCESS" || payment.productId !== productId) {
      return new NextResponse("Unauthorized: Invalid payment", { status: 401 });
    }

    if (!payment.product || !payment.product.fileUrl) {
      return new NextResponse("File not found", { status: 404 });
    }

    // In a production app, you would:
    // 1. Generate a signed URL for S3/Cloudinary
    // 2. Redirect to that URL
    // For now, we'll just redirect to the fileUrl stored in DB
    
    return NextResponse.redirect(payment.product.fileUrl);
  } catch (error) {
    console.error("[PRODUCT_DOWNLOAD]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
