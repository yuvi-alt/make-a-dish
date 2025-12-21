import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const cuisineNames: Record<string, { name: string; description: string }> = {
  indian: {
    name: "Indian",
    description: "Discover authentic Indian dishes made by home chefs in your area. From classic curries to regional specialties.",
  },
  italian: {
    name: "Italian",
    description: "Enjoy homemade Italian cuisine, from fresh pasta to traditional pizzas and regional Italian dishes.",
  },
  british: {
    name: "Modern British",
    description: "Explore contemporary British cooking with a modern twist, featuring local ingredients and innovative recipes.",
  },
  chinese: {
    name: "Chinese",
    description: "Savor authentic Chinese cuisine prepared by home chefs, featuring regional specialties and family recipes.",
  },
  thai: {
    name: "Thai",
    description: "Experience the vibrant flavors of Thai cuisine, from spicy curries to fragrant stir-fries and fresh salads.",
  },
  japanese: {
    name: "Japanese",
    description: "Discover carefully crafted Japanese dishes, from sushi to ramen and traditional home-cooked meals.",
  },
  mexican: {
    name: "Mexican",
    description: "Enjoy authentic Mexican flavors, from tacos and burritos to traditional family recipes passed down through generations.",
  },
  mediterranean: {
    name: "Mediterranean",
    description: "Fresh Mediterranean cuisine featuring olive oil, herbs, and fresh ingredients from the Mediterranean region.",
  },
  "middle-eastern": {
    name: "Middle Eastern",
    description: "Rich and flavorful Middle Eastern dishes, from mezze platters to hearty main courses.",
  },
  "vegan-vegetarian": {
    name: "Vegan & Vegetarian",
    description: "Plant-based dishes that are both delicious and nutritious, crafted by passionate home chefs.",
  },
  caribbean: {
    name: "Caribbean",
    description: "Experience the vibrant flavors of the Caribbean, from jerk dishes to tropical-inspired meals.",
  },
  turkish: {
    name: "Turkish",
    description: "Authentic Turkish cuisine featuring kebabs, meze, and traditional dishes from the region.",
  },
  korean: {
    name: "Korean",
    description: "Discover Korean flavors, from kimchi and bulgogi to traditional home-cooked Korean meals.",
  },
  "desserts-bakery": {
    name: "Desserts & Bakery",
    description: "Indulge in homemade desserts and freshly baked goods from talented local bakers.",
  },
};

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function CuisinePage({ params }: Props) {
  const { slug } = await params;
  const cuisine = cuisineNames[slug];

  if (!cuisine) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-8">
        <Button asChild variant="secondary" className="mb-6">
          <Link href="/" className="inline-flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
        </Button>
        <h1 className="font-display text-4xl font-semibold text-brand-charcoal md:text-5xl">
          {cuisine.name}
        </h1>
        <p className="text-lg text-brand-charcoal/75 mt-3 max-w-2xl">
          {cuisine.description}
        </p>
      </div>

      {/* Placeholder for future dishes/chefs listing */}
      <div className="mt-12 rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-sm">
        <p className="text-brand-charcoal/60">
          Dishes and chefs for {cuisine.name} cuisine will be displayed here.
        </p>
        <p className="text-sm text-brand-charcoal/50 mt-2">
          This is a placeholder page for the {cuisine.name} category.
        </p>
      </div>
    </div>
  );
}

