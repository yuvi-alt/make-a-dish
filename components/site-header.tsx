"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/50 bg-brand-cream/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          onClick={closeMenu}
          className="flex items-center gap-3 rounded-full bg-white/80 px-3 py-2 font-display text-lg font-semibold text-brand-charcoal shadow-brand-soft"
        >
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-peach/60 text-brand-charcoal shadow-inner">
            🥘
          </span>
          Make a Dish
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-brand-charcoal md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition hover:text-brand-tangerine"
            >
              {link.label}
            </Link>
          ))}
          <Button asChild variant="pill">
            <Link href="/register/start">Register</Link>
          </Button>
        </nav>
        <button
          type="button"
          aria-label="Toggle navigation menu"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/60 bg-white/80 text-brand-charcoal shadow-md md:hidden"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      <div
        className={cn(
          "md:hidden",
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <div className="space-y-4 border-t border-white/60 bg-white/95 px-6 py-4 text-base font-semibold text-brand-charcoal shadow-xl">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block rounded-xl bg-brand-cream px-4 py-3"
              onClick={closeMenu}
            >
              {link.label}
            </Link>
          ))}
          <Button asChild className="w-full" variant="pill" onClick={closeMenu}>
            <Link href="/register/start">Register</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

