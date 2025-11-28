import { Quote } from "lucide-react";

const testimonials = [
  {
    quote:
      "In two weeks I went from cooking for friends to delivering 40 bowls of pho across my postcode. The onboarding felt like a premium food marketplace.",
    author: "Hanh • Hanoi In Hackney",
  },
  {
    quote:
      "Love the Make a Dish branding and the control I have over my menu. Customers find me quickly and I keep 90% of every order.",
    author: "Maria • Torta Saturdays",
  },
  {
    quote:
      "As a council officer I appreciate how compliance is built in. All the details we need arrive in one tidy package.",
    author: "James • Camden Food Safety",
  },
];

export function Testimonials() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {testimonials.map((item) => (
        <figure
          key={item.author}
          className="glass-surface flex h-full flex-col gap-4 p-6"
        >
          <Quote className="h-8 w-8 text-brand-tangerine" />
          <blockquote className="text-base text-brand-charcoal/80">
            “{item.quote}”
          </blockquote>
          <figcaption className="text-sm font-semibold text-brand-charcoal">
            {item.author}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

