import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../Context/AppContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, token, isLoading } = useAppContext();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!token || !user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
