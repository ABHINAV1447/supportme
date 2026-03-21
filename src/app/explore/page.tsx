export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Users, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default async function ExplorePage() {
  const creators = await db.user.findMany({
    take: 12,
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: {
          receivedPayments: { where: { status: "SUCCESS" } }
        }
      }
    }
  });

  const categories = ["Art", "Dev", "Music", "Video", "Podcast", "Writers"];

  return (
    <div className="relative min-h-screen">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/5 blur-[120px] -z-10 rounded-full" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-indigo-500/5 blur-[120px] -z-10 rounded-full" />

      <div className="container mx-auto px-4 py-32 space-y-24">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          <Badge className="bg-primary/10 text-primary border-primary/20 px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest">
            <Sparkles className="w-3 h-3 mr-2 text-primary" /> Curated Creators
          </Badge>
          <h1 className="text-6xl md:text-8xl font-black tracking-tight text-foreground leading-none">
            Discover the <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-violet-600">next wave.</span>
          </h1>
          <p className="text-muted-foreground text-xl md:text-2xl font-medium leading-relaxed max-w-2xl mx-auto">
            Supporting Indian creators is now easier than ever. Browse by category, 
            search for your favorites, and join the revolution.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-4xl mx-auto">
          <div className="relative flex flex-col md:flex-row gap-4 p-3 rounded-[2.5rem] bg-white dark:bg-zinc-950 border-2 border-border shadow-2xl shadow-primary/5 group focus-within:border-primary/50 transition-all duration-500">
            <div className="relative flex-1 flex items-center">
              <Search className="absolute left-6 h-6 w-6 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder="Search creators, categories or products..." 
                className="pl-16 h-16 rounded-full border-0 bg-transparent focus-visible:ring-0 text-xl font-bold placeholder:opacity-50" 
              />
            </div>
            <Button size="lg" className="rounded-full h-16 px-12 bg-primary hover:bg-primary/90 text-white font-black text-xl shadow-xl shadow-primary/20">
              Search
            </Button>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 mt-10">
            {categories.map((cat) => (
              <button 
                key={cat} 
                className="px-8 py-3 rounded-full bg-secondary text-sm font-black uppercase tracking-widest border border-transparent hover:border-primary/30 hover:bg-background hover:scale-105 transition-all text-muted-foreground hover:text-primary"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Creator Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12 pt-10">
          {creators.map((creator) => (
            <Link key={creator.id} href={`/@${creator.username}`}>
              <Card className="rounded-[3rem] overflow-hidden border-2 border-border/40 hover:border-primary/30 hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] transition-all duration-500 group h-full bg-background relative">
                <div className="h-40 bg-zinc-100 dark:bg-zinc-900 group-hover:bg-primary/5 transition-colors relative">
                   <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="h-6 w-6 text-primary" />
                   </div>
                </div>
                <CardContent className="px-10 pb-12 -mt-12 flex flex-col items-center text-center space-y-6">
                  <div className="relative group/avatar">
                    <img 
                      src={creator.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${creator.username}`} 
                      className="w-32 h-32 rounded-[2.5rem] border-8 border-background bg-zinc-200 shadow-2xl transform group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-3xl font-black tracking-tighter line-clamp-1">{creator.name || creator.username}</h3>
                    <p className="text-sm text-primary font-black uppercase tracking-[0.2em]">@{creator.username}</p>
                  </div>
                  <p className="text-muted-foreground text-lg line-clamp-2 leading-relaxed font-medium opacity-80">
                    {creator.bio || "Building the next big thing on SupportMe."}
                  </p>
                  
                  <div className="pt-8 flex justify-center w-full border-t border-dashed border-border/80">
                    <div className="flex items-center gap-3 font-black text-muted-foreground group-hover:text-primary transition-colors">
                      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                        <Users className="h-5 w-5" />
                      </div>
                      <span className="text-sm uppercase tracking-widest">{creator._count.receivedPayments} Supporters</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {creators.length === 0 && (
          <div className="text-center py-40 border-4 border-dashed rounded-[4rem] space-y-6 bg-secondary/30">
             <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                <Users className="h-10 w-10" />
             </div>
             <h3 className="text-3xl font-black">No creators found yet.</h3>
             <p className="text-muted-foreground font-medium">Be the first to join the community!</p>
             <Link href="/sign-up">
                <Button className="rounded-full h-14 px-10 font-black">Get Started</Button>
             </Link>
          </div>
        )}
      </div>
    </div>
  );
}

