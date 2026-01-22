'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthResponse, LoginCredentials } from '@/types/auth.types';
import { api } from '@/lib/api';
import { setAuthToken, getAuthToken, setUser as saveUser, getUser, logout as logoutUser } from '@/lib/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const token = getAuthToken();
    const savedUser = getUser();
    
    if (token && savedUser) {
      setUser(savedUser);
      // Optionally verify token with backend
      refreshUser();
    }
    setLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      const { access_token, user } = response.data;
      
      setAuthToken(access_token);
      saveUser(user);
      setUser(user);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    logoutUser();
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const response = await api.get<User>('/auth/profile');
      const userData = response.data;
      saveUser(userData);
      setUser(userData);
    } catch (error) {
      // If profile fetch fails, logout
      logout();
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}