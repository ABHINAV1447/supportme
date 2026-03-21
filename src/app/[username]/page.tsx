export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { CreatorProfile } from "@/components/creator-profile";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username: rawUsername } = await params;
  const username = rawUsername.replace("%40", ""); // Handle @ prefix
  
  const creator = await db.user.findUnique({
    where: { username },
    include: {
      products: true,
    },
  });

  if (!creator) {
    notFound();
  }

  // Parse social links if they exist
  const socialLinks = (creator.socialLinks as any) || {};

  const creatorWithParsedLinks = {
    ...creator,
    socialLinks,
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <CreatorProfile creator={creatorWithParsedLinks} />
    </div>
  );
}
