"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Upload, Image as ImageIcon, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { useRouter } from "next/navigation";

const productSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().min(1, "Price must be at least ₹1"),
});

type ProductFormValues = z.infer<typeof productSchema>;

export function AddProductDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [thumbPreview, setThumbPreview] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      title: "",
      description: "",
      price: 0,
    }
  });

  const onSubmit = async (data: ProductFormValues) => {
    try {
      setIsUploading(true);
      
      const fileInput = document.getElementById("product-file") as HTMLInputElement;
      const thumbInput = document.getElementById("product-thumb") as HTMLInputElement;
      
      let fileUrl = "https://example.com/mock-file.pdf";
      let thumbnailUrl = "https://example.com/mock-thumb.jpg";

      if (fileInput?.files?.[0]) {
        const formData = new FormData();
        formData.append("file", fileInput.files[0]);
        const res = await axios.post("/api/upload", formData);
        fileUrl = res.data.url;
      }

      if (thumbInput?.files?.[0]) {
        const formData = new FormData();
        formData.append("file", thumbInput.files[0]);
        const res = await axios.post("/api/upload", formData);
        thumbnailUrl = res.data.url;
      }

      await axios.post("/api/products", {
        ...data,
        price: data.price * 100,
        fileUrl,
        thumbnailUrl,
      });
      
      setIsOpen(false);
      form.reset();
      router.refresh();
    } catch (error) {
      console.error("Failed to add product", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-full bg-primary hover:bg-primary/90 text-white gap-2 h-12 px-6 font-black shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95">
          <Plus className="h-5 w-5" /> Add Product
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden border-0 shadow-2xl rounded-[2.5rem]">
        <DialogHeader className="p-8 bg-zinc-50 dark:bg-zinc-900 border-b">
          <DialogTitle className="text-3xl font-[900] tracking-tight text-foreground">List New Product</DialogTitle>
          <DialogDescription className="text-base font-medium">
            Launch your next digital creation to the world.
          </DialogDescription>
        </DialogHeader>
        <div className="p-8 pt-6">
          <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-black uppercase tracking-widest opacity-60 ml-1">Product Title</Label>
                <Input id="title" placeholder="e.g. Minimalist Design System" {...form.register("title")} className="rounded-2xl h-14 text-lg font-bold border-2 focus-visible:ring-primary/20 bg-secondary/10 focus:bg-background transition-colors" />
                {form.formState.errors.title && <p className="text-xs text-red-500 font-bold ml-1">{form.formState.errors.title.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-sm font-black uppercase tracking-widest opacity-60 ml-1">Price (₹)</Label>
                  <Input id="price" type="number" placeholder="499" {...form.register("price")} className="rounded-2xl h-14 text-lg font-bold border-2 focus-visible:ring-primary/20 bg-secondary/10 focus:bg-background transition-colors" />
                  {form.formState.errors.price && <p className="text-xs text-red-500 font-bold ml-1">{form.formState.errors.price.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-black uppercase tracking-widest opacity-60 ml-1">Thumbnail</Label>
                  <Input 
                    id="product-thumb" 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => setThumbPreview(reader.result as string);
                        reader.readAsDataURL(file);
                      }
                    }}

                  />
                  <Button 
                    type="button" 
                    variant="outline"
                    className="w-full h-14 rounded-2xl border-2 border-dashed gap-2 font-black hover:bg-secondary/50 transition-all text-muted-foreground hover:text-primary overflow-hidden relative"
                    onClick={() => document.getElementById("product-thumb")?.click()}
                  >
                    {thumbPreview ? (
                      <img src={thumbPreview} className="absolute inset-0 w-full h-full object-cover opacity-50" />
                    ) : (
                      <ImageIcon className="h-5 w-5" />
                    )}
                    <span className="relative z-10">{thumbPreview ? "Change Cover" : "Cover Image"}</span>
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-black uppercase tracking-widest opacity-60 ml-1">Description</Label>
                <Textarea id="description" placeholder="What makes this product special?" {...form.register("description")} className="rounded-2xl min-h-[120px] text-base font-medium p-4 border-2 focus-visible:ring-primary/20 bg-secondary/10 focus:bg-background transition-colors resize-none" />
                {form.formState.errors.description && <p className="text-xs text-red-500 font-bold ml-1">{form.formState.errors.description.message}</p>}
              </div>

              <div 
                className="p-10 border-2 border-dashed rounded-[2rem] text-center space-y-4 bg-primary/5 hover:bg-primary/10 hover:border-primary/50 transition-all group cursor-pointer border-border/60"
                onClick={() => document.getElementById("product-file")?.click()}
              >
                <input id="product-file" type="file" className="hidden" />
                <div className="bg-white dark:bg-zinc-800 p-4 rounded-2xl w-fit mx-auto shadow-xl group-hover:scale-110 transition-transform">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="text-lg font-black tracking-tight">Drop your product file here</p>
                  <p className="text-sm text-muted-foreground font-medium italic">ZIP, PDF, or any digital asset up to 50MB</p>
                </div>
              </div>
            </div>

            <DialogFooter className="gap-3 sm:gap-0 mt-2">
              <Button type="button" onClick={() => setIsOpen(false)} variant="ghost" className="rounded-2xl h-14 px-8 font-black text-muted-foreground hover:text-foreground">Discard</Button>
              <Button 
                type="submit" 
                className="rounded-full h-14 px-12 bg-primary hover:bg-primary/90 text-white font-black text-lg shadow-xl shadow-primary/30 flex-1 sm:flex-none transition-all hover:scale-[1.02] active:scale-95"
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Publishing...
                  </>
                ) : "Publish Product"}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
