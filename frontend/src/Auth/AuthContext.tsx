import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { User } from "../types/User";
import type { LoginDto, RegisterDto } from "../types/Auth";
import * as AuthService from "./Authservice";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  login: (dto: LoginDto) => Promise<void>;
  register: (dto: RegisterDto) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() =>
    AuthService.getStoredToken()
  );
  const [user, setUser] = useState<User | null>(() =>
    AuthService.decodeToken(AuthService.getStoredToken())
  );

  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }
    const decoded = AuthService.decodeToken(token);
    setUser(decoded);
  }, [token]);

  const login = async (dto: LoginDto): Promise<void> => {
    const result = await AuthService.login(dto);
    setToken(result.token);
    setUser(result.user);
  };

  const register = async (dto: RegisterDto): Promise<void> => {
    await AuthService.register(dto);
  };

  const logout = (): void => {
    AuthService.logout();
    setToken(null);
    setUser(null);
  };

  const value: AuthContextValue = {
    user,
    token,
    isLoggedIn: !!user,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};
