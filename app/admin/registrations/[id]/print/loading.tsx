import { Skeleton, SkeletonCard } from "@/components/ui/skeleton";

export default function PrintRegistrationLoading() {
  return (
    <div className="mx-auto w-full max-w-4xl px-8 py-12">
      <div className="mb-4">
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="bg-white p-8">
        <Skeleton className="mb-8 h-10 w-64" />

        <div className="mb-6 space-y-4">
          <div>
            <Skeleton className="mb-2 h-6 w-32" />
            <Skeleton className="h-5 w-48" />
          </div>

          <div>
            <Skeleton className="mb-2 h-6 w-40" />
            <Skeleton className="mb-1 h-4 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>

          <div>
            <Skeleton className="mb-2 h-6 w-24" />
            <Skeleton className="h-20 w-full" />
          </div>

          <div>
            <Skeleton className="mb-2 h-6 w-32" />
            <Skeleton className="h-4 w-36" />
          </div>

          <div>
            <Skeleton className="mb-2 h-6 w-36" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

