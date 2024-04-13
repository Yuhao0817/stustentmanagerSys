// 加一层token鉴权的效果
import React from "react";
import { Navigate } from "react-router-dom";
const PrivateRoute = ({ element: Element }) => {
  const isAuthenticated = localStorage.getItem('accessToken');
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return <Element />;
};

export default PrivateRoute;
