
import { Skeleton } from "@/components/ui/skeleton";
import GlassCard from "@/components/ui/GlassCard";

interface OrdersSkeletonProps {
  count?: number;
}

const OrdersSkeleton = ({ count = 3 }: OrdersSkeletonProps) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <GlassCard key={i} className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-10 w-28" />
          </div>
        </GlassCard>
      ))}
    </div>
  );
};

export default OrdersSkeleton;
