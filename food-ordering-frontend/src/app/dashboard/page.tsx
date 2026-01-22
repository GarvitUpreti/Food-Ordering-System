'use client';

import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Store, ShoppingBag, Package, Settings } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {user?.name}! 👋</h1>
        <p className="text-muted-foreground mt-2">
          Role: <span className="font-semibold">{user?.role}</span> • Country: <span className="font-semibold">{user?.country}</span>
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Restaurants Card */}
        <Link href="/dashboard/restaurants">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <Store className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Browse Restaurants</CardTitle>
              <CardDescription>
                Explore restaurants {user?.role !== 'ADMIN' && `in ${user?.country}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">View Restaurants</Button>
            </CardContent>
          </Card>
        </Link>

        {/* My Orders Card */}
        <Link href="/dashboard/orders">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <ShoppingBag className="h-10 w-10 text-primary mb-2" />
              <CardTitle>My Orders</CardTitle>
              <CardDescription>View your order history</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">View Orders</Button>
            </CardContent>
          </Card>
        </Link>

        {/* All Orders (Manager/Admin) */}
        {(user?.role === 'MANAGER' || user?.role === 'ADMIN') && (
          <Link href="/dashboard/all-orders">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <Package className="h-10 w-10 text-primary mb-2" />
                <CardTitle>All Orders</CardTitle>
                <CardDescription>
                  Manage orders {user?.role === 'MANAGER' && `in ${user?.country}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Manage Orders</Button>
              </CardContent>
            </Card>
          </Link>
        )}

        {/* Admin Panel */}
        {user?.role === 'ADMIN' && (
          <Link href="/dashboard/admin">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-primary">
              <CardHeader>
                <Settings className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Admin Panel</CardTitle>
                <CardDescription>Manage users and restaurants</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Admin Settings</Button>
              </CardContent>
            </Card>
          </Link>
        )}
      </div>

      {/* RBAC Info Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle>🔐 Your Access Level</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between">
            <span>View Restaurants & Menu</span>
            <span className="text-green-600 font-semibold">✓ Allowed</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Create Orders</span>
            <span className="text-green-600 font-semibold">✓ Allowed</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Checkout & Pay</span>
            <span className={user?.role === 'MEMBER' ? 'text-red-600 font-semibold' : 'text-green-600 font-semibold'}>
              {user?.role === 'MEMBER' ? '✗ Contact Manager' : '✓ Allowed'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>Cancel Orders</span>
            <span className={user?.role === 'MEMBER' ? 'text-red-600 font-semibold' : 'text-green-600 font-semibold'}>
              {user?.role === 'MEMBER' ? '✗ Contact Manager' : '✓ Allowed'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>Update Payment Method</span>
            <span className={user?.role === 'ADMIN' ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
              {user?.role === 'ADMIN' ? '✓ Allowed' : '✗ Admin Only'}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}