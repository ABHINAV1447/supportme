import { Sidebar } from "@/components/dashboard/sidebar";
import { UserButton } from "@clerk/nextjs";
import { ModeToggle } from "@/components/mode-toggle";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background dark:bg-zinc-950 font-sans">
      <Sidebar />
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Dashboard TopBar */}
        <header className="h-16 border-b-2 border-dashed border-border/60 flex items-center justify-between px-8 bg-background/50 backdrop-blur-xl shrink-0">
          <div className="flex-1 max-w-md">
             <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input 
                   placeholder="Search..." 
                   className="pl-11 h-10 rounded-xl bg-secondary/30 border-2 border-transparent focus-visible:ring-primary/20 focus:border-primary/20 transition-all font-medium text-sm"
                />
             </div>
          </div>
          
          <div className="flex items-center gap-4">
            <ModeToggle />
            <div className="h-6 w-px bg-border/60 mx-1" />
            <UserButton afterSignOutUrl="/" 
              appearance={{
                elements: {
                  userButtonAvatarBox: "h-8 w-8 border-2 border-primary/20 hover:border-primary transition-all shadow-md"
                }
              }}
            />
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto pb-20">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

