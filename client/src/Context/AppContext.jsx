import { createContext, useContext, useEffect, useState } from "react";
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";

// Configuration
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
axios.defaults.withCredentials = true; // Required for cookies

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const currency = import.meta.env.VITE_CURRENCY || "$";
  const [token, setToken] = useState(localStorage.getItem('token')); // Access token
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [pickUpDate, setPickUpDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [cars, setCars] = useState([]);

  // --- AXIOS INTERCEPTORS ---
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            // Attempt to refresh token
            const { data } = await axios.post('/auth/refresh');
            if (data.status === 'success') {
              setToken(data.accessToken);
              localStorage.setItem('token', data.accessToken);
              originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;
              return axios(originalRequest);
            }
          } catch (refreshError) {
            logout();
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  }, [token]);

  // fun to check if user is log in
  const fetchUser = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get('/api/user/data');
      if (data.status === 'success') {
        setUser(data.data.user);
        setIsOwner(data.data.user.role === 'owner' || data.data.user.role === 'admin');
      }
    } catch (error) {
      console.error("Auth verification failed", error);
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  // fetch all cars
  const fetchCar = async (filters = {}) => {
    try {
      const { data } = await axios.post('/api/bookings/check-availability', filters);
      if (data.status === 'success') {
        setCars(data.data.availableCars);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch cars");
    }
  };

  const logout = async () => {
    try {
      await axios.get('/auth/logout');
    } catch (err) {
      console.error("Logout error", err);
    }
    setToken(null);
    setUser(null);
    setIsOwner(false);
    toast.success('Logged out successfully');
    navigate('/');
  };

  useEffect(() => {
    fetchCar();
    if (token) fetchUser();
    else setIsLoading(false);
  }, [token]);

  const value = {
    navigate, currency, user, setUser, token, setToken, isOwner, setIsOwner,
    fetchUser, showLogin, setShowLogin, logout, fetchCar, cars, setCars,
    pickUpDate, setPickUpDate, returnDate, setReturnDate, isLoading
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};