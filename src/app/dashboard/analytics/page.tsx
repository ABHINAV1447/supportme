import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  MousePointer2,
  Calendar,
  Layers
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function AnalyticsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const creator = await db.user.findUnique({
    where: { clerkId: userId },
    include: {
      receivedPayments: {
        where: { status: "SUCCESS" },
      },
      _count: {
        select: {
          receivedPayments: { where: { status: "SUCCESS" } },
          products: true,
        }
      }
    }
  });

  if (!creator) redirect("/dashboard");

  const views = 1234; // Simulating data
  const conversionRate = (creator._count.receivedPayments / views * 100).toFixed(1);

  const stats = [
    { label: "Total Views", value: views.toLocaleString(), icon: MousePointer2, color: "text-blue-500", bg: "bg-blue-500/10", trend: "+12.4%" },
    { label: "Conversion Rate", value: `${conversionRate}%`, icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/10", trend: "Optimal" },
    { label: "Supporter Growth", value: "+12.4%", icon: Users, color: "text-orange-500", bg: "bg-orange-500/10", trend: "+5% MoM" },
    { label: "Product Reach", value: "482", icon: Layers, color: "text-rose-500", bg: "bg-rose-500/10", trend: "Steady" },
  ];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-3">
          <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest w-fit">
            <BarChart3 className="w-3.5 h-3.5 mr-2" /> Analytics
          </Badge>
          <div className="space-y-1">
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground leading-[1.1]">
              Performance Hub
            </h1>
            <p className="text-muted-foreground text-lg font-bold opacity-60">
              Insights that drive your growth.
            </p>
          </div>
        </div>
        <Badge variant="outline" className="h-10 px-5 rounded-xl bg-secondary/30 border-2 border-transparent text-muted-foreground font-black uppercase tracking-widest text-[10px] flex items-center gap-3">
          <Calendar className="h-4 w-4" /> Last 30 Days
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-2 border-border/40 shadow-sm hover:shadow-xl transition-all duration-700 rounded-[2.5rem] overflow-hidden group bg-background relative">
            <CardContent className="p-8 relative">
              <div className="flex items-center justify-between mb-8">
                <div className={`${stat.bg} ${stat.color} p-4 rounded-xl group-hover:rotate-12 transition-transform duration-500 shadow-sm`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <Badge variant="secondary" className="rounded-full font-black text-[10px] uppercase tracking-widest px-3 py-1 bg-secondary text-muted-foreground">
                  {stat.trend}
                </Badge>
              </div>
              <div className="space-y-3">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-40">{stat.label}</p>
                <div className="text-4xl font-black tracking-tighter leading-none">{stat.value}</div>
                <div className="h-1 w-full bg-secondary rounded-full overflow-hidden mt-5">
                  <div className={`h-full ${stat.color.replace('text-', 'bg-')} w-2/3 opacity-80`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <Card className="lg:col-span-8 border-2 border-border/40 shadow-lg rounded-[2.5rem] h-[400px] flex flex-col items-center justify-center relative overflow-hidden bg-background group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          <div className="relative space-y-6 text-center px-8">
             <div className="w-20 h-20 bg-primary/5 rounded-[1.5rem] flex items-center justify-center mx-auto border-2 border-dashed border-primary/20 animate-pulse">
                <BarChart3 className="h-8 w-8 text-primary/30" />
             </div>
             <div className="space-y-2">
                <h3 className="text-xl font-black tracking-tighter">Visit Trends</h3>
                <p className="text-sm font-bold text-muted-foreground opacity-40 max-w-sm mx-auto">Real-time engagement heatmaps and traffic source analysis is processing.</p>
             </div>
             <Button variant="outline" className="rounded-full border-2 font-black h-10 px-6 opacity-40 cursor-not-allowed text-xs">Coming Soon</Button>
          </div>
        </Card>

        <Card className="lg:col-span-4 border-2 border-border/40 shadow-lg rounded-[2.5rem] h-[400px] flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950/50 p-10 text-center space-y-8 group relative overflow-hidden">
           <div className="w-16 h-16 bg-background rounded-2xl flex items-center justify-center mx-auto shadow-sm border border-border/60 group-hover:scale-110 transition-transform">
              <Users className="h-8 w-8 text-primary opacity-20" />
           </div>
           <div className="space-y-3">
              <h3 className="text-lg font-black tracking-tighter">Audience Insights</h3>
              <p className="text-sm font-bold text-muted-foreground opacity-60 leading-relaxed italic">Deep dive into where your fans are coming from and what they love most.</p>
           </div>
           <div className="grid grid-cols-2 gap-4 w-full pt-4">
              {[1,2,3,4].map(i => (
                 <div key={i} className="h-2 bg-border/40 rounded-full w-full animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
              ))}
           </div>
        </Card>
      </div>
    </div>
  );
}
