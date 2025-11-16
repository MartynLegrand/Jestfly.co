
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog';
import { format } from 'date-fns';

interface Order {
  id: string;
  user_id: string;
  status: string;
  total: number;
  created_at: string;
  user?: {
    email: string;
    display_name: string;
  };
  items?: OrderItem[];
}

interface OrderItem {
  id: string;
  product_id: string;
  order_id: string;
  quantity: number;
  price_at_time: number;
  product?: {
    title: string;
    image_url?: string;
  };
}

const OrderManagement = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderDetailsOpen, setOrderDetailsOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          user:profiles(email, display_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: 'Error',
        description: 'Failed to load orders',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderDetails = async (orderId: string) => {
    try {
      const { data: items, error } = await supabase
        .from('order_items')
        .select(`
          *,
          product:products(title, image_url)
        `)
        .eq('order_id', orderId);

      if (error) throw error;
      
      return items;
    } catch (error) {
      console.error('Error fetching order items:', error);
      toast({
        title: 'Error',
        description: 'Failed to load order details',
        variant: 'destructive',
      });
      return [];
    }
  };

  const viewOrderDetails = async (order: Order) => {
    const items = await fetchOrderDetails(order.id);
    setSelectedOrder({ ...order, items });
    setOrderDetailsOpen(true);
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);

      if (error) throw error;
      
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status } : order
      ));
      
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status });
      }
      
      toast({
        title: 'Success',
        description: `Order status updated to ${status}`,
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update order status',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'processing':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Processing</Badge>;
      case 'shipped':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800">Shipped</Badge>;
      case 'delivered':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Delivered</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Cancelled</Badge>;
      case 'paid':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Paid</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'PPP');
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Order Management</h2>
      </div>
      
      {loading ? (
        <div className="flex justify-center my-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="bg-card rounded-md shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                    No orders found.
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">
                      {order.id.slice(0, 8)}...
                    </TableCell>
                    <TableCell>
                      {order.user?.display_name || 'Unknown'}
                    </TableCell>
                    <TableCell>
                      {formatDate(order.created_at)}
                    </TableCell>
                    <TableCell>
                      ${order.total.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(order.status)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => viewOrderDetails(order)}
                        >
                          View Details
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
      
      <Dialog open={orderDetailsOpen} onOpenChange={setOrderDetailsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Order Information</h3>
                  <p className="mt-1">Order ID: {selectedOrder.id}</p>
                  <p>Date: {formatDate(selectedOrder.created_at)}</p>
                  <p>Total: ${selectedOrder.total.toFixed(2)}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Customer Information</h3>
                  <p className="mt-1">
                    Name: {selectedOrder.user?.display_name || 'N/A'}
                  </p>
                  <p>Email: {selectedOrder.user?.email || 'N/A'}</p>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                  <div className="flex items-center space-x-2">
                    <Select
                      defaultValue={selectedOrder.status}
                      onValueChange={(value) => updateOrderStatus(selectedOrder.id, value)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="mb-4">
                  {getStatusBadge(selectedOrder.status)}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Items</h3>
                <div className="bg-card border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead className="text-right">Subtotal</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrder.items && selectedOrder.items.length > 0 ? (
                        selectedOrder.items.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                {item.product?.image_url && (
                                  <img 
                                    src={item.product.image_url} 
                                    alt={item.product?.title || 'Product'} 
                                    className="h-10 w-10 rounded object-cover"
                                  />
                                )}
                                <span>{item.product?.title || 'Unknown Product'}</span>
                              </div>
                            </TableCell>
                            <TableCell>${item.price_at_time.toFixed(2)}</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell className="text-right">
                              ${(item.price_at_time * item.quantity).toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                            No items found for this order.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderManagement;
