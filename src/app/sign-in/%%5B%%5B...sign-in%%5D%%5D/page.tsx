import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4 bg-zinc-50 dark:bg-zinc-950">
      <div className="w-full max-w-md">
        <SignIn 
          appearance={{
            elements: {
              formButtonPrimary: 'bg-orange-600 hover:bg-orange-700 text-sm normal-case',
              card: 'rounded-3xl shadow-2xl border-2 border-orange-100 dark:border-orange-900',
              headerTitle: 'text-2xl font-bold',
              headerSubtitle: 'text-muted-foreground',
            }
          }}
        />
      </div>
    </div>
  );
}
