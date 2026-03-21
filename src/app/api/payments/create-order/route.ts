import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  try {
    const { userId: senderClerkId } = await auth();
    const body = await req.json();
    const { amount, recipientId, productId, message, supporterName, type } = body;

    if (!amount || !recipientId || !type) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Get sender if logged in
    let senderId = null;
    if (senderClerkId) {
      const sender = await db.user.findUnique({ where: { clerkId: senderClerkId } });
      senderId = sender?.id;
    }

    // Check for Razorpay keys (Mock mode if placeholders)
    const isMock = !process.env.RAZORPAY_KEY_ID || 
                   process.env.RAZORPAY_KEY_ID.includes("placeholder") ||
                   process.env.RAZORPAY_KEY_ID.includes("rzp_test_placeholder");

    if (isMock) {
      const mockOrderId = `order_mock_${Date.now()}`;
      
      // Store mock pending payment in DB
      await db.payment.create({
        data: {
          amount: Math.round(amount),
          type,
          status: "SUCCESS", // Auto-success for mock
          razorpayOrderId: mockOrderId,
          message,
          supporterName,
          recipientId,
          productId,
          senderId,
        },
      });

      return NextResponse.json({
        orderId: mockOrderId,
        amount: Math.round(amount),
        currency: "INR",
        keyId: "rzp_test_mock_key",
        isMock: true,
      });
    }

    // Create Real Razorpay Order
    const options = {
      amount: Math.round(amount),
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    let order;
    try {
      order = await razorpay.orders.create(options);
    } catch (rzpError: any) {
      console.error("Razorpay Order Creation Failed:", rzpError);
      return new NextResponse(`Razorpay Error: ${rzpError.description || rzpError.message || "Failed to create order"}`, { status: 500 });
    }

    // Replace the old storage block with the real pending one
    await db.payment.create({
      data: {
        amount,
        type,
        status: "PENDING",
        razorpayOrderId: order.id,
        message,
        supporterName,
        recipientId,
        productId,
        senderId,
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("[PAYMENTS_CREATE_ORDER]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
