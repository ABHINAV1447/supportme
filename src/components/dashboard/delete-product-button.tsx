"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function DeleteProductButton({ productId }: { productId: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const onDelete = async () => {
    try {
      setIsDeleting(true);
      await axios.delete(`/api/products/${productId}`);
      router.refresh();
      alert("Product deleted successfully!");
    } catch (error) {
      console.error("Failed to delete product", error);
      alert("Failed to delete product.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="icon" variant="destructive" className="h-10 w-10 rounded-full shadow-lg hover:scale-105 transition-transform bg-rose-600 hover:bg-rose-700">
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="rounded-[2.5rem] border-0 shadow-2xl p-8">
        <AlertDialogHeader className="space-y-4">
          <AlertDialogTitle className="text-2xl font-black tracking-tight">Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription className="text-base font-medium">
            This action cannot be undone. This will permanently delete your product
            and remove its listings from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-8 gap-3 sm:gap-0">
          <AlertDialogCancel className="rounded-2xl h-12 font-black border-2 border-border/60">Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onDelete}
            className="bg-rose-600 hover:bg-rose-700 text-white rounded-full h-12 px-8 font-black shadow-lg shadow-rose-500/20"
            disabled={isDeleting}
          >
            {isDeleting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Confirm Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
