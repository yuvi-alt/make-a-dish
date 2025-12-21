import Link from "next/link";
import { cn } from "@/lib/utils";

type CuisineTileProps = {
  name: string;
  slug: string;
  description?: string;
  gradient?: string;
};

const defaultGradients = [
  "from-orange-200 to-orange-300",
  "from-red-200 to-red-300",
  "from-yellow-200 to-yellow-300",
  "from-green-200 to-green-300",
  "from-blue-200 to-blue-300",
  "from-purple-200 to-purple-300",
  "from-pink-200 to-pink-300",
  "from-indigo-200 to-indigo-300",
  "from-teal-200 to-teal-300",
  "from-amber-200 to-amber-300",
];

export function CuisineTile({ name, slug, description, gradient }: CuisineTileProps) {
  const tileGradient = gradient || defaultGradients[slug.length % defaultGradients.length];

  return (
    <Link
      href={`/cuisine/${slug}`}
      className="group block"
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100",
          "transition-all duration-200 hover:shadow-md hover:scale-[1.02]",
          "h-full flex flex-col"
        )}
      >
        <div className={cn("h-40 w-full bg-gradient-to-br", tileGradient)}>
          {/* Image placeholder area */}
        </div>
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="text-lg font-semibold text-brand-charcoal group-hover:text-brand-tangerine transition-colors">
            {name}
          </h3>
          {description && (
            <p className="text-sm text-brand-charcoal/60 mt-1">{description}</p>
          )}
        </div>
      </div>
    </Link>
  );
}

