import { MenuItem } from '@/types/restaurant.types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { ShoppingCart } from 'lucide-react';

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
  loading?: boolean;
}

export default function MenuItemCard({ item, onAddToCart, loading }: MenuItemCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <div className="h-40 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-t-lg flex items-center justify-center">
        <span className="text-6xl">{getCategoryEmoji(item.category)}</span>
      </div>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{item.name}</CardTitle>
          <Badge variant={item.isAvailable ? 'default' : 'destructive'}>
            {item.isAvailable ? 'Available' : 'Unavailable'}
          </Badge>
        </div>
        <CardDescription className="line-clamp-2">{item.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-primary">{formatCurrency(item.price)}</span>
          <Button 
            onClick={() => onAddToCart(item)} 
            disabled={!item.isAvailable || loading}
            size="sm"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function getCategoryEmoji(category: string): string {
  const emojis: Record<string, string> = {
    'Appetizer': '🥗',
    'Main Course': '🍛',
    'Dessert': '🍰',
    'Beverage': '🥤',
    'Pizza': '🍕',
    'Burger': '🍔',
    'Pasta': '🍝',
    'Salad': '🥗',
    'Soup': '🍜',
    'Seafood': '🦐',
    'default': '🍽️'
  };
  return emojis[category] || emojis['default'];
}