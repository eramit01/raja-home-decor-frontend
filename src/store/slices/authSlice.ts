import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  role: 'customer' | 'admin';
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  csrfToken: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  csrfToken: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; csrfToken?: string }>) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      if (action.payload.csrfToken) {
        state.csrfToken = action.payload.csrfToken;
      }
    },
    setCsrfToken: (state, action: PayloadAction<string>) => {
      state.csrfToken = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.csrfToken = null;
    },
  },
});

export const { setCredentials, setCsrfToken, logout } = authSlice.actions;
export default authSlice.reducer;
