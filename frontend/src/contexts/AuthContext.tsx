import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// GeoWatch API Base URL
const API_BASE_URL = 'http://localhost:8000/api/geowatch';

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Configure axios defaults
  useEffect(() => {
    const token = localStorage.getItem('geowatch_token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  // Check if user is logged in on app start
  useEffect(() => {
    const token = localStorage.getItem('geowatch_token');
    if (token) {
      axios.get(`${API_BASE_URL}/auth/me`)
        .then(response => {
          setUser(response.data.user);
        })
        .catch(() => {
          localStorage.removeItem('geowatch_token');
          delete axios.defaults.headers.common['Authorization'];
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/login`,
        { email, password },
        { withCredentials: true }
      );

      const { token, user } = response.data;
      localStorage.setItem('geowatch_token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      toast.success('Welcome to GeoWatch! 🌍');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Login failed');
      throw error;
    }
  };

  const signup = async (email: string, password: string, name?: string) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/signup`,
        { email, password, name },
        { withCredentials: true }
      );
      const { token, user } = response.data;
      localStorage.setItem('geowatch_token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      toast.success('Welcome to GeoWatch! Start monitoring the Earth 🛰️');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Signup failed');
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('geowatch_token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    toast.success('Signed out. See you soon!');
  };

  const value = {
    user,
    login,
    signup,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}