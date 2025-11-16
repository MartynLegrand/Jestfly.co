
import GlassCard from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";

const JestCoinPromo = () => {
  return (
    <div className="mb-10">
      <GlassCard className="bg-gradient to-purple-600 p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/20 backdrop-blur-sm"></div>
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Support Creators with JestCoin
          </h2>
          <p className="text-white/80 mb-4">
            Use JestCoin to purchase exclusive digital collectibles, unlock premium content, and directly support your favorite artists.
          </p>
          <Button className="bg-white text-primary hover:bg-white/90">
            Get JestCoin
          </Button>
        </div>
      </GlassCard>
    </div>
  );
};

export default JestCoinPromo;
