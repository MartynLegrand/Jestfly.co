
import React from "react";
import GlassCard from "@/components/ui/GlassCard";

const ProfileLoading = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <GlassCard>
        <div className="animate-pulse">
          <div className="h-32 w-32 bg-muted rounded-full mx-auto mb-4"></div>
          <div className="h-6 w-40 bg-muted rounded mx-auto mb-2"></div>
          <div className="h-4 w-24 bg-muted rounded mx-auto mb-6"></div>
          <div className="h-16 w-2/3 bg-muted rounded mx-auto"></div>
        </div>
      </GlassCard>
    </div>
  );
};

export default ProfileLoading;
