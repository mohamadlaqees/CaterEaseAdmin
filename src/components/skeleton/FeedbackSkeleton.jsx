import { Skeleton } from "@/components/ui/skeleton";

const FeedbackSkeleton = () => {
  return (
    <main className="p-5 sm:p-10 animate-pulse">
      {/* Individual Review Cards Skeleton */}
      <section className="mt-6 text-sm sm:text-base">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="mt-4 py-10 w-full flex flex-col lg:flex-row gap-5 lg:gap-10 border-b-2 border-gray-200"
          >
            {/* Avatar Skeleton */}
            <div className="flex-shrink-0">
              <Skeleton className="rounded-full w-20 h-20" />
            </div>

            {/* Content Skeleton */}
            <div className="w-full space-y-4">
              {/* User Name and Status Badge */}
              <div className="flex items-center gap-3">
                <Skeleton className="h-7 w-40" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>

              {/* Rating, Date, and Status Dropdown */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, j) => (
                      <Skeleton key={j} className="h-6 w-6 rounded-full" />
                    ))}
                  </div>
                  <Skeleton className="h-5 w-24" />
                </div>
                <Skeleton className="h-10 w-full sm:w-[180px]" />
              </div>

              {/* Message Skeleton */}
              <div className="space-y-2 pt-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
};

export default FeedbackSkeleton;
