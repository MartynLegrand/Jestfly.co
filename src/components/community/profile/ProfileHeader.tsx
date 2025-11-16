
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ProfileHeaderProps {
  title?: string;
}

const ProfileHeader = ({ title }: ProfileHeaderProps) => {
  const navigate = useNavigate();
  
  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={() => navigate("/community")}
      className="mb-4"
    >
      <ArrowLeft className="mr-2 h-4 w-4" /> Back to Community
    </Button>
  );
};

export default ProfileHeader;
