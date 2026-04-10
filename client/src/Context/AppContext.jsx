/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";

// Configuration
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
axios.defaults.withCredentials = true; // Required for cookies

export const AppContext = createContext();

const parseTokenExpiry = (accessToken) => {
  try {
    const payload = accessToken.split('.')[1];
    if (!payload) return null;

    const normalizedPayload = payload.replace(/-/g, '+').replace(/_/g, '/');
    const decodedPayload = JSON.parse(window.atob(normalizedPayload));

    return typeof decodedPayload.exp === 'number' ? decodedPayload.exp * 1000 : null;
  } catch {
    return null;
  }
};

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
  const isLoggingOutRef = useRef(false);

  const logout = useCallback(async ({
    notify = true,
    message = 'Logged out successfully',
    tone = 'success',
  } = {}) => {
    if (isLoggingOutRef.current) return;
    isLoggingOutRef.current = true;

    try {
      await axios.get('/auth/logout');
    } catch (err) {
      console.error("Logout error", err);
    } finally {
      setToken(null);
      setUser(null);
      setIsOwner(false);

      if (notify) {
        if (tone === 'error') {
          toast.error(message);
        } else {
          toast.success(message);
        }
      }

      navigate('/');
      isLoggingOutRef.current = false;
    }
  }, [navigate]);

  // fun to check if user is log in
  const fetchUser = useCallback(async () => {
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
  }, []);

  // fetch all cars
  const fetchCar = useCallback(async (filters = {}) => {
    try {
      const pickupDate = filters.pickupDate || pickUpDate;
      const dropoffDate = filters.returnDate || returnDate;
      const hasAvailabilityFilters = Boolean(filters.location && pickupDate && dropoffDate);

      const request = hasAvailabilityFilters
        ? axios.post('/api/bookings/check-availability', {
            ...filters,
            pickupDate,
            returnDate: dropoffDate
          })
        : axios.get('/api/user/cars', {
            params: filters
          });

      const { data } = await request;

      if (data.status === 'success') {
        setCars(data.data.availableCars || data.data.cars || []);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch cars");
    }
  }, [pickUpDate, returnDate]);

  // --- AXIOS INTERCEPTORS ---
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (!originalRequest) {
          return Promise.reject(error);
        }

        const isLogoutRequest = originalRequest.url?.includes('/auth/logout');

        if (error.response?.status === 401 && token && !isLogoutRequest) {
          await logout({
            message: 'Session expired. Please log in again.',
            tone: 'error',
          });
        }

        return Promise.reject(error);
      }
    );

    return () => axios.interceptors.response.eject(interceptor);
  }, [logout, token]);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  }, [token]);

  useEffect(() => {
    if (!token) return undefined;

    const expiryTime = parseTokenExpiry(token);

    if (!expiryTime) {
      logout({
        message: 'Session expired. Please log in again.',
        tone: 'error',
      });
      return undefined;
    }

    const timeUntilExpiry = expiryTime - Date.now();

    if (timeUntilExpiry <= 0) {
      logout({
        message: 'Session expired. Please log in again.',
        tone: 'error',
      });
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      logout({
        message: 'Session expired. Please log in again.',
        tone: 'error',
      });
    }, timeUntilExpiry);

    return () => window.clearTimeout(timeoutId);
  }, [logout, token]);

  useEffect(() => {
    fetchCar();
    if (token) fetchUser();
    else setIsLoading(false);
  }, [token, fetchCar, fetchUser]);

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
