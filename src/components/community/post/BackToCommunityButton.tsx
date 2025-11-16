
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const BackToCommunityButton = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center gap-2">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => navigate("/community")}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Community
      </Button>
    </div>
  );
};

export default BackToCommunityButton;
