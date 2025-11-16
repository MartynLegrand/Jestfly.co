
import React from "react";
import GlassCard from "@/components/ui/GlassCard";
import { Skeleton } from "@/components/ui/skeleton";

const PostDetailSkeleton = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <GlassCard>
        <div className="flex items-start gap-3 mb-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div>
            <Skeleton className="h-5 w-40 mb-1" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
        <Skeleton className="h-6 w-3/4 mb-3" />
        <Skeleton className="h-24 w-full" />
      </GlassCard>
      
      <GlassCard>
        <Skeleton className="h-6 w-32 mb-4" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-4 w-32 mb-1" />
                <Skeleton className="h-16 w-full" />
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};

export default PostDetailSkeleton;
