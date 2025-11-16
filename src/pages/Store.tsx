
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import StoreHeader from "@/components/store/StoreHeader";
import JestCoinPromo from "@/components/store/JestCoinPromo";
import CategoryTabs from "@/components/store/CategoryTabs";
import StoreSidebar from "@/components/store/StoreSidebar";
import StoreFooter from "@/components/store/StoreFooter";

const Store = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  return (
    <MainLayout>
      <div className="space-y-8">
        <StoreHeader searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <JestCoinPromo />
        <CategoryTabs onCategoryChange={setCategory} />
        <StoreSidebar searchTerm={searchTerm} category={category} />
        <StoreFooter />
      </div>
    </MainLayout>
  );
};

export default Store;
