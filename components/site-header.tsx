"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";

const navItems = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "How It Works", href: "/how-it-works" },
  { name: "Contact", href: "/contact" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="w-full border-b border-[#F1E9DD] bg-[#FCF9F4]/80 backdrop-blur-lg">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">

        {/* LOGO */}
        <Link
          href="/"
          className="flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm"
        >
          <div className="h-6 w-6 rounded-full bg-orange-200 flex items-center justify-center text-orange-600 font-bold">
            🍽️
          </div>
          <span className="text-lg font-semibold text-gray-900">Make a Dish</span>
        </Link>

        {/* NAVIGATION */}
        <div className="hidden items-center space-x-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`text-[15px] font-medium transition hover:text-orange-600 ${
                pathname === item.href ? "text-orange-600" : "text-gray-800"
              }`}
            >
              {item.name}
            </Link>
          ))}

          {/* FIXED REGISTER BUTTON
             Now visible, bright, modern, clickable */}
          <Button
            asChild
            variant="primary"
            className="px-5 py-2 rounded-full font-medium
                       bg-gradient-to-r from-orange-400 to-orange-500
                       text-white shadow-md hover:brightness-110"
          >
            <Link href="/register/start/init">
              Register
            </Link>
          </Button>
        </div>
      </nav>
    </header>
  );
}
