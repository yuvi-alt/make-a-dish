import { Phone, Mail, MessageCircle } from "lucide-react";
import { PageHero } from "@/components/marketing/page-hero";
import { ContactForm } from "@/components/marketing/contact-form";
import { MarketingSection, InfoCard } from "@/components/marketing/section";

const support = [
  {
    title: "WhatsApp concierge",
    description: "Voice notes and quick replies while you prep. Weekdays 9am–9pm.",
    icon: MessageCircle,
    accent: "cream" as const,
  },
  {
    title: "Hotline for councils",
    description: "We liaise directly with food safety teams if they need extra details.",
    icon: Phone,
    accent: "peach" as const,
  },
  {
    title: "Inbox support",
    description: "Detailed answers to compliance or marketplace questions within 1 business day.",
    icon: Mail,
    accent: "green" as const,
  },
];

export default function ContactPage() {
  return (
    <div className="space-y-14">
      <PageHero
        eyebrow="Contact"
        title="We’re here to help your food business thrive"
        description="Send us a note and our operator success team will get back within 24 hours. Prefer WhatsApp or a call? Let us know in the message."
      />

      <section className="mx-auto grid max-w-5xl gap-8 px-6 md:grid-cols-2">
        <ContactForm />
        <div className="glass-surface space-y-5 p-6">
          <h3 className="text-2xl font-semibold text-brand-charcoal">
            Need an instant response?
          </h3>
          <p className="text-brand-charcoal/75">
            Email <strong>hello@makeadish.uk</strong> or call{" "}
            <strong>+44 20 1234 5678</strong>. We’re also on Instagram
            <strong> @makeadish</strong>.
          </p>
          <div className="rounded-3xl bg-brand-butter/40 p-4">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-charcoal/60">
              Response times
            </p>
            <p className="mt-2 text-3xl font-display text-brand-charcoal">~4 hours</p>
            <p className="text-sm text-brand-charcoal/70">Average weekday reply</p>
          </div>
        </div>
      </section>

      <MarketingSection
        eyebrow="Support"
        heading="Specialist help for every stage"
        description="Whether you’re still sketching recipes or scaling production, we have a channel for you."
      >
        <div className="grid gap-6 md:grid-cols-3">
          {support.map((item) => (
            <InfoCard key={item.title} {...item} />
          ))}
        </div>
      </MarketingSection>
    </div>
  );
}

