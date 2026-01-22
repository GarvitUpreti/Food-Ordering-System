'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Order, OrderItem, AddOrderItemDto } from '@/types/order.types';
import { api } from '@/lib/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

interface CartContextType {
  cart: Order | null;
  loading: boolean;
  addToCart: (restaurantId: string, item: AddOrderItemDto) => Promise<void>;
  updateCartItem: (itemId: string, quantity: number) => Promise<void>;
  removeCartItem: (itemId: string) => Promise<void>;
  clearCart: () => void;
  refreshCart: () => Promise<void>;
  checkout: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      refreshCart();
    }
  }, [user]);

  const refreshCart = async () => {
    try {
      const response = await api.get<Order[]>('/orders/my-orders');
      const cartOrder = response.data.find(order => order.status === 'CART');
      setCart(cartOrder || null);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    }
  };

  const addToCart = async (restaurantId: string, item: AddOrderItemDto) => {
    try {
      setLoading(true);
      
      // If no cart exists, create one
      if (!cart) {
        const createResponse = await api.post<Order>('/orders', { restaurantId });
        const newCart = createResponse.data;
        
        // Add item to new cart
        await api.post(`/orders/${newCart.id}/items`, item);
        await refreshCart();
        toast.success('Item added to cart!');
      } else {
        // Check if cart is from same restaurant
        if (cart.restaurantId !== restaurantId) {
          toast.error('Please complete your current order before ordering from another restaurant');
          return;
        }
        
        // Add item to existing cart
        await api.post(`/orders/${cart.id}/items`, item);
        await refreshCart();
        toast.success('Item added to cart!');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add item to cart');
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (itemId: string, quantity: number) => {
    if (!cart) return;
    
    try {
      setLoading(true);
      await api.patch(`/orders/${cart.id}/items/${itemId}`, { quantity });
      await refreshCart();
      toast.success('Cart updated!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update cart');
    } finally {
      setLoading(false);
    }
  };

  const removeCartItem = async (itemId: string) => {
    if (!cart) return;
    
    try {
      setLoading(true);
      await api.delete(`/orders/${cart.id}/items/${itemId}`);
      await refreshCart();
      toast.success('Item removed from cart!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to remove item');
    } finally {
      setLoading(false);
    }
  };

  const clearCart = () => {
    setCart(null);
  };

  const checkout = async () => {
    if (!cart) return;
    
    try {
      setLoading(true);
      await api.post(`/orders/${cart.id}/checkout`);
      toast.success('Order placed successfully!');
      clearCart();
      await refreshCart();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to checkout');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider value={{
      cart,
      loading,
      addToCart,
      updateCartItem,
      removeCartItem,
      clearCart,
      refreshCart,
      checkout,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}