'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loginStart, loginSuccess, loginFailure, logout, setAuthFromStorage } from '../store/userSlice';
import authService from '../services/AuthService';
import { LoginRequest } from '../models/auth';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, token, loading } = useAppSelector((state) => state.user);

  useEffect(() => {
    // Check for stored auth data on initialization
    const storedAuthData = authService.getStoredAuthData();
    if (storedAuthData) {
      dispatch(setAuthFromStorage(storedAuthData));
    }

    // Listen for storage changes (cross-tab sync)
    const handleStorageChange = () => {
      const authData = authService.getStoredAuthData();
      if (authData) {
        dispatch(setAuthFromStorage(authData));
      } else {
        dispatch(logout());
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [dispatch]);

  const login = async (credentials: LoginRequest) => {
    dispatch(loginStart());
    try {
      const response = await authService.login(credentials);
      
      // Dispatch success action with user data and token
      dispatch(loginSuccess({
        user: {
          username: response.username,
          email: response.email,
          firstName: response.firstName,
          lastName: response.lastName,
          userType: response.userType,
          expiresAt: response.expiresAt,
        },
        token: response.token,
      }));
      
      return response;
    } catch (error) {
      dispatch(loginFailure());
      throw error;
    }
  };

  const handleLogout = () => {
    authService.logout();
    dispatch(logout());
  };

  return {
    user,
    isAuthenticated,
    token,
    loading,
    login,
    logout: handleLogout,
  };
};

export default useAuth;
