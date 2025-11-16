
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import CartIcon from "@/components/store/CartIcon";

interface StoreHeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const StoreHeader = ({ searchTerm, setSearchTerm }: StoreHeaderProps) => {
  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">JESTFLY Store</h1>
        <p className="text-muted-foreground">
          Discover digital collectibles and exclusive content from your favorite artists
        </p>
      </div>
      <div className="flex items-center gap-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search store..." 
            className="pl-9 w-[200px]" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <CartIcon />
      </div>
    </div>
  );
};

export default StoreHeader;
