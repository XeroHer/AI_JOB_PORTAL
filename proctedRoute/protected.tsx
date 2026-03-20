

import { JSX } from "react";
import { Navigate } from "react-router-dom";

function getRoleFromToken(token: string | null): string | null {
  if (!token) return null;

  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));
    return decoded.role;
  } catch (err) {
    return null;
  }
}

export function ProtectedRoute({
  children,
  role,
}: {
  children: JSX.Element;
  role: string;
}) {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" />;
  }

  const userRole = getRoleFromToken(token);

  if (userRole !== role) {
    return <Navigate to="/" />;
  }

  return children;
}