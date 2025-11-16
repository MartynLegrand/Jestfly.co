
import TopSellers from "@/components/store/TopSellers";
import ComingSoon from "@/components/store/ComingSoon";

const StoreFooter = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
      <TopSellers />
      <ComingSoon />
    </div>
  );
};

export default StoreFooter;
