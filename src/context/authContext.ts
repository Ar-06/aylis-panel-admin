import { createContext } from "react";
import type { LoginUser, PublicUser, AuthResponse } from "@/types/user.type";

interface AuthContextProps {
  user: PublicUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  errors: string[];
  login: (user: LoginUser) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  clearErrors: () => void;
}

export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined,
);
