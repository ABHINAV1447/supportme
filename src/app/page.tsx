"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, useScroll, useTransform } from "framer-motion";
import { Coffee, ShoppingBag, Zap, Heart, ArrowRight, Shield, Globe, Users, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

export default function Home() {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -50]);

  return (
    <div className="relative flex flex-col min-h-screen">
      {/* Dynamic Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[120px] animate-pulse [animation-delay:2s]" />
      </div>

      {/* Hero Section */}
      <section ref={targetRef} className="relative pt-24 pb-16 md:pt-40 md:pb-24 container px-4 mx-auto overflow-visible">
        <motion.div style={{ opacity, scale, y }} className="max-w-5xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase backdrop-blur-md">
              <Sparkles className="w-3 h-3 mr-2" /> The Future of Indian Creator Economy
            </Badge>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-black tracking-tight leading-[0.95] text-foreground"
          >
            Monetize your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-500 to-violet-500 italic">vision</span> in minutes.
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-muted-foreground/80 max-w-2xl mx-auto font-medium leading-relaxed"
          >
            The premium all-in-one platform for Indian creators to receive direct-to-bank UPI support 
            and sell digital products with absolute 0% platform fees.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2"
          >
            <Link href="/sign-up" className="w-full sm:w-auto">
              <Button size="lg" className="h-14 px-10 text-lg rounded-full bg-primary hover:bg-primary/90 text-white font-black shadow-lg shadow-primary/40 transition-all hover:scale-105 active:scale-95 w-full">
                Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/explore" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="h-14 px-10 text-lg rounded-full border-2 font-black transition-all hover:bg-secondary w-full">
                Explore Creators
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Premium Laptop Mockup */}
        <motion.div 
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
          className="mt-20 relative max-w-5xl mx-auto px-4 perspective-[2000px]"
        >
          <div className="relative group rotate-x-12 hover:rotate-x-0 transition-all duration-1000 ease-in-out">
            <div className="absolute -inset-10 bg-gradient-to-r from-primary/20 to-indigo-500/20 rounded-[2rem] blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity" />
            
            <div className="relative bg-zinc-950 rounded-[2rem] p-3 shadow-2xl border border-white/10 backdrop-blur-2xl">
              <div className="relative aspect-[16/10] overflow-hidden rounded-[1rem] bg-zinc-900">
                <img 
                  src="/images/dashboard-premium.png" 
                  alt="SupportMe Premium Dashboard" 
                  className="w-full h-full object-cover object-top opacity-90 group-hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/40 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>
            
            <div className="absolute -bottom-10 left-[10%] right-[10%] h-12 bg-black/40 blur-[40px] rounded-full -z-10" />
          </div>
        </motion.div>
      </section>

      {/* Bento Grid Feature Section */}
      <section className="container px-4 mx-auto py-24">
        <div className="text-center mb-16 space-y-3">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight">Everything you need to <span className="italic opacity-50">thrive</span>.</h2>
          <p className="text-lg text-muted-foreground font-medium">Built specifically for the unique needs of Indian creators.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 max-w-6xl mx-auto">
          {/* Main Feature - 0% Fee */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="md:col-span-8 bg-zinc-900/50 dark:bg-zinc-900 rounded-[2.5rem] p-8 border border-border/50 relative overflow-hidden group"
          >
            <div className="relative z-10 h-full flex flex-col justify-between space-y-12">
              <div className="space-y-4">
                <div className="bg-primary p-3 rounded-xl w-fit shadow-xl shadow-primary/20 text-white">
                  <Heart className="w-6 h-6" />
                </div>
                <h3 className="text-3xl font-black">Keep 100% of your earnings.</h3>
                <p className="text-lg text-muted-foreground max-w-sm font-medium">Unlike other platforms that take 5-10%, we take nothing. Your hustle belongs to you.</p>
              </div>
              <div className="flex items-center gap-4">
                 <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full border-4 border-zinc-900 bg-zinc-800 flex items-center justify-center text-[10px] font-bold">
                        U{i}
                      </div>
                    ))}
                 </div>
                 <p className="font-bold text-[10px] uppercase tracking-widest opacity-60">Joined by 500+ creators this week</p>
              </div>
            </div>
            <div className="absolute top-1/2 -right-20 -translate-y-1/2 w-64 h-64 bg-primary/10 blur-[80px] rounded-full group-hover:bg-primary/20 transition-colors" />
          </motion.div>

          {/* Feature - UPI */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="md:col-span-4 bg-primary text-white rounded-[2.5rem] p-8 relative overflow-hidden group"
          >
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div className="space-y-4">
                <Zap className="w-10 h-10 fill-white" />
                <h3 className="text-2xl font-black leading-none">Instant UPI Payouts.</h3>
                <p className="text-white/80 text-sm font-medium">Money hits your bank account instantly.</p>
              </div>
              <div className="pt-8">
                <button className="bg-white text-black px-5 py-2.5 rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform">Learn More</button>
              </div>
            </div>
          </motion.div>

          {/* Feature - Digital Products */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="md:col-span-4 bg-zinc-100 dark:bg-zinc-800 rounded-[2.5rem] p-8 border border-border/50 group"
          >
            <div className="space-y-4">
              <ShoppingBag className="w-10 h-10 text-primary" />
              <h3 className="text-2xl font-black">Digital Storefront.</h3>
              <p className="text-sm text-muted-foreground font-medium">Sell PDFs, presets, or assets with zero technical overhead.</p>
            </div>
          </motion.div>

          {/* Feature - Secure */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="md:col-span-8 bg-zinc-50 dark:bg-zinc-950 rounded-[2.5rem] p-8 border border-border/50 flex flex-col md:flex-row items-center gap-8 group"
          >
            <div className="flex-1 space-y-4">
               <Shield className="w-10 h-10 text-indigo-500" />
               <h3 className="text-2xl font-black">Enterprise Security.</h3>
               <p className="text-sm text-muted-foreground font-medium">Powered by Clerk and Razorpay. Your data is protected.</p>
            </div>
            <div className="w-full md:w-56 aspect-video bg-zinc-200 dark:bg-zinc-800 rounded-xl flex items-center justify-center p-3">
               <div className="w-full h-full bg-background rounded-lg shadow-inner flex items-center justify-center font-black opacity-20 text-[10px] tracking-tighter uppercase italic">Encryption Active</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-zinc-900 text-white overflow-hidden">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-16">
            <div className="max-w-md space-y-4">
              <h2 className="text-4xl font-black leading-none">Powering the <span className="text-primary italic">next wave</span>.</h2>
              <p className="text-zinc-400 font-medium text-base">We provide the infrastructure so you can focus on art.</p>
            </div>
            <div className="grid grid-cols-2 gap-10 text-center">
              <div>
                <p className="text-5xl font-black text-primary">₹5Cr+</p>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mt-2">Processed</p>
              </div>
              <div>
                <p className="text-5xl font-black text-white">50k+</p>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mt-2">Active Users</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container px-4 mx-auto py-24">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative bg-primary p-12 md:p-24 rounded-[3rem] text-center text-white overflow-hidden shadow-2xl shadow-primary/40"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-black/10 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10 space-y-8">
            <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-[1]">Start your journey <br /> with <span className="opacity-50 italic">SupportMe</span>.</h2>
            <p className="text-lg md:text-xl font-medium text-white/80 max-w-xl mx-auto">It takes less than 30 seconds to set up your page and start accepting payments.</p>
            <div className="flex justify-center pt-4">
              <Link href="/sign-up">
                <Button size="lg" className="h-14 px-10 text-xl rounded-full bg-white text-primary hover:bg-zinc-100 font-black shadow-xl hover:scale-105 transition-all">
                  Create My Free Page
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

