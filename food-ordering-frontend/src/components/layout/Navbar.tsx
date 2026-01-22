'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, User, LogOut, Menu } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartItemsCount = cart?.orderItems?.length || 0;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center">
              <span className="text-2xl font-bold text-primary">🍔 FoodOrder</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user && (
              <>
                <Link href="/dashboard/restaurants">
                  <Button variant="ghost">Restaurants</Button>
                </Link>
                <Link href="/dashboard/orders">
                  <Button variant="ghost">My Orders</Button>
                </Link>
                {(user.role === 'ADMIN' || user.role === 'MANAGER') && (
                  <Link href="/dashboard/all-orders">
                    <Button variant="ghost">All Orders</Button>
                  </Link>
                )}
                {user.role === 'ADMIN' && (
                  <Link href="/dashboard/admin">
                    <Button variant="ghost">Admin</Button>
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {user && (
              <>
                <Link href="/dashboard/cart" className="relative">
                  <Button variant="ghost" size="icon">
                    <ShoppingCart className="h-5 w-5" />
                    {cartItemsCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0">
                        {cartItemsCount}
                      </Badge>
                    )}
                  </Button>
                </Link>

                <div className="flex items-center space-x-2">
                  <div className="hidden md:block text-right">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {user.role} • {user.country}
                    </p>
                  </div>
                  <Link href="/dashboard/profile">
                    <Button variant="ghost" size="icon">
                      <User className="h-5 w-5" />
                    </Button>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={logout}>
                    <LogOut className="h-5 w-5" />
                  </Button>
                </div>
              </>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && user && (
          <div className="md:hidden py-4 space-y-2">
            <Link href="/dashboard/restaurants" className="block">
              <Button variant="ghost" className="w-full justify-start">
                Restaurants
              </Button>
            </Link>
            <Link href="/dashboard/orders" className="block">
              <Button variant="ghost" className="w-full justify-start">
                My Orders
              </Button>
            </Link>
            {(user.role === 'ADMIN' || user.role === 'MANAGER') && (
              <Link href="/dashboard/all-orders" className="block">
                <Button variant="ghost" className="w-full justify-start">
                  All Orders
                </Button>
              </Link>
            )}
            {user.role === 'ADMIN' && (
              <Link href="/dashboard/admin" className="block">
                <Button variant="ghost" className="w-full justify-start">
                  Admin
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}