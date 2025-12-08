// src/features/auth/authSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
  id: number;
  email: string;
}

interface AuthState {
  access_token: string | null;
  user: User | null;
}

const initialState: AuthState = {
  access_token: null,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ access_token: string }>
    ) => {
      state.access_token = action.payload.access_token;
      state.user = null;
    },
    clearCredentials: (state) => {
      state.access_token = null;
      state.user = null;
    },
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
