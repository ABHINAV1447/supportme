"use client";

import Link from "next/link";
import { UserButton, SignInButton, SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Menu, X, Coffee, Sparkles, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { ModeToggle } from "@/components/mode-toggle";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import axios from "axios";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isDashboard) return null;

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "py-3" : "py-5"
      }`}
    >
      <div className="container mx-auto px-4">
        <nav 
          className={`flex items-center justify-between px-6 py-2.5 rounded-full border transition-all duration-500 ${
            scrolled 
              ? "bg-background/80 backdrop-blur-2xl border-border shadow-lg shadow-primary/5" 
              : "bg-transparent border-transparent"
          }`}
        >
          <Link href="/" className="flex items-center gap-3 group">
            <div className="bg-primary p-2 rounded-xl shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-300">
              <Coffee className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-black tracking-tighter text-foreground hidden sm:inline-block">
              SupportMe
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/explore" className="text-[11px] font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-[0.2em]">
              Explore
            </Link>
            <Link href="/#features" className="text-[11px] font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-[0.2em]">
              Features
            </Link>
            <div className="h-4 w-px bg-border/60 mx-1" />
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="ghost" className="font-extrabold hover:bg-secondary/50 rounded-full px-5 h-9 text-xs">Log In</Button>
              </SignInButton>
              <Link href="/sign-up">
                <Button className="bg-primary hover:bg-primary/90 text-white rounded-full px-6 h-9 text-xs font-black shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95">
                  Start My Page
                </Button>
              </Link>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard">
                <Button variant="ghost" className="font-black hover:bg-secondary/50 rounded-full px-5 h-9 text-xs">Dashboard</Button>
              </Link>
              <UserAvatar />
            </SignedIn>
            <ModeToggle />
          </div>

          {/* Mobile Nav Toggle */}
          <div className="flex items-center gap-3 md:hidden">
            <ModeToggle />
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="text-foreground p-2 hover:bg-secondary rounded-xl transition-colors"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-4 right-4 mt-3 md:hidden"
          >
            <div className="bg-background/95 backdrop-blur-2xl border border-border shadow-xl rounded-[2rem] p-6 space-y-6">
              <div className="flex flex-col gap-4">
                <Link href="/explore" className="text-xl font-black text-muted-foreground hover:text-primary transition-colors" onClick={() => setIsOpen(false)}>Explore</Link>
                <Link href="/#features" className="text-xl font-black text-muted-foreground hover:text-primary transition-colors" onClick={() => setIsOpen(false)}>Features</Link>
              </div>
              <div className="pt-4 border-t flex flex-col gap-3">
                <SignedOut>
                  <SignInButton mode="modal">
                    <Button variant="outline" className="w-full h-12 rounded-full font-black text-base border-2" onClick={() => setIsOpen(false)}>Log In</Button>
                  </SignInButton>
                  <Link href="/sign-up" onClick={() => setIsOpen(false)}>
                    <Button className="w-full h-12 bg-primary text-white rounded-full font-black text-base shadow-lg">
                      Start My Page
                    </Button>
                  </Link>
                </SignedOut>
                <SignedIn>
                  <Link href="/dashboard" className="w-full" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full h-12 rounded-full font-black text-base border-2">Dashboard</Button>
                  </Link>
                </SignedIn>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}


function UserAvatar() {
  const { user } = useUser();
  const [dbUser, setDbUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("/api/creator/profile");
        setDbUser(res.data);
      } catch (error) {
        console.error("Failed to fetch profile in navbar", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  const profileImage = dbUser?.profileImage || user?.imageUrl;

  return (
    <div className="relative group">
      <div className="absolute inset-0 opacity-0">
        <UserButton 
          afterSignOutUrl="/"
          appearance={{
            elements: {
              userButtonAvatarBox: "h-8 w-8",
              userButtonTrigger: "h-8 w-8"
            }
          }}
        />
      </div>
      <img 
        src={profileImage} 
        alt="Profile" 
        className="h-8 w-8 rounded-full border-2 border-primary/20 hover:border-primary transition-all cursor-pointer object-cover shadow-sm group-hover:scale-105 pointer-events-none"
      />
    </div>
  );
}

function SignUpButton({ children, mode }: { children: React.ReactNode, mode?: "modal" | "redirect" }) {
  // Simple wrapper since Clerk's SignUpButton doesn't always accept children in older versions
  return (
    <Link href="/sign-up">
      {children}
    </Link>
  );
}
