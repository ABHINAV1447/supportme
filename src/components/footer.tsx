"use client";

import Link from "next/link";
import { Coffee } from "lucide-react";
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");

  if (isDashboard) return null;

  return (
    <footer className="border-t-2 border-dashed border-border/60 py-20 bg-background/50 text-foreground">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="space-y-6 max-w-sm">
            <div className="flex items-center gap-3 group">
              <div className="bg-primary p-2.5 rounded-2xl shadow-lg">
                <Coffee className="h-5 w-5 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tighter">SupportMe</span>
            </div>
            <p className="text-muted-foreground text-lg font-medium leading-relaxed opacity-60 italic">
              Empowering the next generation of Indian independent creators with a high-performance, premium ecosystem.
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-16">
             <div className="space-y-4">
                <h4 className="text-xs font-black uppercase tracking-[0.3em] opacity-40">Platform</h4>
                <ul className="space-y-3">
                   <li><Link href="/explore" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">Explore</Link></li>
                   <li><Link href="/#features" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">Features</Link></li>
                </ul>
             </div>
             <div className="space-y-4">
                <h4 className="text-xs font-black uppercase tracking-[0.3em] opacity-40">Company</h4>
                <ul className="space-y-3">
                   <li><Link href="/" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
                   <li><Link href="/" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">Privacy</Link></li>
                </ul>
             </div>
             <div className="space-y-4">
                <h4 className="text-xs font-black uppercase tracking-[0.3em] opacity-40">Connect</h4>
                <ul className="space-y-3">
                   <li><Link href="/" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">Twitter</Link></li>
                   <li><Link href="/" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">LinkedIn</Link></li>
                </ul>
             </div>
          </div>
        </div>
        
        <div className="mt-20 pt-10 border-t border-dashed border-border flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-muted-foreground font-bold opacity-60">
            &copy; {new Date().getFullYear()} SupportMe. All rights reserved.
          </p>
          <p className="text-sm font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
            Crafted with 🧡 in <span className="text-primary italic">India</span>.
          </p>
        </div>
      </div>
    </footer>
  );
}
