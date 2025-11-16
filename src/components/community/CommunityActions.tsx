
import { Button } from "@/components/ui/button";
import CategoryTabs from "@/components/community/CategoryTabs";
import { Plus } from "lucide-react";

interface CommunityActionsProps {
  onCreatePost: () => void;
  onCategoryChange: (category: string | null) => void;
}

const CommunityActions = ({ onCreatePost, onCategoryChange }: CommunityActionsProps) => {
  return (
    <div className="flex items-center justify-between">
      <CategoryTabs onCategoryChange={onCategoryChange} />
      <Button onClick={onCreatePost} className="gap-1">
        <Plus className="h-4 w-4" /> New Post
      </Button>
    </div>
  );
};

export default CommunityActions;
