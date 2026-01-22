import { Country } from './auth.types';

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  country: Country;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  isAvailable: boolean;
  restaurant?: Restaurant;
}

export interface CreateRestaurantDto {
  name: string;
  description: string;
  country: Country;
  imageUrl?: string;
}

export interface CreateMenuItemDto {
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  isAvailable?: boolean;
}