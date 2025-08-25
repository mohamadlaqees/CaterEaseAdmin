// src/components/skeleton/RestaurantCardSkeleton.jsx

import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

const RestaurantCardSkeleton = () => {
  return (
    <div className="animate-pulse">
      <Card>
        <CardHeader>
          <Skeleton className="h-40 w-full rounded-t-lg" />
          <Skeleton className="h-6 w-3/4 mt-4" />
          <Skeleton className="h-4 w-1/2 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-full" />
        </CardContent>
        <CardFooter>
          <Skeleton className="h-10 w-full" />
        </CardFooter>
      </Card>
    </div>
  );
};

export default RestaurantCardSkeleton;
