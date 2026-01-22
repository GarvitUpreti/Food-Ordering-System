'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import toast from 'react-hot-toast';

// Demo credentials for easy testing
const DEMO_USERS = [
  { email: 'nick.fury@avengers.com', password: 'admin123', role: 'Admin', country: 'America' },
  { email: 'captain.marvel@avengers.com', password: 'manager123', role: 'Manager', country: 'India' },
  { email: 'captain.america@avengers.com', password: 'manager123', role: 'Manager', country: 'America' },
  { email: 'thanos@avengers.com', password: 'member123', role: 'Member', country: 'India' },
  { email: 'thor@avengers.com', password: 'member123', role: 'Member', country: 'India' },
  { email: 'travis@avengers.com', password: 'member123', role: 'Member', country: 'America' },
];

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login({ email, password });
      toast.success('Login successful!');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8">
        {/* Login Form */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-3xl">Welcome Back! 🍔</CardTitle>
            <CardDescription>Login to order delicious food</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nick.fury@avengers.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Demo Accounts */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>🎯 Demo Accounts</CardTitle>
            <CardDescription>Click to auto-fill credentials and test RBAC</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {DEMO_USERS.map((user, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full justify-start text-left h-auto py-3"
                onClick={() => quickLogin(user.email, user.password)}
              >
                <div className="flex flex-col items-start">
                  <span className="font-semibold">{user.email.split('@')[0]}</span>
                  <span className="text-xs text-muted-foreground">
                    {user.role} • {user.country}
                  </span>
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}