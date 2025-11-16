
import { Skeleton } from "@/components/ui/skeleton";

const ProductSkeleton = () => {
  return (
    <>
      <div className="grid md:grid-cols-2 gap-8">
        <Skeleton className="aspect-square rounded-lg" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-8 w-1/3" />
          <div className="mt-6 pt-6 border-t border-border">
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductSkeleton;
