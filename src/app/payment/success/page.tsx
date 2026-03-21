import { db } from "@/lib/db";
import { BadgeCheck, Coffee, Download, ArrowRight, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId: string }>;
}) {
  const { orderId } = await searchParams;

  if (!orderId) {
    redirect("/");
  }

  // Wait for webhook or check DB (Polled/Refresh approach)
  // In a real app, you might want to wait a few seconds or use a client component with polling
  const payment = await db.payment.findUnique({
    where: { razorpayOrderId: orderId },
    include: {
      recipient: true,
      product: true,
    },
  });

  if (!payment || payment.status !== "SUCCESS") {
    // If not success yet, show a "Verifying" state
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 text-center space-y-6">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600" />
        <h1 className="text-2xl font-bold">Verifying Payment...</h1>
        <p className="text-muted-foreground">This usually takes a few seconds. Please don&apos;t close this page.</p>
        <Button className="border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground" onClick={() => window.location.reload()}>Refresh Page</Button>
      </div>
    );
  }

  const isProduct = payment.type === "PRODUCT";

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-4">
      <Card className="max-w-md w-full rounded-[2.5rem] border-2 border-emerald-100 dark:border-emerald-950 shadow-2xl overflow-hidden">
        <div className="h-3 bg-emerald-500" />
        <CardHeader className="text-center pt-8">
          <div className="mx-auto bg-emerald-100 dark:bg-emerald-900/30 p-4 rounded-full w-fit mb-4">
            <BadgeCheck className="h-12 w-12 text-emerald-600" />
          </div>
          <CardTitle className="text-3xl font-bold">Payment Recieved!</CardTitle>
          {payment.razorpayOrderId?.startsWith("order_mock_") && (
            <div className="mt-2 text-center">
              <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800 animate-pulse">
                🧪 TEST MODE (MOCK)
              </Badge>
            </div>
          )}
          <p className="text-muted-foreground mt-2">
            Thank you for supporting <span className="font-bold text-foreground">@{payment.recipient.username}</span>
          </p>
        </CardHeader>
        
        <CardContent className="p-8 space-y-8">
          <div className="bg-zinc-50 dark:bg-zinc-900 rounded-3xl p-6 border space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Order ID</span>
              <span className="font-mono">{payment.razorpayOrderId?.slice(-8) || "N/A"}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-bold">₹{payment.amount / 100}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Date</span>
              <span>{new Date(payment.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          {isProduct && payment.product ? (
            <div className="space-y-4">
              <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-2xl border border-orange-100 dark:border-orange-900 flex items-center gap-4">
                <div className="bg-white dark:bg-zinc-800 p-2 rounded-xl shadow-sm">
                  <ShoppingBag className="h-8 w-8 text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-orange-600 uppercase tracking-wider">Your Purchase</p>
                  <p className="font-bold truncate">{payment.product.title}</p>
                </div>
              </div>
              <Button asChild className="w-full h-14 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white gap-2 text-lg">
                <a href={`/api/products/download/${payment.product.id}?orderId=${payment.razorpayOrderId}`}>
                  <Download className="h-5 w-5" /> Download Product
                </a>
              </Button>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="bg-zinc-50 dark:bg-zinc-900 p-6 rounded-3xl border border-dashed italic text-muted-foreground">
                &quot;{payment.message || "No message left."}&quot;
              </div>
              <Button asChild className="w-full h-14 rounded-2xl gap-2 group border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground">
                <Link href={`/@${payment.recipient.username}`}>
                  Back to Profile <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          )}
          
          <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest font-bold">
            Powered by Razorpay & SupportMe
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
