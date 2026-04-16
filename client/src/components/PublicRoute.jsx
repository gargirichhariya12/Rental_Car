import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../Context/AppContext';
import Loader from './Loader';

const getDefaultRedirect = (role) => {
  if (role === 'owner') return '/owner';
  return '/';
};

const PublicRoute = ({ children, restricted = false }) => {
  const { token, user, isLoading } = useAppContext();
  const location = useLocation();

  if (isLoading && token) {
    return <Loader />;
  }

  if (restricted && token && user) {
    const fromPath = location.state?.from?.pathname;
    return <Navigate to={fromPath || getDefaultRedirect(user.role)} replace />;
  }

  return children;
};

export default PublicRoute;
