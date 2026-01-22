import { Order, OrderStatus } from '@/types/order.types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate } from '@/lib/utils';
import { MapPin, Calendar } from 'lucide-react';

interface OrderCardProps {
  order: Order;
  onCancel?: (orderId: string) => void;
  canCancel?: boolean;
  loading?: boolean;
}

export default function OrderCard({ order, onCancel, canCancel = false, loading }: OrderCardProps) {
  const statusColors: Record<OrderStatus, string> = {
    CART: 'bg-gray-500',
    PLACED: 'bg-blue-500',
    CONFIRMED: 'bg-green-500',
    PREPARING: 'bg-yellow-500',
    DELIVERED: 'bg-green-600',
    CANCELLED: 'bg-red-500',
  };

  const canCancelOrder = canCancel && (order.status === 'PLACED' || order.status === 'CONFIRMED');

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{order.restaurant?.name || 'Restaurant'}</CardTitle>
            <CardDescription className="flex items-center gap-4 mt-2">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(order.createdAt)}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {order.country}
              </span>
            </CardDescription>
          </div>
          <Badge className={statusColors[order.status]}>
            {order.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {order.orderItems.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span>
                {item.quantity}x {item.menuItem?.name}
              </span>
              <span className="font-semibold">{formatCurrency(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="border-t pt-4 flex justify-between items-center">
          <span className="text-lg font-bold">Total: {formatCurrency(order.totalAmount)}</span>
          {canCancelOrder && onCancel && (
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => onCancel(order.id)}
              disabled={loading}
            >
              Cancel Order
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}