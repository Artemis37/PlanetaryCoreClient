'use client';

import { useState, useEffect } from 'react';
import authService from '../services/AuthService';

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

    useEffect(() => {
      console.log('useAuth hook initialized');
    const checkAuth = () => {
      const authenticated = authService.isAuthenticated();
      setIsAuthenticated(authenticated);
      if (authenticated) {
        setUser(authService.getUser());
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    checkAuth();
    
    // Listen for storage changes (cross-tab sync)
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const login = async (credentials: { username: string; password: string }) => {
    const response = await authService.login(credentials);
    setIsAuthenticated(true);
    setUser(authService.getUser());
    return response;
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  return {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
  };
};

export default useAuth;
