import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { storage, STORAGE_KEYS } from "@/lib/storage";
import { decodeToken } from "@/lib/jwt";
import type { AuthUser } from "@/types/auth.types";

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
}

// Initialize auth state from storage
function getInitialState(): AuthState {
  const token = storage.getString(STORAGE_KEYS.TOKEN);

  if (!token) {
    return { token: null, user: null, isAuthenticated: false };
  }

  const user = decodeToken(token);

  // If token is invalid or expired, clear it
  if (!user) {
    storage.remove(STORAGE_KEYS.TOKEN);
    return { token: null, user: null, isAuthenticated: false };
  }

  return { token, user, isAuthenticated: true };
}

const authSlice = createSlice({
  name: "auth",
  initialState: getInitialState(),
  reducers: {
    setAuth: (state, action: PayloadAction<string>) => {
      const token = action.payload;
      const user = decodeToken(token);

      if (user) {
        storage.setString(STORAGE_KEYS.TOKEN, token);
        state.token = token;
        state.user = user;
        state.isAuthenticated = true;
      }
    },

    logout: (state) => {
      storage.remove(STORAGE_KEYS.TOKEN);
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setAuth, logout } = authSlice.actions;
export default authSlice.reducer;
