'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useCart } from '@/context/CartContext';
import { Restaurant, MenuItem } from '@/types/restaurant.types';
import MenuItemCard from '@/components/menu/MenuItemCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RestaurantMenuPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart, loading: cartLoading } = useCart();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRestaurantAndMenu();
  }, [params.id]);

  const fetchRestaurantAndMenu = async () => {
    try {
      const [restaurantRes, menuRes] = await Promise.all([
        api.get<Restaurant>(`/restaurants/${params.id}`),
        api.get<MenuItem[]>(`/menu-items?restaurantId=${params.id}`)
      ]);
      setRestaurant(restaurantRes.data);
      setMenuItems(menuRes.data);
    } catch (error: any) {
      toast.error('Failed to fetch menu');
      router.push('/dashboard/restaurants');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (item: MenuItem) => {
    if (!restaurant) return;
    await addToCart(restaurant.id, { menuItemId: item.id, quantity: 1 });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!restaurant) return null;

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => router.back()}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Restaurants
      </Button>

      <div className="bg-gradient-to-r from-orange-400 to-pink-500 rounded-lg p-8 text-white">
        <Badge variant="secondary" className="mb-4">
          <MapPin className="h-3 w-3 mr-1" />
          {restaurant.country}
        </Badge>
        <h1 className="text-4xl font-bold mb-2">{restaurant.name}</h1>
        <p className="text-lg opacity-90">{restaurant.description}</p>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Menu Items</h2>
        {menuItems.length === 0 ? (
          <p className="text-muted-foreground text-center py-12">No menu items available</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item) => (
              <MenuItemCard 
                key={item.id} 
                item={item} 
                onAddToCart={handleAddToCart}
                loading={cartLoading}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}