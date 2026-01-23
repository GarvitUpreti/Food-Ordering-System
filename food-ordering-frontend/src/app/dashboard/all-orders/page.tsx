'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { Order, OrderStatus } from '@/types/order.types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDate } from '@/lib/utils';
import { MapPin, Calendar, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AllOrdersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

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

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      setActionLoading(true);
      await api.patch(`/orders/${orderId}/status`, { status: newStatus });
      toast.success('Order status updated successfully');
      fetchOrders();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update order status');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    
    try {
      setActionLoading(true);
      await api.delete(`/orders/${orderId}`);
      toast.success('Order cancelled successfully');
      fetchOrders();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to cancel order');
    } finally {
      setActionLoading(false);
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

  const statusColors: Record<OrderStatus, string> = {
    CART: 'bg-gray-500',
    PLACED: 'bg-blue-500',
    CONFIRMED: 'bg-green-500',
    PREPARING: 'bg-yellow-500',
    DELIVERED: 'bg-green-600',
    CANCELLED: 'bg-red-500',
  };

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
            <Card key={order.id}>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{order.restaurant?.name || 'Restaurant'}</h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(order.createdAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {order.country}
                        </span>
                      </div>
                    </div>
                    <Badge className={statusColors[order.status]}>
                      {order.status}
                    </Badge>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-2 border-t pt-4">
                    {order.orderItems.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span>
                          {item.quantity}x {item.menuItem?.name}
                        </span>
                        <span className="font-semibold">{formatCurrency(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Footer with Actions */}
                  <div className="border-t pt-4 flex justify-between items-center">
                    <span className="text-lg font-bold">
                      Total: {formatCurrency(order.totalAmount)}
                    </span>

                    <div className="flex items-center gap-4">
                      {/* Status Dropdown */}
                      {order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">Update Status:</span>
                          <Select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                            disabled={actionLoading}
                            className="w-40"
                          >
                            <option value={OrderStatus.PLACED}>Placed</option>
                            <option value={OrderStatus.CONFIRMED}>Confirmed</option>
                            <option value={OrderStatus.PREPARING}>Preparing</option>
                            <option value={OrderStatus.DELIVERED}>Delivered</option>
                          </Select>
                        </div>
                      )}

                      {/* Cancel Button */}
                      {(order.status === 'PLACED' || order.status === 'CONFIRMED') && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleCancelOrder(order.id)}
                          disabled={actionLoading}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Cancel Order
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}