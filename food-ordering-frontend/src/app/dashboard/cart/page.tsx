'use client';

import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { Trash2, ShoppingBag, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { user } = useAuth();
  const { cart, updateCartItem, removeCartItem, checkout, loading } = useCart();
  const router = useRouter();

  const canCheckout = user?.role === 'ADMIN' || user?.role === 'MANAGER';

  const handleCheckout = async () => {
    if (!canCheckout) {
      toast.error('Only Managers and Admins can checkout orders');
      return;
    }

    try {
      await checkout();
      router.push('/dashboard/orders');
    } catch (error) {
      // Error handled in context
    }
  };

  if (!cart || cart.orderItems.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Shopping Cart</h1>
        <Card>
          <CardContent className="py-12 text-center">
            <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-lg">Your cart is empty</p>
            <Button className="mt-4" onClick={() => router.push('/dashboard/restaurants')}>
              Browse Restaurants
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Shopping Cart</h1>
        <p className="text-muted-foreground mt-1">
          {cart.orderItems.length} {cart.orderItems.length === 1 ? 'item' : 'items'} in your cart
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.orderItems.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{item.menuItem?.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.menuItem?.description}</p>
                    <p className="text-primary font-semibold mt-2">{formatCurrency(item.price)}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          if (item.quantity > 1) {
                            updateCartItem(item.id, item.quantity - 1);
                          }
                        }}
                        disabled={loading}
                      >
                        -
                      </Button>
                      <Input
                        type="number"
                        value={item.quantity}
                        className="w-16 text-center"
                        readOnly
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateCartItem(item.id, item.quantity + 1)}
                        disabled={loading}
                      >
                        +
                      </Button>
                    </div>
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => removeCartItem(item.id)}
                      disabled={loading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>Review your order before checkout</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">{formatCurrency(cart.totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax (10%)</span>
                  <span className="font-semibold">{formatCurrency(cart.totalAmount * 0.1)}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between text-lg">
                    <span className="font-bold">Total</span>
                    <span className="font-bold">{formatCurrency(cart.totalAmount * 1.1)}</span>
                  </div>
                </div>
              </div>

              {!canCheckout && (
                <Card className="bg-yellow-50 border-yellow-200">
                  <CardContent className="p-4">
                    <div className="flex gap-2">
                      <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-yellow-800">
                        <p className="font-semibold mb-1">Checkout Restricted</p>
                        <p>Only Managers and Admins can complete checkout. Please contact your manager to place this order.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Button 
                className="w-full" 
                size="lg"
                onClick={handleCheckout}
                disabled={!canCheckout || loading}
              >
                {canCheckout ? 'Proceed to Checkout' : 'Contact Manager to Checkout'}
              </Button>

              <div className="text-xs text-center text-muted-foreground">
                Your role: <Badge variant="outline">{user?.role}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}