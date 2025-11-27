// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import API_BASE_URL from "../api";

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export const AuthProvider = ({ children }) => {
  const safeParse = (key) => {
    try {
      const raw = localStorage.getItem(key);
      if (!raw || raw === "undefined") return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  };

  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [user, setUser] = useState(() => safeParse("user"));
  const [loading, setLoading] = useState(true);

  // bootstrap: if token exists but no user, fetch /users/me once
  useEffect(() => {
    const init = async () => {
      if (token && !user) {
        try {
          const res = await fetch(`${API_BASE_URL}/users/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();
          if (res.ok) {
            setUser(data);
            localStorage.setItem("user", JSON.stringify(data));
          } else {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setToken("");
            setUser(null);
          }
        } catch {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setToken("");
          setUser(null);
        }
      }
      setLoading(false);
    };
    init();
  }, []); // run once

  const login = async (jwt, maybeUser) => {
    setToken(jwt);
    localStorage.setItem("token", jwt);
    if (maybeUser) {
      setUser(maybeUser);
      localStorage.setItem("user", JSON.stringify(maybeUser));
    } else {
      try {
        const res = await fetch(`${API_BASE_URL}/users/me`, {
          headers: { Authorization: `Bearer ${jwt}` },
        });
        const data = await res.json();
        if (res.ok) {
          setUser(data);
          localStorage.setItem("user", JSON.stringify(data));
        }
      } catch {}
    }
  };

  const logout = () => {
    setToken("");
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthCtx.Provider value={{ token, user, loading, login, logout, isAuthed: !!token }}>
      {children}
    </AuthCtx.Provider>
  );
};
