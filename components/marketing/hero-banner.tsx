import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroBanner() {
  return (
    <section className="relative mx-auto grid max-w-7xl gap-10 px-4 pt-10 pb-16 lg:grid-cols-2 lg:items-center md:px-8">
      <div className="space-y-6">
        <p className="inline-flex items-center gap-2 rounded-full bg-brand-butter/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-brand-charcoal/70">
          Warm, local & independent
        </p>
        <h1 className="font-display text-4xl font-semibold leading-tight text-brand-charcoal md:text-5xl">
          Sell homemade food in your local area
        </h1>
        <p className="text-lg text-brand-charcoal/75">
          Make a Dish connects home chefs with nearby food lovers. Launch in a
          weekend, upload your dishes, and start serving the neighbours who crave
          your cooking.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/register/start/init" className="inline-flex items-center gap-2">
              Become a Host
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/how-it-works">See how it works</Link>
          </Button>
        </div>
        <div className="space-y-2 rounded-3xl border border-gray-100 bg-white p-6 shadow-brand-soft">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-charcoal/60">
            Why chefs choose Make a Dish
          </p>
          <ul className="space-y-2 text-brand-charcoal/80">
            {[
              "Branding that feels like a modern food marketplace",
              "Guided registration built for UK councils",
              "Menus, storytelling, and compliance all in one place",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-1 inline-block h-2 w-2 rounded-full bg-brand-tangerine" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="relative">
        <div className="glass-surface relative overflow-hidden rounded-[36px] px-8 py-12">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-peach/20 via-transparent to-brand-mint/30" />
          <div className="relative space-y-6 text-brand-charcoal">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-charcoal/70">
              Make a Dish studio
            </p>
            <h3 className="text-3xl font-display font-semibold">
              Showcase your signature dish with warmth
            </h3>
            <div className="space-y-3">
              {[
                "Tell your story with rich chef profiles",
                "Upload seasonal menus in minutes",
                "Give neighbours an easy way to order locally",
              ].map((item) => (
                <p key={item} className="rounded-2xl bg-white px-4 py-3 text-base shadow-brand-soft border border-gray-100">
                  {item}
                </p>
              ))}
            </div>
          </div>
          <div className="pointer-events-none absolute -right-10 top-6 h-48 w-48 rounded-full bg-brand-peach/50 blur-3xl" />
          <div className="pointer-events-none absolute -left-8 bottom-4 h-32 w-32 rounded-full bg-brand-mint/40 blur-3xl" />
        </div>
      </div>
    </section>
  );
}

