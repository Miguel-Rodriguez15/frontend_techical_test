import React from 'react';
import { Navigate } from 'react-router-dom';


interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = localStorage.getItem('token');
  const expiresIn = localStorage.getItem('expiresIn');

  const isAuthenticated = token && expiresIn;

  return isAuthenticated ? children : <Navigate to="/sign-in" replace />;
};

export default ProtectedRoute;