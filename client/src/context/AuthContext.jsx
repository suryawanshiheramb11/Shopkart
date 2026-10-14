import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // On first load, check if a valid session cookie already exists
    api
      .get("/customers/me")
      .then((res) => setCustomer(res.data))
      .catch(() => setCustomer(null))
      .finally(() => setLoading(false));
  }, []);

  const login = (customerData) => setCustomer(customerData);

  const logout = async () => {
    await api.post("/customers/logout");
    setCustomer(null);
  };

  return (
    <AuthContext.Provider value={{ customer, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
