import { createContext, useContext, useState, useEffect } from "react";

type User = {
  id: number;

  role: string;

  email: string;
};

type AuthContextType = {
  token: string;

  user: User | null;

  login: (token: string, user: User) => void;

  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: any) {
  const [token, setToken] = useState("");

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");

    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      setToken(savedToken);

      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (jwt: string, userData: User) => {
    localStorage.setItem("token", jwt);

    localStorage.setItem("user", JSON.stringify(userData));

    setToken(jwt);

    setUser(userData);
  };

  const logout = () => {
    localStorage.clear();

    setToken("");

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
