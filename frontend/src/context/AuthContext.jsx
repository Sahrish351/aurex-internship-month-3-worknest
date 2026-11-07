import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('worknest_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('worknest_token') || null);
  const [loading, setLoading] = useState(true);

  // Validate or sync current user session on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('worknest_token');
      if (storedToken) {
        try {
          const res = await authService.getCurrentUser();
          if (res.data && res.data.user) {
            setUser(res.data.user);
            localStorage.setItem('worknest_user', JSON.stringify(res.data.user));
          }
        } catch (err) {
          console.warn('[Auth] Session validation failed or server offline. Preserving cached session if present.');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authService.login({ email, password });
    if (res.data) {
      setUser(res.data.user);
      setToken(res.data.token);
      localStorage.setItem('worknest_user', JSON.stringify(res.data.user));
      localStorage.setItem('worknest_token', res.data.token);
    }
    return res;
  };

  const register = async (name, email, password) => {
    const res = await authService.register({ name, email, password });
    if (res.data) {
      setUser(res.data.user);
      setToken(res.data.token);
      localStorage.setItem('worknest_user', JSON.stringify(res.data.user));
      localStorage.setItem('worknest_token', res.data.token);
    }
    return res;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      // Continue client cleanup even if network fails
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('worknest_user');
      localStorage.removeItem('worknest_token');
    }
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('worknest_user', JSON.stringify(userData));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        loading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
