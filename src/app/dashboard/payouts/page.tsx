import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { 
  CreditCard, 
  History, 
  Download, 
  AlertCircle,
  Building2,
  Wallet
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default async function PayoutsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const creator = await db.user.findUnique({
    where: { clerkId: userId },
    include: {
      receivedPayments: {
        where: { status: "SUCCESS" },
        orderBy: { createdAt: "desc" },
      }
    }
  });

  if (!creator) redirect("/dashboard");

  const totalBalance = creator.receivedPayments.reduce((sum, p) => sum + p.amount, 0) / 100;
  const pendingPayout = 0; // Simulated logic

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold">Payouts & Earnings</h1>
        <p className="text-muted-foreground">Manage your earnings and withdrawal methods.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-orange-500 to-rose-600 text-white border-0 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-orange-100/80 text-sm font-medium">Total Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">₹{totalBalance.toLocaleString()}</div>
            <p className="text-orange-100/60 text-xs mt-2 italic">Available for instant withdrawal</p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Payout</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₹{pendingPayout.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              Processing (Typically 2-3 days)
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-zinc-50 dark:bg-zinc-900/50 flex flex-col justify-center">
          <CardContent className="pt-6">
            <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white rounded-xl py-6 shadow-md shadow-orange-500/20">
              <Download className="mr-2 h-4 w-4" />
              Withdraw Funds
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Payout Method */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-orange-600" />
              Payout Method
            </CardTitle>
            <CardDescription>Withdrawals will be sent to your primary UPI ID.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="upi">Default UPI ID</Label>
              <div className="flex gap-2">
                <Input 
                  id="upi" 
                  value={creator.upiId || "Not set"} 
                  readOnly 
                  className="bg-zinc-50 dark:bg-zinc-900 border-border/50 rounded-xl"
                />
                <Button variant="outline" className="rounded-xl border-border/50">Edit</Button>
              </div>
            </div>
            <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-2xl border border-orange-100 dark:border-orange-900/30 flex gap-3 text-sm text-orange-700 dark:text-orange-400">
               <div className="bg-orange-200 dark:bg-orange-900/50 p-1.5 rounded-lg h-fit">
                 <Wallet className="h-4 w-4" />
               </div>
               <p>We use Razorpay X for instant payouts. Please ensure your UPI ID is linked to your bank account.</p>
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="border-border/50 shadow-sm overflow-hidden">
          <CardHeader className="border-b bg-zinc-50/50 dark:bg-zinc-900/50">
            <CardTitle className="flex items-center gap-2 text-lg">
              <History className="h-5 w-5 text-orange-600" />
              Transaction History
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {creator.receivedPayments.length > 0 ? (
                creator.receivedPayments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-4 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                    <div>
                      <p className="font-semibold text-sm">{payment.supporterName || "Supporter Payment"}</p>
                      <p className="text-xs text-muted-foreground">{new Date(payment.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-orange-600 text-sm">+₹{payment.amount / 100}</p>
                      <Badge variant="ghost" className="text-[10px] uppercase text-emerald-500 h-5 px-1.5">
                        Success
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center text-muted-foreground space-y-2">
                  <CreditCard className="h-10 w-10 mx-auto opacity-20" />
                  <p>No transactions yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
