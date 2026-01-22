import { Country } from './auth.types';
import { MenuItem } from './restaurant.types';

export enum OrderStatus {
  CART = 'CART',
  PLACED = 'PLACED',
  CONFIRMED = 'CONFIRMED',
  PREPARING = 'PREPARING',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export interface OrderItem {
  id: string;
  orderId: string;
  menuItemId: string;
  quantity: number;
  price: number;
  menuItem?: MenuItem;
}

export interface Order {
  id: string;
  userId: string;
  restaurantId: string;
  status: OrderStatus;
  totalAmount: number;
  country: Country;
  createdAt: string;
  updatedAt: string;
  orderItems: OrderItem[];
  restaurant?: {
    id: string;
    name: string;
    country: Country;
  };
}

export interface CreateOrderDto {
  restaurantId: string;
}

export interface AddOrderItemDto {
  menuItemId: string;
  quantity: number;
}

export interface UpdateOrderItemDto {
  quantity: number;
}