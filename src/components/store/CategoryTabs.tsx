
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CategoryTabsProps {
  onCategoryChange?: (category: string | null) => void;
}

const CategoryTabs = ({ onCategoryChange }: CategoryTabsProps) => {
  return (
    <Tabs defaultValue="all" className="mb-8" onValueChange={(value) => onCategoryChange?.(value === "all" ? null : value)}>
      <TabsList className="w-full justify-start overflow-x-auto">
        <TabsTrigger value="all">All Products</TabsTrigger>
        <TabsTrigger value="digital">Digital</TabsTrigger>
        <TabsTrigger value="physical">Physical</TabsTrigger>
        <TabsTrigger value="nft">NFTs</TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default CategoryTabs;
