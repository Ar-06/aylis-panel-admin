import { apiAuth } from "@/api/auth/apiAuth";
import { processAuthError } from "@/lib/process-error";
import type { LoginUser, PublicUser } from "@/types/user.type";
import type { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./authContext";

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const navigate = useNavigate();

  const clearErrors = () => setErrors([]);

  const login = async (user: LoginUser) => {
    try {
      setErrors([]);
      setLoading(true);
      const response = await apiAuth.loginRequest(user);
      setUser(response.user);
      setIsAuthenticated(true);
      navigate("/admin");
      return response;
    } catch (error: unknown) {
      setErrors(processAuthError(error));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiAuth.logoutRequest();
      setUser(null);
      setIsAuthenticated(false);
      navigate("/");
    } catch (error: unknown) {
      setErrors(processAuthError(error));
    }
  };

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const response = await apiAuth.verifyTokenRequest();
        if (!response.user) {
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }
        setUser(response.user);
        setIsAuthenticated(true);
      } catch (error: unknown) {
        const err = error as AxiosError<{
          errors?: string[];
          message?: string;
        }>;
        if (err.response?.status === 401) {
          setIsAuthenticated(false);
          setUser(null);
        } else {
          setErrors(processAuthError(error));
          setIsAuthenticated(false);
        }
      } finally {
        setLoading(false);
      }
    };
    checkLogin();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        errors,
        login,
        logout,
        clearErrors,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
