'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '../store/hooks';
import { setAuthFromStorage } from '../store/userSlice';
import authService from '../services/AuthService';

const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Initialize Redux state from localStorage on app start
    const storedAuthData = authService.getStoredAuthData();
    if (storedAuthData) {
      dispatch(setAuthFromStorage(storedAuthData));
    }
  }, [dispatch]);

  return <>{children}</>;
};

export default AuthInitializer;
