import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import Script from "next/script";
import { Coffee } from "lucide-react";
import Link from "next/link";
import { Footer } from "@/components/footer";

const jakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SupportMe | Indian Buy Me a Coffee Alternative",
  description: "Support your favorite Indian creators with UPI and buy digital products.",
};

import { ClientProviders } from "@/components/client-providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${jakartaSans.variable} font-sans antialiased min-h-screen bg-background text-foreground`}>
        <ClientProviders>
          <div className="relative flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </ClientProviders>
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      </body>
    </html>

  );
}
