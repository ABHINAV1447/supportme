import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const body = await req.json();
    const { name, bio, upiId, socialLinks, profileImage } = body;

    const updatedUser = await db.user.update({
      where: { clerkId: userId },
      data: {
        name,
        bio,
        upiId,
        profileImage,
        socialLinks: socialLinks || {},
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("[PROFILE_PATCH_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
