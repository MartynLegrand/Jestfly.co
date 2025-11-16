
import GlassCard from "@/components/ui/GlassCard";
import { Music, Star } from "lucide-react";

const TopSellers = () => {
  return (
    <GlassCard className="lg:col-span-2">
      <h2 className="text-xl font-semibold mb-4">Top Sellers</h2>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-md bg-primary/20 flex items-center justify-center">
                <Music className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Exclusive Track #{i}</h3>
                <p className="text-xs text-muted-foreground">1,200+ sold</p>
              </div>
            </div>
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-400 mr-1" />
              <span className="text-sm">{4 + (i * 0.1).toFixed(1)}</span>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};

export default TopSellers;
