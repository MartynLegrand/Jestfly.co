
import React from "react";
import { useNavigate } from "react-router-dom";
import GlassCard from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const PostNotFound = () => {
  const navigate = useNavigate();
  
  return (
    <GlassCard className="max-w-3xl mx-auto">
      <div className="text-center py-8">
        <p className="text-lg font-semibold mb-2">Post not found</p>
        <p className="text-muted-foreground mb-4">This post may have been removed or doesn't exist.</p>
        <Button onClick={() => navigate("/community")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Community
        </Button>
      </div>
    </GlassCard>
  );
};

export default PostNotFound;
