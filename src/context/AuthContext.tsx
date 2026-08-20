/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, type ReactNode } from "react";

type User = {
  id: number;
  role: string;
  email: string;
  nombre?: string;
  perfil_completo?: boolean;
};

type AuthContextType = {
  token: string | null;
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  marcarPerfilCompleto: () => void;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("token"),
  );

  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = (jwt: string, userData: User) => {
    localStorage.setItem("token", jwt);
    localStorage.setItem("user", JSON.stringify(userData));

    setToken(jwt);
    setUser(userData);
  };

  const logout = () => {
    localStorage.clear();
    setToken(null);
    setUser(null);
  };

  const marcarPerfilCompleto = () => {
    setUser((usuarioActual) => {
      if (!usuarioActual) return usuarioActual;
      const usuarioActualizado = {
        ...usuarioActual,
        perfil_completo: true,
      };
      localStorage.setItem("user", JSON.stringify(usuarioActualizado));
      return usuarioActualizado;
    });
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, marcarPerfilCompleto }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
