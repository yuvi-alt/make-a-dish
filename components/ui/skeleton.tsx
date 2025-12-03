import { cn } from "@/lib/utils";

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-gray-200", className)}
      {...props}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="glass-surface rounded-[32px] bg-white/90 p-6 shadow-brand">
      <div className="space-y-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex gap-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonTableRow() {
  return (
    <tr className="border-b border-brand-charcoal/10">
      <td className="px-4 py-4">
        <Skeleton className="h-4 w-4" />
      </td>
      <td className="px-4 py-4">
        <Skeleton className="h-4 w-32" />
      </td>
      <td className="px-4 py-4">
        <Skeleton className="h-4 w-48" />
      </td>
      <td className="px-4 py-4">
        <Skeleton className="h-4 w-36" />
      </td>
      <td className="px-4 py-4">
        <Skeleton className="h-4 w-24" />
      </td>
      <td className="px-4 py-4">
        <Skeleton className="h-4 w-28" />
      </td>
      <td className="px-4 py-4">
        <div className="flex gap-2">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
        </div>
      </td>
    </tr>
  );
}

