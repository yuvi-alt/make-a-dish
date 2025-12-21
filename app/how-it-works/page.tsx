import { ClipboardCheck, UploadCloud, Store, Wallet, Smile } from "lucide-react";
import { PageHero } from "@/components/marketing/page-hero";
import { MarketingSection, InfoCard } from "@/components/marketing/section";

const processSteps = [
  {
    title: "Become a Host",
    description:
      "Tell us about your kitchen, menu, and hygiene processes. We package the data for your local authority.",
    icon: ClipboardCheck,
    accent: "peach" as const,
  },
  {
    title: "Add your menu",
    description:
      "Upload dishes, ingredients, allergen tags, and prep windows. Drag-and-drop like a delivery marketplace.",
    icon: UploadCloud,
    accent: "cream" as const,
  },
  {
    title: "Customers nearby order",
    description:
      "Your profile appears in neighbourhood feeds. Customers can pre-order or request special drops.",
    icon: Store,
    accent: "green" as const,
  },
  {
    title: "Fulfil orders",
    description:
      "Batch prep, print labels, and schedule pickup slots. Courier partners are one tap away.",
    icon: Smile,
    accent: "cream" as const,
  },
  {
    title: "Get paid weekly",
    description:
      "Keep 90% of every order. Track payouts, tips, and ingredient costs in one dashboard.",
    icon: Wallet,
    accent: "peach" as const,
  },
];

export default function HowItWorksPage() {
  return (
    <div className="space-y-14">
      <PageHero
        eyebrow="How it works"
        title="From sign-up to first order in a few evenings"
        description="Make a Dish guides you with checklists, prompts, and animations so the experience feels like launching a store on your favourite delivery app."
      />

      <MarketingSection
        heading="The Make a Dish journey"
        description="Each phase unlocks automatically and saves progress to the cloud, so you can switch between devices without losing context."
      >
        <div className="grid gap-6 md:grid-cols-2">
          {processSteps.map((step) => (
            <InfoCard key={step.title} {...step} />
          ))}
        </div>
      </MarketingSection>

      <MarketingSection
        heading="What happens behind the scenes"
        description="While you focus on flavour, we take care of the paperwork, guidance, and merchandising."
      >
        <div className="rounded-[32px] bg-white/80 p-8 shadow-brand-soft">
          <ul className="space-y-4 text-brand-charcoal/80">
            <li>
              <strong className="text-brand-charcoal">Smart compliance:</strong> automated
              reminders for inspections, allergen statements, and cleaning logs.
            </li>
            <li>
              <strong className="text-brand-charcoal">Story-led profile:</strong> photo
              prompts, brand colour suggestions, and music playlists to set the vibe.
            </li>
            <li>
              <strong className="text-brand-charcoal">Local spotlight:</strong> curated
              seasonal collections (like “Summer BBQ Heroes”) to help you stand out.
            </li>
            <li>
              <strong className="text-brand-charcoal">Neighbour trust:</strong> verified
              kitchen badges, transparent hygiene ratings, and built-in messaging.
            </li>
          </ul>
        </div>
      </MarketingSection>
    </div>
  );
}

