import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, AuthTokens } from "../types";

interface AuthState {
  user: User | null;
  access_token: string | null;
  refresh_token: string | null;
  isAuthenticated: boolean;
  login: (user: User, tokens: AuthTokens) => void;
  logout: () => void;
  setUser: (user: User) => void;
  setTokensAndUser: (accessToken: string, refreshToken: string, user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      access_token: null,
      refresh_token: null,
      isAuthenticated: false,
      login: (user, tokens) =>
        set({
          user,
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          isAuthenticated: true,
        }),
      logout: () =>
        set({
          user: null,
          access_token: null,
          refresh_token: null,
          isAuthenticated: false,
        }),
      setUser: (user) => set({ user }),
      setTokensAndUser: (accessToken, refreshToken, user) =>
        set({
          user,
          access_token: accessToken,
          refresh_token: refreshToken,
          isAuthenticated: true,
        }),
    }),
    {
      name: "auth-storage",
    },
  ),
);
