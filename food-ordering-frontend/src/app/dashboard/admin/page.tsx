'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Store, Package, CreditCard } from 'lucide-react';

export default function AdminPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user?.role !== 'ADMIN') {
      router.push('/dashboard');
    }
  }, [user, router]);

  if (user?.role !== 'ADMIN') {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <p className="text-muted-foreground mt-1">Manage your entire platform</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <Users className="h-10 w-10 text-primary mb-2" />
            <CardTitle>User Management</CardTitle>
            <CardDescription>View and manage all users</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Create, update, and delete user accounts. Manage roles and permissions.
            </p>
            <Button className="w-full" disabled>
              Manage Users (Coming Soon)
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <Store className="h-10 w-10 text-primary mb-2" />
            <CardTitle>Restaurant Management</CardTitle>
            <CardDescription>Manage restaurants across all countries</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Add, edit, and remove restaurants. Manage menu items and pricing.
            </p>
            <Button className="w-full" disabled>
              Manage Restaurants (Coming Soon)
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <Package className="h-10 w-10 text-primary mb-2" />
            <CardTitle>Order Management</CardTitle>
            <CardDescription>View all orders from all countries</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Monitor and manage orders. Update order statuses and handle cancellations.
            </p>
            <Button className="w-full" onClick={() => router.push('/dashboard/all-orders')}>
              View All Orders
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CreditCard className="h-10 w-10 text-primary mb-2" />
            <CardTitle>Payment Management</CardTitle>
            <CardDescription>Manage payment methods</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              View and update payment information for all users.
            </p>
            <Button className="w-full" onClick={() => router.push('/dashboard/profile')}>
              Payment Settings
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardHeader>
          <CardTitle>🎯 Admin Privileges</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Full access to all restaurants and menu items (all countries)</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>View and manage all orders across all countries</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Update payment methods for all users</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Cancel any order regardless of status</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Create, update, and delete users and restaurants</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}