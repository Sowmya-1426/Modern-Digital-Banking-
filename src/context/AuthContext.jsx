import { createContext, useContext, useEffect, useState } from "react";
import API from "../utils/api";

/*
  Auth Context
  - Stores logged-in user
  - Fetches /users/me using JWT
*/

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD USER ================= */
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await API.get("/users/me");
        setUser(res.data);
      } catch (err) {
        console.error("Auth error:", err);
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  /* ================= LOGOUT ================= */
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* ================= HOOK ================= */
export function useAuth() {
  return useContext(AuthContext);
}
