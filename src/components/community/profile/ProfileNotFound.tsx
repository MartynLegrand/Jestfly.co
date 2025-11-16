
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import GlassCard from "@/components/ui/GlassCard";
import { ArrowLeft } from "lucide-react";

const ProfileNotFound = () => {
  const navigate = useNavigate();
  
  return (
    <GlassCard className="max-w-4xl mx-auto">
      <div className="text-center py-8">
        <p className="text-lg font-semibold mb-2">User not found</p>
        <p className="text-muted-foreground mb-4">This user may not exist or has been removed.</p>
        <Button onClick={() => navigate("/community")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Community
        </Button>
      </div>
    </GlassCard>
  );
};

export default ProfileNotFound;
