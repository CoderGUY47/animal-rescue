import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AuthState {
  user: {
    id: string;
    name: string;
    role: 'user' | 'volunteer' | 'vet';
  } | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  // mock logged-in user for demonstration of redux usage
  user: {
    id: "u-1234",
    name: "John Doe",
    role: "volunteer"
  },
  isAuthenticated: true,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<AuthState['user']>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
