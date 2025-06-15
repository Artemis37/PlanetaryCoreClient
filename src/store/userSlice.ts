import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  userType: string;
  expiresAt: string;
}

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  loading: boolean;
}

const initialState: UserState = {
  user: null,
  isAuthenticated: false,
  token: null,
  loading: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
    },
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    loginFailure: (state) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.loading = false;
    },
    setAuthFromStorage: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
  },
});

export const { 
  loginStart, 
  loginSuccess, 
  loginFailure, 
  logout, 
  setAuthFromStorage 
} = userSlice.actions;

export default userSlice.reducer;
