'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Country, Role } from '@/types/auth.types';
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
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [country, setCountry] = useState(Country.INDIA);
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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Register as MEMBER only
      await api.post('/auth/register', {
        email,
        password,
        name,
        role: Role.MEMBER, // Force MEMBER role
        country,
      });

      toast.success('Account created! Please login.');
      
      // Switch to login mode
      setIsRegisterMode(false);
      // Keep email and password filled for easy login
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setIsRegisterMode(false); // Switch to login mode
  };

  const toggleMode = () => {
    setIsRegisterMode(!isRegisterMode);
    // Clear form
    setEmail('');
    setPassword('');
    setName('');
    setCountry(Country.INDIA);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8">
        {/* Login/Register Form */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-3xl">
              {isRegisterMode ? 'Create Account 🍔' : 'Welcome Back! 🍔'}
            </CardTitle>
            <CardDescription>
              {isRegisterMode 
                ? 'Sign up to start ordering delicious food' 
                : 'Login to order delicious food'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={isRegisterMode ? handleRegister : handleLogin} className="space-y-4">
              {/* Name field (only for register) */}
              {isRegisterMode && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              )}

              {/* Email field */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={isRegisterMode ? "john@example.com" : "nick.fury@avengers.com"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Password field */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={isRegisterMode ? 6 : undefined}
                />
                {isRegisterMode && (
                  <p className="text-xs text-muted-foreground">Minimum 6 characters</p>
                )}
              </div>

              {/* Country field (only for register) */}
              {isRegisterMode && (
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Select
                    id="country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value as Country)}
                  >
                    <option value={Country.INDIA}>India</option>
                    <option value={Country.AMERICA}>America</option>
                  </Select>
                </div>
              )}

              {/* Info message for registration */}
              {isRegisterMode && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    ℹ️ You'll be registered as a <strong>Member</strong>. To test Admin/Manager roles, please use the demo accounts.
                  </p>
                </div>
              )}

              {/* Submit button */}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading 
                  ? (isRegisterMode ? 'Creating Account...' : 'Logging in...') 
                  : (isRegisterMode ? 'Create Account' : 'Login')}
              </Button>

              {/* Toggle between login/register */}
              <div className="text-center text-sm">
                {isRegisterMode ? (
                  <>
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={toggleMode}
                      className="text-primary hover:underline font-semibold"
                    >
                      Login here
                    </button>
                  </>
                ) : (
                  <>
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={toggleMode}
                      className="text-primary hover:underline font-semibold"
                    >
                      Register here
                    </button>
                  </>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Demo Accounts (only show in login mode) */}
        {!isRegisterMode && (
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
        )}

        {/* Registration Info (show when in register mode) */}
        {isRegisterMode && (
          <Card className="w-full">
            <CardHeader>
              <CardTitle>🎯 Quick Demo Instead?</CardTitle>
              <CardDescription>Use pre-created demo accounts to test RBAC</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                We have 6 demo accounts ready for testing:
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="font-semibold">Admin:</span>
                  <span className="text-muted-foreground">Full access</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="font-semibold">2 Managers:</span>
                  <span className="text-muted-foreground">Can checkout & cancel</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="font-semibold">3 Members:</span>
                  <span className="text-muted-foreground">View & add to cart only</span>
                </li>
              </ul>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={toggleMode}
              >
                Switch to Login & Use Demo Accounts
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}