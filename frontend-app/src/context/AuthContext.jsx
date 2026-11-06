import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api, { unwrap } from "../api.js";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/auth/me")
      .then(response => setUser(unwrap(response).user || null))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async credentials => {
    const response = await api.post("/auth/login", credentials);
    setUser(unwrap(response).user || null);
  };
  const register = async details => {
    const response = await api.post("/auth/register", details);
    setUser(unwrap(response).user || null);
  };
  const logout = async () => {
    try { await api.post("/auth/logout"); }
    finally { setUser(null); }
  };

  const value = useMemo(() => ({ user, setUser, loading, login, register, logout }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
