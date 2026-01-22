import { Restaurant } from '@/types/restaurant.types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { MapPin } from 'lucide-react';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <div className="h-48 bg-gradient-to-r from-orange-400 to-pink-500 rounded-t-lg relative">
        <Badge className="absolute top-4 right-4" variant="secondary">
          <MapPin className="h-3 w-3 mr-1" />
          {restaurant.country}
        </Badge>
      </div>
      <CardHeader>
        <CardTitle>{restaurant.name}</CardTitle>
        <CardDescription>{restaurant.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Link href={`/dashboard/restaurants/${restaurant.id}`}>
          <Button className="w-full">View Menu</Button>
        </Link>
      </CardContent>
    </Card>
  );
}