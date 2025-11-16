
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CategoryTabsProps {
  onCategoryChange: (category: string | null) => void;
}

const CategoryTabs = ({ onCategoryChange }: CategoryTabsProps) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  const handleCategoryChange = (category: string) => {
    const newCategory = category === "all" ? null : category;
    setActiveCategory(newCategory);
    onCategoryChange(newCategory);
  };
  
  return (
    <div className="mb-6 overflow-x-auto pb-2">
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="h-9">
          <TabsTrigger 
            value="all" 
            className="px-3 py-1.5"
            onClick={() => handleCategoryChange("all")}
          >
            All
          </TabsTrigger>
          <TabsTrigger 
            value="general" 
            className="px-3 py-1.5"
            onClick={() => handleCategoryChange("general")}
          >
            General
          </TabsTrigger>
          <TabsTrigger 
            value="music" 
            className="px-3 py-1.5"
            onClick={() => handleCategoryChange("music")}
          >
            Music
          </TabsTrigger>
          <TabsTrigger 
            value="events" 
            className="px-3 py-1.5"
            onClick={() => handleCategoryChange("events")}
          >
            Events
          </TabsTrigger>
          <TabsTrigger 
            value="collaborations" 
            className="px-3 py-1.5"
            onClick={() => handleCategoryChange("collaborations")}
          >
            Collaborations
          </TabsTrigger>
          <TabsTrigger 
            value="questions" 
            className="px-3 py-1.5"
            onClick={() => handleCategoryChange("questions")}
          >
            Questions
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default CategoryTabs;
