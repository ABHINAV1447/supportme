"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  User, 
  BarChart3, 
  Settings, 
  ArrowLeft,
  LogOut,
  Coffee,
  Sparkles,
  Zap,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useClerk } from "@clerk/nextjs";

const menuItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
  { icon: ShoppingBag, label: "Products", href: "/dashboard/products" },
  { icon: BarChart3, label: "Analytics", href: "/dashboard/analytics" },
  { icon: User, label: "Profile", href: "/dashboard/profile" },
  { icon: Settings, label: "Payouts", href: "/dashboard/payouts" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { signOut } = useClerk();

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r-2 border-dashed border-border/60 bg-background h-screen sticky top-0 p-6 space-y-10 shrink-0">
      {/* Brand Section */}
      <div className="px-1">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="bg-primary p-2 rounded-xl shadow-xl shadow-primary/20 group-hover:scale-110 transition-transform duration-500">
            <Coffee className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-lg tracking-tighter text-foreground leading-none">
              SupportMe
            </span>
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary mt-0.5 opacity-60">Creator Hub</span>
          </div>
        </Link>
      </div>

      {/* Navigation section */}
      <div className="space-y-3">
        <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-3 opacity-40">Main Menu</h4>
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between group px-4 py-3 rounded-2xl text-sm font-black transition-all duration-300",
                  isActive 
                    ? "bg-primary text-white shadow-lg scale-[1.02]" 
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={cn("h-4 w-4", isActive ? "text-white" : "text-muted-foreground group-hover:text-primary transition-colors")} />
                  {item.label}
                </div>
                {isActive && <div className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer-like section in sidebar */}
      <div className="mt-auto pt-6 space-y-3">
        <div className="p-4 bg-primary/5 rounded-3xl border-2 border-dashed border-primary/20 space-y-3">
          <div className="flex items-center gap-2">
             <div className="p-1.5 bg-primary rounded-lg text-white">
                <Zap className="h-3.5 w-3.5 fill-white" />
             </div>
             <p className="text-xs font-black tracking-tight">Pro Plan</p>
          </div>
          <p className="text-[11px] font-bold text-muted-foreground leading-relaxed">Advanced analytics & 0% fees.</p>
          <Button variant="outline" className="w-full h-9 rounded-lg font-black text-[10px] border-2 border-primary/20 text-primary hover:bg-primary hover:text-white transition-all">
             Upgrade Now
          </Button>
        </div>

        <Button 
          onClick={() => signOut()}
          className="w-full h-11 justify-start gap-3 text-red-500 hover:text-white hover:bg-red-500 rounded-xl bg-transparent border-0 shadow-none px-4 font-black transition-all group text-sm"
        >
          <LogOut className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Logout
        </Button>
      </div>
    </aside>
  );
}

