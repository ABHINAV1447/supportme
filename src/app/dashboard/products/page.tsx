import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Plus, ShoppingBag, Pencil, Trash2, ExternalLink, Sparkles, Zap, ArrowRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { AddProductDialog } from "@/components/dashboard/add-product-dialog";
import { EditProductDialog } from "@/components/dashboard/edit-product-dialog";
import { DeleteProductButton } from "@/components/dashboard/delete-product-button";

export default async function ProductsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const creator = await db.user.findUnique({
    where: { clerkId: userId },
    include: {
      products: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!creator) redirect("/sign-up");

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3">
          <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest w-fit">
            <ShoppingBag className="w-3.5 h-3.5 mr-2" /> Merchant Tools
          </Badge>
          <div className="space-y-1">
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-foreground leading-[1.1]">
              Your <span className="text-primary italic">Catalogs</span>
            </h1>
            <p className="text-muted-foreground text-lg font-bold opacity-60">
              High-performance tools for digital creators.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
           <AddProductDialog />
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {creator.products.map((product) => (
          <Card key={product.id} className="overflow-hidden border-2 border-border/40 hover:border-primary/40 shadow-sm hover:shadow-xl transition-all duration-500 group rounded-[2.5rem] bg-background relative flex flex-col">
            {/* Image section with glass actions */}
            <div className="aspect-[4/3] relative overflow-hidden bg-zinc-100 dark:bg-zinc-900 border-b-2 border-border/20">
              <img 
                src={product.thumbnailUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800"} 
                alt={product.title}
                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-1000"
              />
              
              {/* Hover actions menu */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 backdrop-blur-[2px]">
                 <EditProductDialog product={product} />
                 <DeleteProductButton productId={product.id} />
              </div>

              {/* Price badge */}
              <div className="absolute bottom-4 left-4">
                <Badge className="bg-background/95 backdrop-blur-xl text-primary font-black px-4 py-2 rounded-xl shadow-xl border-2 border-primary/10 text-lg tracking-tighter">
                  ₹{product.price / 100}
                </Badge>
              </div>
            </div>
            
            <CardHeader className="p-8 pb-3">
              <div className="flex justify-between items-start gap-4">
                <CardTitle className="text-xl font-black tracking-tighter line-clamp-1 leading-tight">
                  {product.title}
                </CardTitle>
                <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-75 group-hover:scale-100">
                   <Zap className="h-4 w-4 fill-primary" />
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-8 pt-0 space-y-6 flex-1 flex flex-col justify-between">
              <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed font-bold opacity-60 italic">{product.description}</p>
              
              <div className="space-y-6">
                 <div className="flex items-center gap-6 pt-6 border-t-2 border-dashed border-border/80">
                   <div className="flex items-center gap-2">
                     <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shadow-sm">
                       <ShoppingBag className="h-3.5 w-3.5 text-muted-foreground" />
                     </div>
                     <div className="flex flex-col">
                        <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-40">Orders</span>
                        <span className="text-[11px] font-black tracking-tight">12 Sales</span>
                     </div>
                   </div>
                   <div className="flex items-center gap-2">
                     <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shadow-sm">
                       <Zap className="h-3.5 w-3.5 text-muted-foreground" />
                     </div>
                     <div className="flex flex-col">
                        <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-40">Listed</span>
                        <span className="text-[11px] font-black tracking-tight">{new Date(product.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</span>
                     </div>
                   </div>
                 </div>

                 <Link href={`/@${creator.username}`} target="_blank" className="block">
                   <Button variant="outline" className="w-full h-12 rounded-2xl font-black border-2 hover:bg-zinc-50 transition-all gap-2 text-sm group/btn shadow-sm hover:shadow-xl hover:shadow-primary/5">
                     View in Store <ArrowUpRight className="h-4 w-4 transition-transform group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
                   </Button>
                 </Link>
              </div>
            </CardContent>
          </Card>
        ))}

        {creator.products.length === 0 && (
          <div className="col-span-full py-20 text-center border-4 border-dashed rounded-[2.5rem] border-border/40 space-y-6 bg-secondary/10 group">
            <div className="bg-background p-8 rounded-2xl w-20 h-20 mx-auto flex items-center justify-center shadow-xl border-2 border-primary/5 group-hover:scale-110 transition-transform duration-700">
              <ShoppingBag className="h-8 w-8 text-primary opacity-20" />
            </div>
            <div className="space-y-2">
              <h3 className="font-black text-2xl tracking-tighter">Your store is empty.</h3>
              <p className="text-muted-foreground font-bold text-base max-w-sm mx-auto opacity-40 italic leading-relaxed">Transform your creative genius into digital gold. Start listing today.</p>
            </div>
            <div className="pt-4">
              <AddProductDialog />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

