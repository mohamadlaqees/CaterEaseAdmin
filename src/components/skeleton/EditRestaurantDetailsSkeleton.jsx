import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const EditRestaurantDetailsSkeleton = () => {
  return (
    // The main wrapper for the skeleton content
    <div className="animate-pulse space-y-8">
      {/* --- Skeleton for the single details card --- */}
      <Card className="shadow-sm border">
        <CardHeader>
          {/* Skeleton for the Card Title */}
          <Skeleton className="h-7 w-1/3" />
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Skeleton for Name Input */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" /> {/* Label */}
            <Skeleton className="h-10 w-full" /> {/* Input box */}
          </div>

          {/* Skeleton for Description Input */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" /> {/* Label */}
            <Skeleton className="h-10 w-full" /> {/* Input box */}
          </div>

          {/* Skeleton for Owner Select */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" /> {/* Label */}
            <Skeleton className="h-10 w-full" /> {/* Select box */}
          </div>

          {/* Skeleton for Photo Uploader */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-36" /> {/* Label */}
            <Skeleton className="h-48 w-full aspect-video rounded-md" />{" "}
            {/* Image preview area */}
          </div>
        </CardContent>
      </Card>

      {/* --- Skeleton for Action Buttons (Correctly Added) --- */}
      <div className="flex justify-end gap-4 pt-6 border-t">
        <Skeleton className="h-10 w-24" /> {/* "Cancel" Button Skeleton */}
        <Skeleton className="h-10 w-36" />{" "}
        {/* "Save changes" Button Skeleton */}
      </div>
    </div>
  );
};

export default EditRestaurantDetailsSkeleton;
