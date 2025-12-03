import { Skeleton, SkeletonCard } from "@/components/ui/skeleton";

export default function AdminRegistrationsLoading() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12">
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>

        {/* Search and filters skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <div className="flex gap-4">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>

        {/* Table skeleton */}
        <div className="glass-surface rounded-[32px] bg-white/90 p-6 shadow-brand">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-brand-charcoal/20">
                  <th className="px-4 py-3 text-left">
                    <Skeleton className="h-4 w-4" />
                  </th>
                  <th className="px-4 py-3 text-left">
                    <Skeleton className="h-5 w-24" />
                  </th>
                  <th className="px-4 py-3 text-left">
                    <Skeleton className="h-5 w-32" />
                  </th>
                  <th className="px-4 py-3 text-left">
                    <Skeleton className="h-5 w-28" />
                  </th>
                  <th className="px-4 py-3 text-left">
                    <Skeleton className="h-5 w-20" />
                  </th>
                  <th className="px-4 py-3 text-left">
                    <Skeleton className="h-5 w-24" />
                  </th>
                  <th className="px-4 py-3 text-left">
                    <Skeleton className="h-5 w-16" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-brand-charcoal/10">
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
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination skeleton */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-32" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-10 w-10" />
          </div>
        </div>
      </div>
    </div>
  );
}

