import { create } from "zustand";

type AuthState = {
  accessToken: string | null;
  userEmail: string | null;
  isAuthenticated: boolean;
};

type AuthActions = {
  setAuth: (token: string, email: string) => void;
  clearAuth: () => void;
};

const useAuthStore = create<AuthState & AuthActions>((set) => ({
  accessToken: null,
  userEmail: null,
  isAuthenticated: false,

  setAuth: (token, email) =>
    set({
      accessToken: token,
      userEmail: email,
      isAuthenticated: true,
    }),

  clearAuth: () => {
    set({
      accessToken: null,
      userEmail: null,
      isAuthenticated: false,
    });
  },
}));

export default useAuthStore;
