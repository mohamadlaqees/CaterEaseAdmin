import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

const RestaurantCardGridSkeleton = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
      {/* Create an array of a specific length and map over it to generate skeletons */}
      {Array.from({ length: count }).map((_, index) => (
        <Card
          key={index}
          className="overflow-hidden shadow-lg flex flex-col animate-pulse"
        >
          <CardHeader>
            {/* Skeleton for the Image */}
            <Skeleton className="w-full h-40 rounded-t-lg" />
            {/* Skeleton for the Title */}
            <Skeleton className="h-6 w-3/4 mt-4" />
            {/* Skeleton for the Description */}
            <Skeleton className="h-4 w-1/2 mt-2" />
          </CardHeader>
          <CardContent className="flex-grow">
            {/* Skeleton for the Content (City) */}
            <Skeleton className="h-4 w-1/3" />
          </CardContent>
          <CardFooter>
            {/* Skeleton for the Button */}
            <Skeleton className="h-10 w-full" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default RestaurantCardGridSkeleton;
