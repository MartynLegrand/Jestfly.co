
import ProductGrid from "@/components/store/ProductGrid";

interface StoreSidebarProps {
  searchTerm: string;
  category: string | null;
}

const StoreSidebar = ({ searchTerm, category }: StoreSidebarProps) => {
  return (
    <div className="mt-4">
      <ProductGrid searchTerm={searchTerm} category={category || undefined} />
    </div>
  );
};

export default StoreSidebar;
