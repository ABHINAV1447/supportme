import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const user = await db.user.findUnique({
      where: { clerkId: userId },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("[PROFILE_GET_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

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

    // Revalidate paths to clear Next.js caches
    revalidatePath("/");
    revalidatePath("/explore");
    revalidatePath(`/@${updatedUser.username}`);
    revalidatePath("/dashboard/profile");

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("[PROFILE_PATCH_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
