import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, index) => (
        <Card key={index} className="overflow-hidden">
          {/* Image Skeleton */}
          <Skeleton className="aspect-square w-full" />
          
          {/* Content Skeleton */}
          <CardHeader className="p-4 pb-0 space-y-2">
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-40" />
              </div>
              <Skeleton className="h-5 w-16" />
            </div>
          </CardHeader>

          <CardContent className="p-4 pt-3 space-y-3">
            {/* Token ID Section Skeleton */}
            <div className="flex items-center gap-2 p-2 rounded-md border bg-muted/30">
              <div className="flex-1 space-y-1">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>

            {/* Attributes Section Skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-3 w-16" />
              <div className="flex flex-wrap gap-1">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-18" />
                <Skeleton className="h-6 w-16" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};