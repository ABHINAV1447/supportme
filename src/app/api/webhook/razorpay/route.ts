import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    if (!signature) {
      return new NextResponse("Missing signature", { status: 400 });
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(body)
      .digest("hex");

    if (signature !== expectedSignature) {
      return new NextResponse("Invalid signature", { status: 400 });
    }

    const event = JSON.parse(body);

    if (event.event === "payment.captured") {
      const { order_id, id: payment_id } = event.payload.payment.entity;

      // Update payment status in DB
      const payment = await db.payment.update({
        where: { razorpayOrderId: order_id },
        data: {
          status: "SUCCESS",
          razorpayPaymentId: payment_id,
        },
        include: {
          recipient: true,
          product: true,
        }
      });

      // If it's a goal-related payment, update goal? (Optional)
      if (payment.recipientId) {
        // Logic for goal progress...
      }
    }

    return new NextResponse("OK", { status: 200 });
  } catch (error) {
    console.error("[RAZORPAY_WEBHOOK]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
