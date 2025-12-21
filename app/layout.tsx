import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Make a Dish — Homemade Food Marketplace",
  description:
    "Make a Dish helps home chefs launch faster, share their signature dishes, and reach neighbours who crave their cooking.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="bg-brand-warm-white text-brand-charcoal antialiased">
        <div className="relative flex min-h-screen flex-col">
          <SiteHeader />
          <main className="flex-1 pt-24 pb-16">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}

