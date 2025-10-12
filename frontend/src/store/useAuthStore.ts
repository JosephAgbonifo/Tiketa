// src/store/useAuthStore.ts
import { create } from "zustand";

export type User = Record<string, unknown>;

interface AuthState {
  token: string | null;
  user: User | null;
  setAuth: (token: string, user?: User) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  setAuth: (token, user) => set({ token, user }),
  clearAuth: () => set({ token: null, user: null }),
}));
