import { Heart, Globe2, Award, Users } from "lucide-react";
import { PageHero } from "@/components/marketing/page-hero";
import { MarketingSection, InfoCard } from "@/components/marketing/section";

const values = [
  {
    title: "Empower home chefs",
    description: "Give cooks the tools to run a compliant, beautiful business from their own kitchen.",
    icon: Heart,
    accent: "peach" as const,
  },
  {
    title: "Celebrate every culture",
    description: "Dishes from every part of the world deserve the same spotlight as restaurant brands.",
    icon: Globe2,
    accent: "cream" as const,
  },
  {
    title: "Build trust with councils",
    description: "We work closely with UK authorities to keep guidance current and approvals fast.",
    icon: Award,
    accent: "green" as const,
  },
];

const stats = [
  { label: "Cities supported", value: "52" },
  { label: "Average approval time", value: "6 days" },
  { label: "Community members", value: "34k" },
  { label: "Active local partners", value: "120+" },
];

export default function AboutPage() {
  return (
    <div className="space-y-14">
      <PageHero
        eyebrow="About Make a Dish"
        title="The marketplace built specifically for home food businesses"
        description="Make a Dish was created by former Deliveroo product leads and council compliance officers who wanted a friendlier path for independent cooks. We provide the structure of a delivery app with the warmth of a neighbourhood market."
      />

      <MarketingSection
        eyebrow="Vision"
        heading="Warm technology that works for small kitchens"
        description="We believe independent cooks should have the same design quality, ordering experience, and operational tooling as big brands—without the fees."
      >
        <div className="grid gap-6 md:grid-cols-3">
          {values.map((value) => (
            <InfoCard key={value.title} {...value} />
          ))}
        </div>
      </MarketingSection>

      <MarketingSection
        eyebrow="Community impact"
        heading="What makes Make a Dish different"
        description="We invest in chef education, transparent compliance, and local partnerships so you can focus on flavour."
      >
        <div className="rounded-[32px] bg-white/80 p-8 shadow-brand-soft">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-brand-charcoal">
                Built with and for operators
              </h3>
              <p className="text-brand-charcoal/80">
                Our advisory board features experienced council inspectors, seasoned
                street food entrepreneurs, and accessibility specialists. Every screen is
                tested with real cooks before launch.
              </p>
            </div>
            <div className="space-y-4 rounded-3xl bg-brand-cream/70 p-6">
              <div className="flex items-center gap-3 text-brand-charcoal">
                <Users className="h-10 w-10 rounded-2xl bg-brand-butter p-2" />
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-charcoal/70">
                    Community
                  </p>
                  <p className="text-2xl font-display font-semibold">Chef circles</p>
                </div>
              </div>
              <p className="text-brand-charcoal/75">
                Monthly peer sessions covering menu pricing, allergen training, and local
                marketing ideas.
              </p>
            </div>
          </div>
          <div className="mt-8 grid gap-4 rounded-3xl bg-brand-butter/50 p-6 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl font-display font-semibold text-brand-charcoal">
                  {stat.value}
                </p>
                <p className="text-sm text-brand-charcoal/70">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </MarketingSection>
    </div>
  );
}

