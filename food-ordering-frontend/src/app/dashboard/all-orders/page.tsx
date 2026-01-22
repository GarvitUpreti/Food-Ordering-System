'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { Order } from '@/types/order.types';
import OrderCard from '@/components/order/OrderCard';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import toast from 'react-hot-toast';

export default function AllOrdersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelLoading, setCancelLoading] = useState(false);

  const canAccess = user?.role === 'ADMIN' || user?.role === 'MANAGER';

  useEffect(() => {
    if (!canAccess) {
      toast.error('Access denied: Managers and Admins only');
      router.push('/dashboard');
      return;
    }
    fetchOrders();
  }, [canAccess]);

  const fetchOrders = async () => {
    try {
      const response = await api.get<Order[]>('/orders');
      // Filter out CART orders
      setOrders(response.data.filter(order => order.status !== 'CART'));
    } catch (error: any) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
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

  if (!canAccess) {
    return null;
  }

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
        <h1 className="text-3xl font-bold">All Orders</h1>
        <p className="text-muted-foreground mt-1">
          {user?.role === 'ADMIN' 
            ? 'Orders from all countries' 
            : `Orders from ${user?.country}`}
        </p>
        <Badge variant="outline" className="mt-2">
          Total: {orders.length} orders
        </Badge>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No orders found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard 
              key={order.id} 
              order={order}
              onCancel={handleCancelOrder}
              canCancel={true}
              loading={cancelLoading}
            />
          ))}
        </div>
      )}
    </div>
  );
}