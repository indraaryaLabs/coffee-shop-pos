import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  isAuthenticated: boolean;
  user: {
    name: string;
    email: string;
    role: string;
  } | null;
  login: (email: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      login: (email) =>
        set({
          isAuthenticated: true,
          user: {
            name: "Julian V.",
            email,
            role: "Store Manager",
          },
        }),
      logout: () => set({ isAuthenticated: false, user: null }),
    }),
    {
      name: "atelier-auth-storage",
    }
  )
);
