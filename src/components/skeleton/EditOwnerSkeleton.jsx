// src/components/skeleton/EditOwnerSkeleton.jsx

import { Skeleton } from "@/components/ui/skeleton";

const EditOwnerSkeleton = () => {
  return (
    <div className=" p-8  animate-pulse">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
          {/* Title Skeleton */}
          <Skeleton className="h-9 w-48" />
          {/* Breadcrumbs Skeleton */}
          <div className="flex items-center gap-2 mt-2 sm:mt-0">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-5 w-24" />
          </div>
        </header>

        {/* Form Body Skeleton */}
        <div className="p-6 md:p-8 space-y-8 bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Input Field Skeleton (for Name) */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-20 rounded-lg" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>

            {/* Input Field Skeleton (for Email) */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-24 rounded-lg" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>

            {/* Input Field Skeleton (for Phone) */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-28 rounded-lg" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>

            {/* Radio Group Skeleton (for Gender) */}
            <div className="space-y-3">
              <Skeleton className="h-4 w-16 rounded-lg" />
              <div className="flex space-x-4 pt-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-5 rounded-full" />
                  <Skeleton className="h-4 w-12 rounded-lg" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-5 rounded-full" />
                  <Skeleton className="h-4 w-16 rounded-lg" />
                </div>
              </div>
            </div>

            {/* Password Field Skeleton (Full Width) */}
            <div className="sm:col-span-2 space-y-2">
              <Skeleton className="h-4 w-40 rounded-lg" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          </div>
        </div>

        {/* Footer Skeleton */}
        <div className="flex items-center justify-end gap-4 p-6 bg-gray-50/50 border-t border-gray-200 rounded-b-xl">
          <Skeleton className="h-10 w-24 rounded-md" />
          <Skeleton className="h-10 w-32 rounded-md" />
        </div>
      </div>
    </div>
  );
};

export default EditOwnerSkeleton;
