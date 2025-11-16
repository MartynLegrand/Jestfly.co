
import { useAuth } from "@/context/AuthContext";
import MainLayout from "@/components/layout/MainLayout";
import OrderCard from "@/components/store/OrderCard";
import EmptyOrderState from "@/components/store/EmptyOrderState";
import OrdersSkeleton from "@/components/store/OrdersSkeleton";
import { useOrders } from "@/hooks/use-orders";

const StoreOrders = () => {
  const { user } = useAuth();
  const { 
    orders, 
    expandedOrder, 
    orderItems, 
    isLoading, 
    handleExpandOrder 
  } = useOrders(user?.id);
  
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Your Orders</h1>
        <p className="text-muted-foreground mb-8">
          View and manage your orders
        </p>
        
        {isLoading ? (
          <OrdersSkeleton />
        ) : orders.length === 0 ? (
          <EmptyOrderState />
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <OrderCard 
                key={order.id}
                order={order}
                orderItems={orderItems[order.id]}
                isLoadingItems={expandedOrder === order.id && !orderItems[order.id]}
                onExpand={handleExpandOrder}
                isExpanded={expandedOrder === order.id}
              />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default StoreOrders;
