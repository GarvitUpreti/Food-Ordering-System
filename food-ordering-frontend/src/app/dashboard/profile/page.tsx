'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { PaymentMethod } from '@/types/payment.types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { User, CreditCard, MapPin, Shield, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardHolderName: '',
    expiryDate: '',
    cvv: '',
  });

  const canUpdatePayment = user?.role === 'ADMIN';

  useEffect(() => {
    fetchPaymentMethod();
  }, []);

  const fetchPaymentMethod = async () => {
    try {
      const response = await api.get<PaymentMethod>('/payment-methods');
      setPaymentMethod(response.data);
      setFormData({
        cardNumber: response.data.cardNumber,
        cardHolderName: response.data.cardHolderName,
        expiryDate: response.data.expiryDate,
        cvv: '***',
      });
    } catch (error: any) {
      // No payment method exists
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canUpdatePayment) {
      toast.error('Only Admins can update payment methods');
      return;
    }

    try {
      if (paymentMethod) {
        await api.put('/payment-methods', formData);
        toast.success('Payment method updated successfully');
      } else {
        await api.post('/payment-methods', formData);
        toast.success('Payment method created successfully');
      }
      setEditMode(false);
      fetchPaymentMethod();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update payment method');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your account and payment information</p>
      </div>

      {/* User Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            User Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Name</Label>
              <p className="text-lg font-semibold">{user?.name}</p>
            </div>
            <div>
              <Label>Email</Label>
              <p className="text-lg font-semibold">{user?.email}</p>
            </div>
            <div>
              <Label>Role</Label>
              <div className="flex items-center gap-2 mt-1">
                <Shield className="h-4 w-4" />
                <Badge>{user?.role}</Badge>
              </div>
            </div>
            <div>
              <Label>Country</Label>
              <div className="flex items-center gap-2 mt-1">
                <MapPin className="h-4 w-4" />
                <Badge variant="outline">{user?.country}</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Method Card */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Method
              </CardTitle>
              <CardDescription>
                {canUpdatePayment 
                  ? 'Manage your payment information' 
                  : 'View your payment information (Admin-only editing)'}
              </CardDescription>
            </div>
            {paymentMethod && !editMode && (
              <Button 
                variant="outline" 
                onClick={() => setEditMode(true)}
                disabled={!canUpdatePayment}
              >
                {canUpdatePayment ? 'Edit' : 'View Only'}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : editMode || !paymentMethod ? (
            <form onSubmit={handleUpdatePayment} className="space-y-4">
              {!canUpdatePayment && (
                <Card className="bg-yellow-50 border-yellow-200">
                  <CardContent className="p-4">
                    <div className="flex gap-2">
                      <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
                      <p className="text-sm text-yellow-800">
                        Only Admins can update payment methods. Contact your administrator to make changes.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  placeholder="4111 1111 1111 1111"
                  value={formData.cardNumber}
                  onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                  disabled={!canUpdatePayment}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cardHolderName">Card Holder Name</Label>
                <Input
                  id="cardHolderName"
                  placeholder="John Doe"
                  value={formData.cardHolderName}
                  onChange={(e) => setFormData({ ...formData, cardHolderName: e.target.value })}
                  disabled={!canUpdatePayment}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    placeholder="12/25"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    disabled={!canUpdatePayment}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    value={formData.cvv}
                    onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                    disabled={!canUpdatePayment}
                    required
                  />
                </div>
              </div>
              <div className="flex gap-2">
                {canUpdatePayment && (
                  <Button type="submit">
                    {paymentMethod ? 'Update Payment Method' : 'Add Payment Method'}
                  </Button>
                )}
                {editMode && (
                  <Button type="button" variant="outline" onClick={() => setEditMode(false)}>
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg">
                <p className="text-sm opacity-80 mb-2">Card Number</p>
                <p className="text-xl font-mono mb-4">•••• •••• •••• {paymentMethod.cardNumber}</p>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs opacity-80">Card Holder</p>
                    <p className="font-semibold">{paymentMethod.cardHolderName}</p>
                  </div>
                  <div>
                    <p className="text-xs opacity-80">Expiry</p>
                    <p className="font-semibold">{paymentMethod.expiryDate}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Access Permissions Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle>🔐 Your Access Permissions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span>View Restaurants & Menu</span>
            <Badge variant="outline" className="bg-green-100 text-green-800">✓ Allowed</Badge>
          </div>
          <div className="flex justify-between">
            <span>Create Orders</span>
            <Badge variant="outline" className="bg-green-100 text-green-800">✓ Allowed</Badge>
          </div>
          <div className="flex justify-between">
            <span>Checkout & Pay</span>
            <Badge variant="outline" className={user?.role === 'MEMBER' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
              {user?.role === 'MEMBER' ? '✗ Restricted' : '✓ Allowed'}
            </Badge>
          </div>
          <div className="flex justify-between">
            <span>Cancel Orders</span>
            <Badge variant="outline" className={user?.role === 'MEMBER' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
              {user?.role === 'MEMBER' ? '✗ Restricted' : '✓ Allowed'}
            </Badge>
          </div>
          <div className="flex justify-between">
            <span>Update Payment Method</span>
            <Badge variant="outline" className={user?.role === 'ADMIN' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
              {user?.role === 'ADMIN' ? '✓ Allowed' : '✗ Admin Only'}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}