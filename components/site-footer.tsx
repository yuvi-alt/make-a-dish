import Link from "next/link";

const footerLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Contact", href: "/contact" },
  { label: "Become a Host", href: "/register/start/init" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 text-sm text-brand-charcoal/70 md:flex-row md:items-center md:justify-between md:px-8">
        <div>
          <p className="font-display text-xl font-semibold text-brand-charcoal">
            Make a Dish
          </p>
          <p className="mt-2 max-w-sm text-brand-charcoal/70">
            Helping home chefs share their flavours with local neighbours.
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-8 gap-y-2">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-brand-charcoal/70 transition hover:text-brand-tangerine"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}

