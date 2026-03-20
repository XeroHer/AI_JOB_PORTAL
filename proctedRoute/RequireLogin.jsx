// RequireLogin.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export function RequireLogin({ children }) {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleClick = (e) => {
    if (!token) {
      e.preventDefault();
      navigate("/login");
      alert("You need to login to access this feature!");
    }
    // If logged in, do nothing; original click will run
  };

  // Merge original onClick with login check
  const originalOnClick = children.props.onClick;
  const mergedOnClick = (e) => {
    handleClick(e);
    if (token && originalOnClick) {
      originalOnClick(e);
    }
  };

  return React.cloneElement(children, { onClick: mergedOnClick });
}