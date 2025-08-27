// src/components/skeleton/FeedbackSkeleton.js

import { Skeleton } from "@/components/ui/skeleton";

/**
 * A skeleton loader for a single feedback list item.
 * It mimics the layout of the FeedbackListItem component.
 * @param {{ type: 'complaint' | 'report' }} props
 */
const ListItemsSkeleton = ({ type }) => {
  const isComplaint = type === "complaints";

  return (
    <div className="p-6 mb-4 border rounded-lg shadow-sm bg-white">
      {/* Top Row: Title and Status Badge */}
      <div className="flex justify-between items-center">
        <Skeleton className="h-7 w-3/5" /> {/* Mimics item.title */}
        <Skeleton className="h-6 w-24 rounded-full" />{" "}
        {/* Mimics status badge */}
      </div>

      {/* Bottom Row: Date and optional Stars */}
      <div className="flex items-center justify-between mt-3">
        <Skeleton className="h-5 w-1/4" /> {/* Mimics item.date */}
        {/* Conditionally render the star rating skeleton */}
        {isComplaint && (
          <div className="flex items-center gap-1">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-5 w-5" />
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * The main skeleton component that renders a list of placeholder items.
 * @param {{ type: 'complaints' | 'reports' }} props
 */
const FeedbackSkeleton = ({ type = "complaints" }) => {
  return (
    <div className="animate-pulse">
      {/* Render 3 placeholder items of the specified type */}
      {[...Array(3)].map((_, i) => (
        <ListItemsSkeleton key={i} type={type} />
      ))}
    </div>
  );
};

export default FeedbackSkeleton;
