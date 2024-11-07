import { redirect } from 'react-router-dom';
import React, { useMemo, useState, useEffect, useContext, useCallback, createContext } from 'react';

import axiosInstance from 'src/axios';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  login: (userData: { email: string; password: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [user, setUser] = useState<any | null>(null);

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('expiresIn');
    redirect('/sign-in');
  };

  const login = useCallback(async (userData: { email: string; password: string }) => {
    try {
      const response = await axiosInstance.post(
        `${import.meta.env.VITE_APP_API_BASE_URL}auth/login`,
        userData,
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );

      const { token, expiresIn: newExpiresIn } = response.data;
      setIsAuthenticated(true);

      localStorage.setItem('token', token);
      const expirationDate = new Date().getTime() + newExpiresIn * 60 * 1000;
      localStorage.setItem('expiresIn', expirationDate.toString());
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('Login failed');
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const expirationDate = localStorage.getItem('expiresIn');
      if (expirationDate && new Date().getTime() > Number(expirationDate)) {
        logout();
      }
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const value = useMemo(
    () => ({ isAuthenticated, user, login, logout }),
    [isAuthenticated, user, login]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
