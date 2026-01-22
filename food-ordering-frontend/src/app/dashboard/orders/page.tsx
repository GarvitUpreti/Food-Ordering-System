'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { Order } from '@/types/order.types';
import OrderCard from '@/components/order/OrderCard';
import { Card, CardContent } from '@/components/ui/card';
import toast from 'react-hot-toast';

export default function MyOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelLoading, setCancelLoading] = useState(false);

  const canCancel = user?.role === 'ADMIN' || user?.role === 'MANAGER';

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get<Order[]>('/orders/my-orders');
      // Filter out CART orders
      setOrders(response.data.filter(order => order.status !== 'CART'));
    } catch (error: any) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!canCancel) {
      toast.error('Only Managers and Admins can cancel orders');
      return;
    }

    try {
      setCancelLoading(true);
      await api.delete(`/orders/${orderId}`);
      toast.success('Order cancelled successfully');
      fetchOrders();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to cancel order');
    } finally {
      setCancelLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Orders</h1>
        <p className="text-muted-foreground mt-1">View your order history</p>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">You haven't placed any orders yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard 
              key={order.id} 
              order={order}
              onCancel={handleCancelOrder}
              canCancel={canCancel}
              loading={cancelLoading}
            />
          ))}
        </div>
      )}
    </div>
  );
}