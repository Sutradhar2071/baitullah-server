import { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("adminInfo");
    const token = localStorage.getItem("adminToken");
    if (stored && token) {
      try {
        setAdmin(JSON.parse(stored));
      } catch {
        localStorage.removeItem("adminInfo");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("adminToken", data.token);
    localStorage.setItem(
      "adminInfo",
      JSON.stringify({ _id: data._id, name: data.name, email: data.email, role: data.role })
    );
    setAdmin({ _id: data._id, name: data.name, email: data.email, role: data.role });
    return data;
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminInfo");
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout, isAuthenticated: !!admin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
