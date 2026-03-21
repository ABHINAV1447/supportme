import { db } from "@/lib/db";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { 
  IndianRupee, 
  Users, 
  ShoppingBag, 
  TrendingUp,
  ArrowUpRight,
  Globe,
  Plus,
  Coffee,
  Sparkles,
  Zap,
  ArrowRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  let creator = await db.user.findUnique({
    where: { clerkId: userId },
    include: {
      receivedPayments: {
        where: { status: "SUCCESS" },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
          product: true,
        }
      },
      _count: {
        select: {
          receivedPayments: { where: { status: "SUCCESS" } },
          products: true,
        }
      }
    }
  });

    const user = await currentUser();
    if (!user) redirect("/sign-in");

    const email = user.emailAddresses[0].emailAddress;
    const name = `${user.firstName || ''} ${user.lastName || ''}`.trim();
    const finalUsername = user.username || email.split('@')[0] + Math.floor(Math.random() * 1000);

    if (!creator) {
      creator = await db.user.create({
        data: {
          clerkId: userId,
          name: name || finalUsername,
          profileImage: user.imageUrl,
          email,
          username: finalUsername,
        },
        include: {
          receivedPayments: {
            where: { status: "SUCCESS" },
            orderBy: { createdAt: "desc" },
            take: 5,
            include: { product: true }
          },
          _count: {
            select: {
              receivedPayments: { where: { status: "SUCCESS" } },
              products: true,
            }
          }
        }
      });
    } else if (creator.profileImage !== user.imageUrl) {
      creator = await db.user.update({
        where: { clerkId: userId },
        data: {
          profileImage: user.imageUrl,
        },
        include: {
          receivedPayments: {
            where: { status: "SUCCESS" },
            orderBy: { createdAt: "desc" },
            take: 5,
            include: { product: true }
          },
          _count: {
            select: {
              receivedPayments: { where: { status: "SUCCESS" } },
              products: true,
            }
          }
        }
      });
    }

  if (!creator) redirect("/sign-up");

  const allSuccessfulPayments = await db.payment.findMany({
    where: { recipientId: (creator as any).id, status: "SUCCESS" },
  });
  const totalEarnings = allSuccessfulPayments.reduce((sum, p) => sum + p.amount, 0) / 100;

  const stats = [
    {
      title: "Gross Volume",
      value: `₹${totalEarnings.toLocaleString()}`,
      description: "Lifetime earnings",
      icon: IndianRupee,
      color: "text-primary",
      bg: "bg-primary/10",
      trend: "+12.5%"
    },
    {
      title: "Supporters",
      value: (creator as any)._count.receivedPayments.toString(),
      description: "Total community",
      icon: Users,
      color: "text-indigo-600",
      bg: "bg-indigo-500/10",
      trend: "+24"
    },
    {
      title: "Products",
      value: (creator as any)._count.products.toString(),
      description: "Active in store",
      icon: ShoppingBag,
      color: "text-violet-600",
      bg: "bg-violet-500/10",
      trend: "New"
    },
    {
      title: "Conversion",
      value: "4.8%",
      description: "Avg. engagement",
      icon: Zap,
      color: "text-amber-600",
      bg: "bg-amber-500/10",
      trend: "stable"
    },
  ];

  return (
    <div className="space-y-16">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-3">
          <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest w-fit">
            <Sparkles className="w-3.5 h-3.5 mr-2" /> Overview
          </Badge>
          <div className="space-y-1">
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground leading-[1.1]">
              Hello, <span className="text-primary italic">{creator.name?.split(' ')[0] || creator.username}</span>.
            </h1>
            <p className="text-muted-foreground text-lg font-bold opacity-60">
              Your creator economy is thriving today.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link href={`/@${creator.username}`} target="_blank">
            <Button variant="outline" className="rounded-2xl border-2 font-black px-6 h-12 text-sm hover:bg-zinc-50 transition-all gap-3">
              View Page <ArrowUpRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/dashboard/products">
            <Button className="rounded-2xl bg-primary hover:bg-primary/90 text-white font-black px-6 h-12 text-sm shadow-sm gap-3 transition-all hover:scale-[1.02]">
              <Plus className="h-4 w-4" /> New Product
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-2 border-border/40 shadow-sm hover:shadow-xl transition-all duration-500 rounded-[2.5rem] overflow-hidden group bg-background relative">
            <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 blur-[30px] rounded-full -mr-10 -mt-10 group-hover:bg-primary/10 transition-colors" />
            <CardContent className="p-8 relative">
              <div className="flex items-center justify-between mb-8">
                <div className={`${stat.bg} ${stat.color} p-4 rounded-xl group-hover:rotate-12 transition-transform duration-500 shadow-sm`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <Badge variant="secondary" className="rounded-full font-black text-[10px] uppercase tracking-widest px-3 py-1 bg-secondary text-muted-foreground">
                  {stat.trend}
                </Badge>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-40">{stat.title}</p>
                <div className="text-4xl font-black tracking-tighter leading-none">{stat.value}</div>
                <p className="text-[11px] text-muted-foreground font-bold opacity-60 italic">{stat.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Activity Feed */}
        <div className="lg:col-span-8 space-y-8">
          <div className="flex items-center justify-between px-4">
            <h2 className="text-2xl font-black tracking-tighter flex items-center gap-3">
              Live Activity <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </h2>
            <Link href="/dashboard/payouts" className="text-[10px] font-black text-primary hover:underline hover:translate-x-1 transition-transform uppercase tracking-widest flex items-center gap-2">
              Show all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <Card className="border-2 border-border/40 shadow-sm rounded-[2.5rem] overflow-hidden bg-background">
            <CardContent className="p-6 md:p-10">
              <div className="space-y-6">
                {creator.receivedPayments.map((payment: any) => (
                  <div key={payment.id} className="flex items-center gap-6 p-6 rounded-[2rem] hover:bg-secondary/30 dark:hover:bg-zinc-900 border-2 border-transparent hover:border-border/40 transition-all duration-500 group">
                    <div className="bg-primary/5 p-4 rounded-2xl text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm border border-primary/10">
                      <Coffee className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-black truncate text-xl tracking-tighter">{payment.supporterName || "Anonymous"}</p>
                        <span className="font-black text-primary text-xl tracking-tighter">₹{payment.amount / 100}</span>
                      </div>
                      <p className="text-base text-muted-foreground font-medium truncate italic max-w-[85%] opacity-60">
                        {payment.message ? `"${payment.message}"` : `Supporter left a silent gift.`}
                      </p>
                    </div>
                    <div className="hidden md:flex flex-col items-end shrink-0">
                       <p className="text-[9px] text-muted-foreground font-black uppercase tracking-[0.2em] opacity-30 mb-2">
                         {new Date(payment.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                       </p>
                       <div className="bg-secondary p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
                          <ArrowRight className="h-3.5 w-3.5 text-primary" />
                       </div>
                    </div>
                  </div>
                ))}
                {creator.receivedPayments.length === 0 && (
                  <div className="text-center py-20 bg-secondary/10 rounded-[2.5rem] border-4 border-dashed border-border/40 space-y-6 group">
                    <div className="w-20 h-20 bg-background rounded-[1.5rem] flex items-center justify-center mx-auto shadow-xl border-2 border-primary/5 group-hover:scale-110 transition-transform">
                       <Users className="h-8 w-8 opacity-20 text-primary" />
                    </div>
                    <div className="space-y-2">
                       <p className="text-2xl font-black tracking-tighter text-foreground">Awaiting your first fans.</p>
                       <p className="text-base font-bold text-muted-foreground opacity-40 max-w-sm mx-auto leading-relaxed italic">Your journey as a top creator starts with a single share.</p>
                    </div>
                    <Button variant="outline" className="rounded-full border-2 font-black h-12 px-8">Get Shareable Link</Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Shortcuts/Tools */}
        <div className="lg:col-span-4 space-y-8">
          <h2 className="text-2xl font-black tracking-tighter px-4">Toolkit</h2>
          
          <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-primary relative text-white group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/20 blur-[60px] rounded-full -mr-16 -mt-16 group-hover:scale-125 transition-transform duration-1000" />
            
            <div className="relative p-10 space-y-8">
              <div className="space-y-6">
                <div className="h-12 w-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-3xl border border-white/20">
                  <Globe className="h-6 w-6 text-white" />
                </div>
                <div className="space-y-2">
                  <p className="font-black text-2xl tracking-tighter leading-tight">Your Portfolio HQ</p>
                  <p className="text-white/70 font-bold text-sm leading-relaxed italic">Centralized on one premium page.</p>
                </div>
              </div>

              <div className="p-4 bg-black/30 rounded-2xl backdrop-blur-2xl border border-white/10 group/item cursor-pointer hover:bg-black/40 transition-all overflow-hidden relative">
                 <p className="text-[9px] font-black opacity-40 uppercase tracking-[0.3em] mb-2">Portfolio Link</p>
                 <p className="text-base font-black truncate tracking-tight pr-8 opacity-90">supportme.in/@{creator.username}</p>
                 <div className="absolute right-4 top-1/2 -translate-y-1/2 h-8 w-8 bg-white/10 rounded-lg flex items-center justify-center group-hover/item:bg-white text-white group-hover/item:text-primary transition-all">
                    <ArrowUpRight className="h-4 w-4" />
                 </div>
              </div>

              <div className="space-y-4">
                <Link href="/dashboard/profile" className="block">
                  <Button className="w-full h-14 rounded-2xl bg-white text-primary hover:bg-zinc-100 font-black text-xl shadow-xl transition-all hover:scale-[1.02] active:scale-95">
                    Customize Page
                  </Button>
                </Link>
              </div>
            </div>
          </Card>

          <Card className="border-4 border-dashed border-border/40 shadow-sm rounded-[2.5rem] p-8 bg-muted/30 dark:bg-zinc-950/50 space-y-6 relative overflow-hidden group">
            <div className="flex items-center gap-5">
              <div className="bg-emerald-500/10 p-4 rounded-xl text-emerald-600 border border-emerald-500/10 group-hover:scale-110 transition-transform">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <p className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40">Payout Account</p>
                <div className="flex items-center gap-2">
                   <p className="font-black text-xl">Verified</p>
                   <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                </div>
              </div>
            </div>
            <p className="text-xs font-bold text-muted-foreground opacity-60 leading-relaxed italic">Your earnings are settled instantly to your connected UPI destination.</p>
            
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-emerald-500/5 blur-[30px] rounded-full -mr-12 -mb-12" />
          </Card>
        </div>
      </div>
    </div>
  );
}
