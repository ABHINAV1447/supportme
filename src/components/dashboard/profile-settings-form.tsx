"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Save, Globe, MessageSquare, Twitter, Instagram, Github, Camera, CheckCircle2, Sparkles, Youtube, ArrowRight } from "lucide-react";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  bio: z.string().max(300, "Bio must be under 300 characters").optional(),
  upiId: z.string().optional(),
  profileImage: z.string().optional(),
  socialLinks: z.object({
    twitter: z.string().url().optional().or(z.literal("")),
    instagram: z.string().url().optional().or(z.literal("")),
    github: z.string().url().optional().or(z.literal("")),
    youtube: z.string().url().optional().or(z.literal("")),
  }),
});

export function ProfileSettingsForm({ creator }: { creator: any }) {
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: creator.name || "",
      bio: creator.bio || "",
      upiId: creator.upiId || "",
      profileImage: creator.profileImage || "",
      socialLinks: (creator.socialLinks as any) || {
        twitter: "",
        instagram: "",
        github: "",
        youtube: "",
      },
    },
  });

  const onSubmit = async (values: z.infer<typeof profileSchema>) => {
    try {
      setIsSaving(true);
      await axios.patch("/api/creator/profile", values);
      router.refresh();
      alert("✅ Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update profile", error);
      alert("❌ Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
      <Card className="rounded-[2.5rem] border-2 border-border/40 shadow-sm hover:shadow-xl transition-all duration-700 overflow-hidden bg-background">
        <CardHeader className="bg-primary/5 border-b-2 border-dashed border-border/60 p-8 md:p-10">
          <CardTitle className="text-2xl font-black tracking-tighter text-foreground flex items-center gap-4">
            <div className="p-3 bg-primary text-white rounded-xl shadow-xl shadow-primary/20">
               <Sparkles className="h-6 w-6" />
            </div>
            Basic Identity
          </CardTitle>
          <CardDescription className="text-sm font-bold opacity-60 mt-2">How the world sees you on SupportMe.</CardDescription>
        </CardHeader>
        <CardContent className="p-8 md:p-10 space-y-10">
          <div className="flex flex-col md:flex-row gap-8 items-center pb-10 border-b-2 border-dashed border-border/60">
            <div className="relative group cursor-pointer shrink-0" onClick={() => document.getElementById("profile-upload")?.click()}>
              <img 
                src={form.watch("profileImage") || `https://api.dicebear.com/7.x/avataaars/svg?seed=${creator.username}`} 
                className="w-32 h-32 rounded-2xl object-cover bg-zinc-100 border-4 border-background shadow-xl group-hover:opacity-80 transition-all duration-700 scale-100 group-hover:scale-105"
              />
              <input 
                type="file" 
                id="profile-upload" 
                className="hidden" 
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const formData = new FormData();
                    formData.append("file", file);
                    const res = await axios.post("/api/upload", formData);
                    form.setValue("profileImage", res.data.url);
                  }
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                 <Camera className="h-8 w-8 text-white drop-shadow-2xl" />
              </div>
              <Button 
                type="button"
                variant="secondary"
                size="icon"
                className="absolute -bottom-2 -right-2 h-10 w-10 rounded-xl shadow-xl bg-primary text-white hover:bg-primary/90 border-2 border-background"
              >
                <Camera className="h-5 w-5" />
              </Button>
            </div>
            <div className="space-y-3 text-center md:text-left flex-1">
              <h3 className="text-xl font-black tracking-tighter">Avatar & Branding</h3>
              <p className="text-sm text-muted-foreground font-bold opacity-60 leading-relaxed max-w-sm italic">Recommended: Square image. Your avatar is displayed on all receipts.</p>
              <Button type="button" variant="link" className="p-0 h-auto text-primary font-black text-sm hover:no-underline transition-transform hover:translate-x-1" onClick={() => document.getElementById("profile-upload")?.click()}>
                Swap image <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 ml-3">Full Display Name</Label>
              <Input id="name" {...form.register("name")} className="rounded-xl h-12 px-5 text-lg font-black border-2 focus-visible:ring-primary/20 bg-secondary/10 focus:bg-background transition-all outline-none" />
            </div>
            <div className="space-y-4">
              <Label htmlFor="bio" className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 ml-3">Personal Bio</Label>
              <Textarea id="bio" {...form.register("bio")} className="rounded-2xl min-h-[150px] text-base font-bold p-6 border-2 focus-visible:ring-primary/20 bg-secondary/10 focus:bg-background transition-all resize-none outline-none leading-relaxed italic opacity-80" placeholder="Share your story..." />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-[2.5rem] border-2 border-border/40 shadow-sm hover:shadow-xl transition-all duration-700 overflow-hidden bg-background">
        <CardHeader className="bg-primary/5 border-b-2 border-dashed border-border/60 p-8 md:p-10">
          <CardTitle className="text-2xl font-black tracking-tighter text-foreground flex items-center gap-4">
            <div className="p-3 bg-primary text-white rounded-xl shadow-xl shadow-primary/20">
               <Globe className="h-6 w-6" />
            </div>
            Social Footprint
          </CardTitle>
          <CardDescription className="text-sm font-bold opacity-60 mt-2">Connect your fans to your digital worlds.</CardDescription>
        </CardHeader>
        <CardContent className="p-8 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-4 text-foreground">
            <Label className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] opacity-30 ml-3">
              <Twitter className="h-4 w-4 text-sky-500 fill-sky-500" /> Twitter URL
            </Label>
            <Input {...form.register("socialLinks.twitter")} className="rounded-xl h-12 px-5 text-base font-black border-2 bg-secondary/10 focus:bg-background transition-all" placeholder="https://twitter.com/..." />
          </div>
          <div className="space-y-4 text-foreground">
            <Label className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] opacity-30 ml-3">
              <Instagram className="h-4 w-4 text-pink-500" /> Instagram URL
            </Label>
            <Input {...form.register("socialLinks.instagram")} className="rounded-xl h-12 px-5 text-base font-black border-2 bg-secondary/10 focus:bg-background transition-all" placeholder="https://instagram.com/..." />
          </div>
          <div className="space-y-4 text-foreground">
            <Label className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] opacity-30 ml-3">
              <Github className="h-4 w-4" /> GitHub URL
            </Label>
            <Input {...form.register("socialLinks.github")} className="rounded-xl h-12 px-5 text-base font-black border-2 bg-secondary/10 focus:bg-background transition-all" placeholder="https://github.com/..." />
          </div>
          <div className="space-y-4 text-foreground">
            <Label className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] opacity-30 ml-3">
              <Youtube className="h-4 w-4 text-red-600 fill-red-600" /> YouTube URL
            </Label>
            <Input {...form.register("socialLinks.youtube")} className="rounded-xl h-12 px-5 text-base font-black border-2 bg-secondary/10 focus:bg-background transition-all" placeholder="https://youtube.com/..." />
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-[2.5rem] border-2 border-border/40 shadow-sm hover:shadow-xl transition-all duration-700 overflow-hidden bg-background">
        <CardHeader className="bg-primary/5 border-b-2 border-dashed border-border/60 p-8 md:p-10">
          <CardTitle className="text-2xl font-black tracking-tighter text-foreground flex items-center gap-4">
            <div className="p-3 bg-emerald-500 text-white rounded-xl shadow-xl shadow-emerald-500/20">
               <CheckCircle2 className="h-6 w-6" />
            </div>
            Payment Bridge
          </CardTitle>
          <CardDescription className="text-sm font-bold opacity-60 mt-2">Configure your direct UPI destination.</CardDescription>
        </CardHeader>
        <CardContent className="p-8 md:p-10 space-y-8">
          <div className="space-y-4">
            <Label htmlFor="upiId" className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 ml-3">UPI ID Destination</Label>
            <Input id="upiId" {...form.register("upiId")} className="rounded-xl h-12 px-5 text-2xl font-black border-2 focus-visible:ring-primary/20 bg-secondary/10 focus:bg-background transition-all tracking-tighter" placeholder="yourname@okaxis" />
            <div className="flex items-center gap-4 mt-8 p-6 bg-emerald-500/5 rounded-2xl border-2 border-emerald-500/10">
              <div className="bg-emerald-500 text-white p-2 rounded-xl shadow-lg shrink-0">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <p className="text-sm text-emerald-800 dark:text-emerald-400 font-bold leading-relaxed italic opacity-80">
                Your UPI ID is used for direct payments. Ensure it is correct.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end pt-8 pb-10">
        <Button 
          type="submit" 
          disabled={isSaving}
          className="rounded-2xl h-14 px-12 bg-primary hover:bg-primary/90 text-white gap-3 text-lg font-black shadow-xl transition-all hover:scale-[1.03] active:scale-95 group"
        >
          {isSaving ? <Loader2 className="h-6 w-6 animate-spin" /> : <Save className="h-6 w-6 group-hover:rotate-12 transition-transform" />}
          Update Portfolio
        </Button>
      </div>
    </form>
  );
}

