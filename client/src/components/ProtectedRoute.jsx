import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../Context/AppContext';
import Loader from './Loader';

const getDefaultRedirect = (role) => {
  if (role === 'owner') return '/owner';
  return '/';
};

const ProtectedRoute = ({ children, allowedRoles = [], redirectTo = '/' }) => {
  const { user, token, isLoading } = useAppContext();
  const location = useLocation();

  if (isLoading) {
    return <Loader />;
  }

  if (!token || !user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to={getDefaultRedirect(user.role)} replace />;
  }

  return children;
};

export default ProtectedRoute;
