import type { Metadata } from "next";
import { Search } from "lucide-react";
import { CuisineTile } from "@/components/cuisine-tile";
import { Input } from "@/components/ui/input";

export const metadata: Metadata = {
  title: "Discover Homemade Food — Make a Dish",
  description:
    "Discover homemade food from local chefs in your neighbourhood. Explore cuisines from around the world, all made fresh by passionate home cooks.",
};

const popularCuisines = [
  {
    name: "Indian",
    slug: "indian",
    description: "Popular in your area",
    gradient: "from-orange-200 via-orange-100 to-amber-100",
  },
  {
    name: "Italian",
    slug: "italian",
    description: "Popular in your area",
    gradient: "from-red-200 via-red-100 to-pink-100",
  },
  {
    name: "Modern British",
    slug: "british",
    description: "Popular in your area",
    gradient: "from-blue-200 via-blue-100 to-indigo-100",
  },
  {
    name: "Chinese",
    slug: "chinese",
    description: "Popular in your area",
    gradient: "from-yellow-200 via-yellow-100 to-amber-100",
  },
  {
    name: "Thai",
    slug: "thai",
    description: "Popular in your area",
    gradient: "from-green-200 via-green-100 to-emerald-100",
  },
  {
    name: "Japanese",
    slug: "japanese",
    description: "Popular in your area",
    gradient: "from-red-300 via-pink-200 to-rose-200",
  },
  {
    name: "Mexican",
    slug: "mexican",
    description: "Popular in your area",
    gradient: "from-orange-300 via-orange-200 to-red-200",
  },
  {
    name: "Mediterranean",
    slug: "mediterranean",
    description: "Popular in your area",
    gradient: "from-blue-300 via-cyan-200 to-teal-200",
  },
  {
    name: "Middle Eastern",
    slug: "middle-eastern",
    description: "Popular in your area",
    gradient: "from-amber-300 via-yellow-200 to-orange-200",
  },
  {
    name: "Vegan & Vegetarian",
    slug: "vegan-vegetarian",
    description: "Popular in your area",
    gradient: "from-green-300 via-emerald-200 to-teal-200",
  },
  {
    name: "Caribbean",
    slug: "caribbean",
    description: "Popular in your area",
    gradient: "from-orange-400 via-orange-300 to-yellow-300",
  },
  {
    name: "Turkish",
    slug: "turkish",
    description: "Popular in your area",
    gradient: "from-red-400 via-red-300 to-pink-300",
  },
];

const trendingCuisines = [
  {
    name: "Korean",
    slug: "korean",
    description: "Trending this week",
    gradient: "from-red-300 via-rose-200 to-pink-200",
  },
  {
    name: "Desserts & Bakery",
    slug: "desserts-bakery",
    description: "Trending this week",
    gradient: "from-pink-300 via-purple-200 to-rose-200",
  },
];

export default function HomePage() {
  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 pt-8 pb-12 md:px-8">
        <div className="mx-auto max-w-3xl text-center space-y-4">
          <h1 className="font-display text-4xl font-semibold leading-tight text-brand-charcoal md:text-5xl lg:text-6xl">
            Discover homemade food in your neighbourhood
          </h1>
          <p className="text-lg text-brand-charcoal/75 md:text-xl">
            Support local home chefs and enjoy authentic, freshly prepared meals delivered to your door.
          </p>
          {/* Search Input - UI only for now */}
          <div className="pt-4 max-w-xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-brand-charcoal/40" />
              <Input
                type="text"
                placeholder="Search for dishes, cuisines, or chefs..."
                className="pl-12 pr-4 py-6 text-base rounded-full border-brand-charcoal/15 focus:border-brand-tangerine focus:ring-2 focus:ring-brand-peach/60 bg-white"
                readOnly
              />
            </div>
          </div>
        </div>
      </section>

      {/* Popular Cuisines Section */}
      <section className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="space-y-6">
          <div>
            <h2 className="font-display text-3xl font-semibold text-brand-charcoal md:text-4xl">
              Popular cuisines
            </h2>
            <p className="text-brand-charcoal/70 mt-2">
              Explore dishes from around the world, made fresh by local home chefs
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {popularCuisines.map((cuisine) => (
              <CuisineTile
                key={cuisine.slug}
                name={cuisine.name}
                slug={cuisine.slug}
                description={cuisine.description}
                gradient={cuisine.gradient}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="space-y-6">
          <div>
            <h2 className="font-display text-3xl font-semibold text-brand-charcoal md:text-4xl">
              Trending this week
            </h2>
            <p className="text-brand-charcoal/70 mt-2">
              What's hot in your area right now
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {trendingCuisines.map((cuisine) => (
              <CuisineTile
                key={cuisine.slug}
                name={cuisine.name}
                slug={cuisine.slug}
                description={cuisine.description}
                gradient={cuisine.gradient}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
