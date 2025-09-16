import { createContext, useContext, useState, useEffect } from "react";


import { getMe, User } from "@/services/userService";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (token: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: async () => {},
  logout: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem("token");
  });
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
    if (token) {
      getMe(token)
        .then(setUser)
        .catch((error) => {
          setUser(null);

          if (error.response?.status === 401) {
            logout();
          }
        });
    } else {
      setUser(null);
    }
  }, []);

  const login = async (token: string) => {
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
    try {
      const userData = await getMe(token);
      setUser(userData);
    } catch {
      setUser(null);
      console.log('Erro ao fazer login');
    }
  };
  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUser(null);
  };
  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
