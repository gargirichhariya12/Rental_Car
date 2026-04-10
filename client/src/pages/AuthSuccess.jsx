import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppContext } from '../Context/AppContext';
import { toast } from 'react-hot-toast';

const AuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setToken, fetchUser } = useAppContext();

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (token) {
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setToken(token);
      
      // Fetch user data to update global state
      fetchUser().then(() => {
        toast.success("Successfully logged in with Google!");
        navigate('/');
      }).catch(() => {
        toast.error("Failed to fetch user data after Google login");
        navigate('/');
      });
    } else {
      toast.error("Authentication failed. No token received.");
      navigate('/');
    }
  }, [searchParams, setToken, fetchUser, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mb-4"></div>
      <p className="text-gray-400">Completing authentication...</p>
    </div>
  );
};

export default AuthSuccess;
