import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('eof_token');
    if (token) {
      api.get('/auth/me')
        .then(res => {
          setUser(res.data.data);
        })
        .catch(() => {
          localStorage.removeItem('eof_token');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('eof_token', res.data.data.accessToken);
    if (res.data.data.refreshToken) {
      localStorage.setItem('eof_refresh_token', res.data.data.refreshToken);
    }
    setUser(res.data.data.user);
    return res.data;
  };

  const register = async (data) => {
    const res = await api.post('/auth/register', data);
    localStorage.setItem('eof_token', res.data.data.accessToken);
    setUser(res.data.data.user);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('eof_token');
    localStorage.removeItem('eof_refresh_token');
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data.data);
      return res.data.data;
    } catch (error) {
      console.error('Failed to refresh user:', error);
      return null;
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    refreshUser,
    isAuthenticated: !!user,
    isMember: user?.membership?.tier === 'MEMBER' || user?.membership?.tier === 'CREATOR',
    isCreator: user?.membership?.tier === 'CREATOR'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
