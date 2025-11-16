
import { Skeleton } from "@/components/ui/skeleton";

const EventListSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
      {[1, 2, 3, 4, 5, 6].map((n) => (
        <div key={n} className="h-[400px] bg-muted rounded-lg" />
      ))}
    </div>
  );
};

export default EventListSkeleton;
