import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ProfileSettingsForm } from "@/components/dashboard/profile-settings-form";
import { Badge } from "@/components/ui/badge";
import { UserCog } from "lucide-react";

export default async function ProfileSettingsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const creator = await db.user.findUnique({
    where: { clerkId: userId },
  });

  if (!creator) redirect("/sign-up");

  const socialLinks = (creator.socialLinks as any) || {
        twitter: "",
        instagram: "",
        github: "",
        youtube: "",
      };

  const creatorWithParsedLinks = {
    ...creator,
    socialLinks,
  };

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest w-fit">
            <UserCog className="w-3.5 h-3.5 mr-2" /> Identity & Brand
          </Badge>
          <div className="space-y-1">
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-foreground leading-[1.1]">
              Profile <span className="text-primary italic">Settings</span>
            </h1>
            <p className="text-muted-foreground text-xl font-bold opacity-60">
              Personalize your public presence and manage your brand.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl">
        <ProfileSettingsForm creator={creatorWithParsedLinks} />
      </div>
    </div>
  );
}


