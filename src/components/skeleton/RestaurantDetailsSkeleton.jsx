import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const RestaurantDetailsSkeleton = () => {
  return (
    // The main grid now directly wraps the columns, matching the final layout.
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-pulse">
      {/* Left Column Skeletons */}
      <div className="lg:col-span-2 space-y-8">
        {/* --- Skeleton for Restaurant Information Card --- */}
        <Card className="shadow-sm border">
          <CardHeader>
            <Skeleton className="h-6 w-1/2" />{" "}
            {/* Card Title: "Restaurant Information" */}
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Skeleton for InfoItem: Description */}
            <div className="flex items-start space-x-3">
              <Skeleton className="h-6 w-6 rounded" />
              <div className="w-full space-y-2">
                <Skeleton className="h-4 w-1/4" /> {/* Label: "Description" */}
                <Skeleton className="h-5 w-3/4" /> {/* Value */}
              </div>
            </div>
            {/* Skeleton for InfoItem: Created On */}
            <div className="flex items-start space-x-3">
              <Skeleton className="h-6 w-6 rounded" />
              <div className="w-full space-y-2">
                <Skeleton className="h-4 w-1/4" /> {/* Label: "Created On" */}
                <Skeleton className="h-5 w-1/2" /> {/* Value */}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* --- Skeleton for Manager Details Card --- */}
        <Card className="shadow-sm border">
          <CardHeader>
            <Skeleton className="h-6 w-1/3" />{" "}
            {/* Card Title: "Manager Details" */}
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Skeleton for InfoItem: Manager Name */}
            <div className="flex items-start space-x-3">
              <Skeleton className="h-6 w-6 rounded" />
              <div className="w-full space-y-2">
                <Skeleton className="h-4 w-1/4" /> {/* Label: "Name" */}
                <Skeleton className="h-5 w-3/4" /> {/* Value */}
              </div>
            </div>
            {/* Skeleton for InfoItem: Manager Phone */}
            <div className="flex items-start space-x-3">
              <Skeleton className="h-6 w-6 rounded" />
              <div className="w-full space-y-2">
                <Skeleton className="h-4 w-1/4" /> {/* Label: "Phone" */}
                <Skeleton className="h-5 w-3/4" /> {/* Value */}
              </div>
            </div>
            {/* Skeleton for InfoItem: Manager Email */}
            <div className="flex items-start space-x-3 md:col-span-2">
              <Skeleton className="h-6 w-6 rounded" />
              <div className="w-full space-y-2">
                <Skeleton className="h-4 w-1/4" /> {/* Label: "Email" */}
                <Skeleton className="h-5 w-1/2" /> {/* Value */}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Column Skeleton */}
      <div className="lg:col-span-1 space-y-8">
        {/* --- Skeleton for Restaurant Photo Card --- */}
        <Card className="shadow-sm border">
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />{" "}
            {/* Card Title: "Restaurant Photo" */}
          </CardHeader>
          <CardContent>
            <Skeleton className="w-full h-48 rounded-md" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RestaurantDetailsSkeleton;
