import Link from "next/link";
import {
  ChefHat,
  Upload,
  Users,
  ShieldCheck,
  Smartphone,
  Leaf,
  Sparkles,
} from "lucide-react";
import { HeroBanner } from "@/components/marketing/hero-banner";
import { MarketingSection, InfoCard } from "@/components/marketing/section";
import { Testimonials } from "@/components/marketing/testimonials";
import { Button } from "@/components/ui/button";

const steps = [
  {
    title: "Register your food business",
    description:
      "Answer friendly, guided questions so local authorities receive everything they need the first time.",
    icon: ChefHat,
    accent: "peach" as const,
  },
  {
    title: "Upload your dishes",
    description:
      "Snap your menu, add ingredients, and schedule the nights you’re cooking. It feels like publishing to a marketplace.",
    icon: Upload,
    accent: "cream" as const,
  },
  {
    title: "Local people discover & order",
    description:
      "Customers nearby see your story, favourite dishes, and delivery radius. You focus on flavour—we handle the rest.",
    icon: Users,
    accent: "green" as const,
  },
];

const benefits = [
  {
    title: "Guided compliance",
    description: "Automatic reminders, document templates, and secure storage for certificates.",
    icon: ShieldCheck,
  },
  {
    title: "Mobile-first dashboard",
    description: "Manage orders, menu, and availability from your phone while you prep.",
    icon: Smartphone,
  },
  {
    title: "Fresh & sustainable",
    description: "Encourage seasonal produce with prompts, badges, and local supplier tips.",
    icon: Leaf,
  },
  {
    title: "Delightful storytelling",
    description: "Showcase your origin story, cooking style, and kitchen vibes with rich profiles.",
    icon: Sparkles,
  },
];

export default function HomePage() {
  return (
    <div className="space-y-6">
      <HeroBanner />
      <MarketingSection
        id="how-it-works"
        eyebrow="How it works"
        heading="A three-step launch, inspired by food delivery apps"
        description="Everything feels familiar, intuitive, and friendly—so you can move from idea to first order in days, not months."
      >
        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step) => (
            <InfoCard key={step.title} {...step} />
          ))}
        </div>
      </MarketingSection>

      <MarketingSection
        eyebrow="Loved by chefs & councils"
        heading="Why food entrepreneurs choose Make a Dish"
        description="The platform pairs warm aesthetics with rock-solid compliance, making it easy for regulators to approve and locals to trust."
      >
        <div className="grid gap-6 md:grid-cols-2">
          {benefits.map((benefit) => (
            <InfoCard key={benefit.title} icon={benefit.icon} title={benefit.title} description={benefit.description} />
          ))}
        </div>
      </MarketingSection>

      <MarketingSection
        eyebrow="Proof"
        heading="Testimonials from the community"
        description="Real chefs, bakers, and inspectors who rely on Make a Dish every week."
      >
        <Testimonials />
      </MarketingSection>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="glass-surface flex flex-col gap-6 overflow-hidden bg-gradient-to-br from-brand-butter/70 to-brand-peach/60 p-8 text-brand-charcoal md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-charcoal/70">
              Bring your recipes to the block
            </p>
            <h3 className="font-display text-3xl font-semibold">
              Ready to share your signature dishes?
            </h3>
            <p className="text-base text-brand-charcoal/80">
              Start your registration today and join thousands of home chefs turning passion into income.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Button asChild className="w-full md:w-auto">
              <Link href="/register/start">Register your food business</Link>
            </Button>
            <Button asChild variant="secondary" className="w-full md:w-auto">
              <Link href="/about">Learn about the platform</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

