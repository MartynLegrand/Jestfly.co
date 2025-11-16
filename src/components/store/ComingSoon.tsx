
import GlassCard from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";

const ComingSoon = () => {
  return (
    <GlassCard>
      <h2 className="text-xl font-semibold mb-4">Coming Soon</h2>
      <div className="space-y-2">
        <p className="text-sm">• NFT Gallery Launch - May 2023</p>
        <p className="text-sm">• Virtual Concert Platform - June 2023</p>
        <p className="text-sm">• Creator Collaboration Tools - July 2023</p>
      </div>
      <Button variant="outline" className="mt-4 w-full">
        Get Notified
      </Button>
    </GlassCard>
  );
};

export default ComingSoon;
