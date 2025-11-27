// src/routes/ProtectedRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { token, user, loading } = useAuth();

  // while auth context is initializing or fetching /users/me
  if (loading) return null; // or a spinner

  // consider logged in if we have a token (and optionally a user id)
  const isLoggedIn = !!token && (!!user?.id || !!user?._id || !!user?.email);

  if (!isLoggedIn) return <Navigate to="/login" replace />;

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
