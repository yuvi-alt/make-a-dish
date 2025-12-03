import { Skeleton, SkeletonCard } from "@/components/ui/skeleton";

export default function AdminRegistrationDetailLoading() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12">
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-6 w-24" />
        </div>

        {/* Main content skeleton */}
        <div className="glass-surface rounded-[32px] bg-white/90 p-8 shadow-brand">
          <Skeleton className="mb-8 h-10 w-64" />
          <Skeleton className="mb-6 h-5 w-48" />

          <div className="space-y-6">
            {/* Contact Information skeleton */}
            <SkeletonCard />

            {/* Address skeleton */}
            <SkeletonCard />

            {/* Legal Entity skeleton */}
            <SkeletonCard />

            {/* Business Details skeleton */}
            <SkeletonCard />

            {/* Raw Data skeleton */}
            <div className="glass-surface rounded-2xl border border-white/60 bg-white/80 p-6 shadow-brand-soft">
              <Skeleton className="mb-4 h-6 w-32" />
              <Skeleton className="h-64 w-full" />
            </div>
          </div>

          {/* Actions skeleton */}
          <div className="mt-8 border-t border-brand-charcoal/10 pt-6">
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </div>
    </div>
  );
}

