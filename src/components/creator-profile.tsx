"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Coffee, IndianRupee, Share2, Globe, ShoppingBag, CheckCircle2, Heart, Sparkles, ArrowRight, Twitter, Instagram, Github, Youtube } from "lucide-react";
import { motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import axios from "axios";

interface CreatorProfileProps {
  creator: any; 
}

const socialPlatforms = [
  { id: "twitter", icon: Twitter, color: "text-sky-500", label: "Twitter" },
  { id: "instagram", icon: Instagram, color: "text-pink-500", label: "Instagram" },
  { id: "github", icon: Github, color: "text-foreground", label: "GitHub" },
  { id: "youtube", icon: Youtube, color: "text-red-500", label: "YouTube" },
];

export function CreatorProfile({ creator }: CreatorProfileProps) {
  const { user } = useUser();
  const [amount, setAmount] = useState<number | "">("");
  const [message, setMessage] = useState("");
  const [isPaying, setIsPaying] = useState(false);
  
  const presets = [50, 100, 200, 500];

  const handleSupport = async (type: "SUPPORT" | "PRODUCT" = "SUPPORT", productId?: string) => {
    if (!amount || Number(amount) <= 0) {
      alert("Please enter a valid amount.");
      return;
    }
    setIsPaying(true);

    try {
      const { data: order } = await axios.post("/api/payments/create-order", {
        amount: Number(amount) * 100,
        recipientId: creator.id,
        productId,
        message,
        supporterName: user?.fullName || "Anonymous",
        type,
      });

      if (order.isMock) {
        alert("🧪 DEV MODE: Mock payment initiated. Redirecting to success page...");
        setTimeout(() => {
          window.location.href = `/payment/success?orderId=${order.orderId}&isMock=true`;
        }, 1500);
        return;
      }

      const options = {
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "SupportMe",
        description: type === "SUPPORT" 
          ? `Support to ${creator.name || creator.username}` 
          : `Buying ${productId}`,
        order_id: order.orderId,
        handler: function (response: any) {
          window.location.href = `/payment/success?orderId=${order.orderId}`;
        },
        prefill: {
          name: user?.fullName || "",
          email: user?.primaryEmailAddress?.emailAddress || "",
          contact: "", 
          method: "upi", 
        },
        theme: {
          color: "#5d71c9",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment failed", error);
      alert("Payment failed to initialize.");
    } finally {
      setIsPaying(false);
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    alert("🔗 Profile link copied to clipboard!");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-10 px-4">
      {/* Profile Header section */}
      <section className="relative rounded-[2.5rem] overflow-hidden bg-background border-2 border-border shadow-xl">
        {/* Banner with Gradient */}
        <div className="h-40 md:h-60 bg-gradient-to-r from-primary/10 via-indigo-500/10 to-violet-500/5 relative overflow-hidden">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.05),transparent)]" />
           <div className="absolute top-6 right-6">
              <Badge className="bg-primary/10 backdrop-blur-md text-primary border-primary/20 px-3 py-1 rounded-full font-black text-[9px] uppercase tracking-widest">
                <Sparkles className="w-3 h-3 mr-2" /> Verified Creator
              </Badge>
           </div>
        </div>
        
        <div className="px-6 md:px-12 pb-12">
          <div className="flex flex-col md:flex-row gap-8 -mt-16 md:-mt-20 items-start md:items-end mb-10">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative"
            >
              <img 
                src={creator.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${creator.username}`}
                alt={creator.name || creator.username}
                className="w-32 h-32 md:w-44 md:h-44 rounded-[2rem] border-4 border-background bg-zinc-100 object-cover shadow-xl"
              />
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-2 rounded-xl border-4 border-background shadow-md">
                 <CheckCircle2 className="h-4 w-4" />
              </div>
            </motion.div>
            
            <div className="flex-1 space-y-2 pt-4 md:pt-0">
              <h1 className="text-3xl md:text-4xl font-black tracking-tighter leading-none">{creator.name || creator.username}</h1>
              <div className="flex items-center gap-3">
                 <p className="text-lg font-black text-primary uppercase tracking-[0.1em] italic opacity-80">@{creator.username}</p>
                 <Badge variant="secondary" className="rounded-full px-3 py-0.5 font-bold text-[10px] uppercase tracking-widest opacity-60">
                    Art & Design
                 </Badge>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button 
                onClick={handleShare}
                variant="outline" 
                className="rounded-full gap-2 font-black px-6 h-11 border-2 text-sm transition-all hover:bg-primary hover:text-white"
              >
                <Share2 className="h-4 w-4" /> Share
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            <div className="lg:col-span-2 space-y-10">
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] opacity-40">About</h3>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-medium">
                  {creator.bio || "Building something amazing! Support my journey as I create world-class experiences and share them with you."}
                </p>
              </div>

              <div className="pt-8 border-t border-dashed border-border/60">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] opacity-40 mb-6">Social Presence</h3>
                <div className="flex flex-wrap gap-6">
                  {socialPlatforms.map((platform) => {
                    const url = creator.socialLinks?.[platform.id];
                    if (!url) return null;
                    return (
                      <a 
                        key={platform.id} 
                        href={url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="group flex items-center gap-3 text-sm font-black hover:text-primary transition-all capitalize"
                      >
                        <div className="w-10 h-10 rounded-xl bg-secondary group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                          <platform.icon className={cn("h-4 w-4", platform.color)} />
                        </div>
                        {platform.label}
                      </a>
                    );
                  })}
                  {(!creator.socialLinks || socialPlatforms.every(p => !creator.socialLinks[p.id])) && (
                    <p className="text-sm text-muted-foreground font-medium italic opacity-50">No social links added yet.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Support Quick-Card */}
            <Card className="rounded-[2.5rem] border-2 border-primary/20 shadow-lg p-8 space-y-6 bg-secondary/10 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-3xl -z-10 rounded-full" />
               <div className="space-y-3 text-center">
                  <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto text-white shadow-lg">
                    <Heart className="w-6 h-6 fill-white" />
                  </div>
                  <h3 className="text-2xl font-black">Support Me</h3>
                  <p className="text-sm font-medium text-muted-foreground">Fuel more creative works.</p>
               </div>
               <Button 
                onClick={() => document.getElementById("support-section")?.scrollIntoView({ behavior: "smooth" })}
                className="w-full h-12 rounded-full font-black text-base gap-3 shadow-lg"
               >
                 Support Now <ArrowRight className="w-5 h-5" />
               </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Products & Support Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Store */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-black flex items-center gap-3">
              <ShoppingBag className="h-8 w-8 text-primary" /> Store
            </h2>
            <Badge variant="secondary" className="px-3 py-1 rounded-full font-black text-[9px] uppercase tracking-widest">
              {creator.products?.length || 0} ITEMS
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {creator.products?.map((product: any) => (
              <Card 
                key={product.id} 
                className="overflow-hidden border-2 border-border/40 hover:border-primary/40 hover:shadow-xl transition-all duration-500 group rounded-[2rem] bg-background"
              >
                <div className="aspect-video relative overflow-hidden bg-zinc-100 border-b-2 font-black">
                  <img src={product.thumbnailUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800"} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                    <Button 
                      onClick={() => {
                        setAmount(product.price / 100);
                        handleSupport("PRODUCT", product.id);
                      }}
                      className="rounded-full bg-white text-black hover:bg-zinc-100 gap-2 font-black px-6 h-11 text-sm shadow-xl"
                    >
                      <ShoppingBag className="h-4 w-4" /> Buy Now
                    </Button>
                  </div>
                </div>
                <CardHeader className="p-6 space-y-2">
                  <div className="flex justify-between items-start gap-3">
                    <CardTitle className="text-xl font-black line-clamp-1 tracking-tighter">{product.title}</CardTitle>
                    <span className="text-xl font-black text-primary">₹{product.price / 100}</span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed font-medium opacity-80">{product.description}</p>
                </CardHeader>
              </Card>
            ))}
            {(!creator.products || creator.products.length === 0) && (
              <div className="col-span-full py-16 text-center border-2 border-dashed rounded-[2.5rem] text-muted-foreground bg-secondary/10 space-y-3">
                <ShoppingBag className="h-12 w-12 mx-auto opacity-20" />
                <p className="text-lg font-black">Store is empty.</p>
                <p className="text-sm font-medium opacity-60 italic">Check back soon!</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Support Interface */}
        <div id="support-section" className="space-y-8 lg:sticky lg:top-24 h-fit">
          <Card className="rounded-[2.5rem] border-2 border-border/60 shadow-xl overflow-hidden bg-background">
            <CardHeader className="bg-primary/5 text-center pt-10 pb-6 border-b-2 border-dashed">
              <CardTitle className="text-2xl font-black tracking-tighter flex flex-col items-center gap-3">
                <div className="p-3 bg-primary text-white rounded-2xl shadow-lg">
                   <Coffee className="h-8 w-8" />
                </div>
                Support <span className="text-primary italic">{creator.name || creator.username}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-10 space-y-8 px-8 pb-12">
              <div className="space-y-4">
                <p className="text-center font-black uppercase tracking-[0.2em] text-[10px] opacity-40">Presets</p>
                <div className="flex justify-center gap-3 flex-wrap">
                  {presets.map((p) => (
                    <button 
                      key={p} 
                      className={`h-11 w-11 rounded-xl font-black border-2 transition-all duration-300 ${amount === p ? "bg-primary border-primary text-white scale-110 shadow-lg" : "bg-background border-border hover:border-primary/40 text-muted-foreground hover:text-primary"}`}
                      onClick={() => setAmount(p)}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative group">
                <Input 
                  type="number" 
                  placeholder="Custom amount" 
                  className="pl-6 h-12 text-xl rounded-xl border-2 focus-visible:ring-primary/20 font-black bg-secondary/10 group-hover:bg-background transition-all outline-none"
                  value={amount}
                  onChange={(e) => setAmount(Math.max(0, Number(e.target.value)) || "")}
                />
                <IndianRupee className="absolute right-6 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
              </div>

              <div className="space-y-4">
                <textarea 
                  placeholder="Your message..."
                  className="w-full min-h-[120px] p-5 rounded-2xl border-2 bg-secondary/10 focus:bg-background transition-all resize-none focus:outline-none focus:ring-4 focus:ring-primary/10 font-bold text-base placeholder:opacity-50"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              <Button 
                className="w-full h-14 text-lg font-black rounded-full bg-primary hover:bg-primary/90 text-white shadow-xl gap-3 transition-transform active:scale-[0.98]"
                disabled={!amount || isPaying}
                onClick={() => handleSupport()}
              >
                {isPaying ? "Processing..." : `Support ₹${amount || 0}`}
                <ArrowRight className="w-6 h-6" />
              </Button>

              <div className="pt-6 border-t-2 border-dashed space-y-4">
                <p className="text-[9px] text-center text-muted-foreground uppercase tracking-[0.2em] font-black opacity-40">Secure UPI Payments</p>
              </div>
            </CardContent>
          </Card>
          
          <p className="text-center text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] opacity-40">
            Powered by SupportMe
          </p>
        </div>
      </div>
    </div>
  );
}

const cn = (...classes: any[]) => classes.filter(Boolean).join(" ");

