import { Skeleton } from "@/components/ui/skeleton";
import { Mail, Phone, User, Calendar, ShieldCheck } from "lucide-react";

export const OwnerDetailsSkeleton = () => {
  return (
    <main className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8 animate-pulse">
      <div className="max-w-7xl mx-auto">
        {/* --- Header & Breadcrumbs Skeleton --- */}
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* --- Left Column: Profile Card Skeleton --- */}
          <div className="lg:col-span-1 space-y-8">
            <section className="bg-white border border-gray-200 rounded-xl shadow-sm">
              <div className="p-6 flex flex-col items-center text-center relative">
                {/* Profile Picture Skeleton */}
                <Skeleton className="w-28 h-28 rounded-full border-4 border-white shadow-lg -mt-16" />
                {/* Name Skeleton */}
                <Skeleton className="mt-4 h-7 w-40" />
                {/* Role Skeleton */}
                <Skeleton className="mt-2 h-5 w-24" />
                {/* Status Badge Skeleton */}
                <Skeleton className="mt-4 h-6 w-20 rounded-full" />
              </div>
              <div className="border-t border-gray-200 p-6">
                {/* Section Title Skeleton */}
                <Skeleton className="h-6 w-32 mb-4" />
                <div className="space-y-5">
                  {/* Detail Item Skeleton */}
                  <div className="flex items-center gap-4">
                    <Calendar className="h-8 w-8 text-gray-300" />
                    <div className="flex-grow space-y-2">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-5 w-2/3" />
                    </div>
                  </div>
                  {/* Detail Item Skeleton */}
                  <div className="flex items-center gap-4">
                    <ShieldCheck className="h-8 w-8 text-gray-300" />
                    <div className="flex-grow space-y-2">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-5 w-3/4" />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* --- Right Column: Information Skeleton --- */}
          <div className="lg:col-span-2">
            <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
              {/* Section Title Skeleton */}
              <Skeleton className="h-7 w-48 mb-6" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Detail Item Skeleton */}
                <div className="flex items-center gap-4">
                  <User className="h-8 w-8 text-gray-300" />
                  <div className="flex-grow space-y-2">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-5 w-2/3" />
                  </div>
                </div>
                {/* Detail Item Skeleton */}
                <div className="flex items-center gap-4">
                  <Mail className="h-8 w-8 text-gray-300" />
                  <div className="flex-grow space-y-2">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-5 w-3/4" />
                  </div>
                </div>
                {/* Detail Item Skeleton */}
                <div className="flex items-center gap-4">
                  <Phone className="h-8 w-8 text-gray-300" />
                  <div className="flex-grow space-y-2">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-5 w-1/2" />
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
};
