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
import { Pencil, Upload, Image as ImageIcon, Loader2 } from "lucide-react";
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

export function EditProductDialog({ product }: { product: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      title: product.title,
      description: product.description,
      price: product.price / 100,
    }
  });

  const onSubmit = async (data: ProductFormValues) => {
    try {
      setIsUpdating(true);
      
      const fileInput = document.getElementById(`edit-product-file-${product.id}`) as HTMLInputElement;
      const thumbInput = document.getElementById(`edit-product-thumb-${product.id}`) as HTMLInputElement;
      
      let fileUrl = product.fileUrl;
      let thumbnailUrl = product.thumbnailUrl;

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

      await axios.patch(`/api/products/${product.id}`, {
        ...data,
        price: data.price * 100,
        fileUrl,
        thumbnailUrl,
      });
      
      setIsOpen(false);
      router.refresh();
      alert("Product updated successfully!");
    } catch (error) {
      console.error("Failed to update product", error);
      alert("Failed to update product.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="secondary" className="h-10 w-10 rounded-full shadow-lg hover:bg-primary hover:text-white transition-all">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden border-0 shadow-2xl rounded-[2.5rem]">
        <DialogHeader className="p-8 bg-zinc-50 dark:bg-zinc-900 border-b">
          <DialogTitle className="text-3xl font-[900] tracking-tight text-foreground">Edit Product</DialogTitle>
          <DialogDescription className="text-base font-medium">
            Refine your digital asset's listing details.
          </DialogDescription>
        </DialogHeader>
        <div className="p-8 pt-6">
          <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor={`edit-title-${product.id}`} className="text-sm font-black uppercase tracking-widest opacity-60 ml-1">Product Title</Label>
                <Input id={`edit-title-${product.id}`} placeholder="e.g. Minimalist Design System" {...form.register("title")} className="rounded-2xl h-14 text-lg font-bold border-2 focus-visible:ring-primary/20 bg-secondary/10 focus:bg-background transition-colors" />
                {form.formState.errors.title && <p className="text-xs text-red-500 font-bold ml-1">{form.formState.errors.title.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor={`edit-price-${product.id}`} className="text-sm font-black uppercase tracking-widest opacity-60 ml-1">Price (₹)</Label>
                  <Input id={`edit-price-${product.id}`} type="number" placeholder="499" {...form.register("price")} className="rounded-2xl h-14 text-lg font-bold border-2 focus-visible:ring-primary/20 bg-secondary/10 focus:bg-background transition-colors" />
                  {form.formState.errors.price && <p className="text-xs text-red-500 font-bold ml-1">{form.formState.errors.price.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-black uppercase tracking-widest opacity-60 ml-1">Thumbnail</Label>
                  <Input 
                    id={`edit-product-thumb-${product.id}`} 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                  />
                  <Button 
                    type="button" 
                    variant="outline"
                    className="w-full h-14 rounded-2xl border-2 border-dashed gap-2 font-black hover:bg-secondary/50 transition-all text-muted-foreground hover:text-primary"
                    onClick={() => document.getElementById(`edit-product-thumb-${product.id}`)?.click()}
                  >
                    <ImageIcon className="h-5 w-5" /> Cover Image
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`edit-description-${product.id}`} className="text-sm font-black uppercase tracking-widest opacity-60 ml-1">Description</Label>
                <Textarea id={`edit-description-${product.id}`} placeholder="What makes this product special?" {...form.register("description")} className="rounded-2xl min-h-[120px] text-base font-medium p-4 border-2 focus-visible:ring-primary/20 bg-secondary/10 focus:bg-background transition-colors resize-none" />
                {form.formState.errors.description && <p className="text-xs text-red-500 font-bold ml-1">{form.formState.errors.description.message}</p>}
              </div>

              <div 
                className="p-10 border-2 border-dashed rounded-[2rem] text-center space-y-4 bg-primary/5 hover:bg-primary/10 hover:border-primary/50 transition-all group cursor-pointer border-border/60"
                onClick={() => document.getElementById(`edit-product-file-${product.id}`)?.click()}
              >
                <input id={`edit-product-file-${product.id}`} type="file" className="hidden" />
                <div className="bg-white dark:bg-zinc-800 p-4 rounded-2xl w-fit mx-auto shadow-xl group-hover:scale-110 transition-transform">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="text-lg font-black tracking-tight">Update product file</p>
                  <p className="text-sm text-muted-foreground font-medium italic">Optional: Upload a new version</p>
                </div>
              </div>
            </div>

            <DialogFooter className="gap-3 sm:gap-0 mt-2">
              <Button type="button" onClick={() => setIsOpen(false)} variant="ghost" className="rounded-2xl h-14 px-8 font-black text-muted-foreground hover:text-foreground">Discard</Button>
              <Button 
                type="submit" 
                className="rounded-full h-14 px-12 bg-primary hover:bg-primary/90 text-white font-black text-lg shadow-xl shadow-primary/30 flex-1 sm:flex-none transition-all hover:scale-[1.02] active:scale-95"
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Saving...
                  </>
                ) : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
