import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import type { AuthResponse } from '../types';

interface AuthContextType {
  isAuthenticated: boolean;
  username: string | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [username, setUsername] = useState<string | null>(localStorage.getItem('username'));
  const [loading, setLoading] = useState(false);

  const isAuthenticated = !!token;

  const handleAuth = useCallback((data: AuthResponse) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('username', data.username);
    setToken(data.token);
    setUsername(data.username);
  }, []);

  const login = useCallback(async (uname: string, password: string) => {
    setLoading(true);
    try {
      const res = await api.post<AuthResponse>('/auth/login', { username: uname, password });
      handleAuth(res.data);
    } finally {
      setLoading(false);
    }
  }, [handleAuth]);

  const register = useCallback(async (uname: string, password: string) => {
    setLoading(true);
    try {
      const res = await api.post<AuthResponse>('/auth/register', { username: uname, password });
      handleAuth(res.data);
    } finally {
      setLoading(false);
    }
  }, [handleAuth]);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setToken(null);
    setUsername(null);
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    if (storedToken && storedUsername) {
      setToken(storedToken);
      setUsername(storedUsername);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, username, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
