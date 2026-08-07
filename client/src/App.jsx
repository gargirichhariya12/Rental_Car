import { Route, Routes, useLocation, Navigate, useNavigate } from 'react-router-dom';
import Home from "./pages/Home";
import About from "./pages/About";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CarDetails from "./pages/CarDetails";
import MyBooking from "./pages/MyBooking";
import React, { useEffect } from 'react';
import Cars from './pages/Cars';
import Layout from './pages/Owner/Layout';
import Dashboard from './pages/Owner/Dashboard';
import AddCar from './pages/Owner/AddCar';
import ManageCar from './pages/Owner/ManageCar';
import ManageBooking from './pages/Owner/ManageBooking';

import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import AuthSuccess from './pages/AuthSuccess';
import { Toaster } from 'react-hot-toast';
import { toast } from 'react-hot-toast';
import { useAppContext } from './Context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function App() {
  void motion;
  const { showLogin, setShowLogin } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();
  const isOwnerPath = location.pathname.startsWith('/owner');
  const hideLayout = isOwnerPath;

  const pageVariants = {
    initial: { opacity: 0, x: -10 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 10 },
  };

  const renderAnimatedPage = (page) => (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={{ duration: 0.3 }}
    >
      {page}
    </motion.div>
  );

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const error = params.get('error');

    if (!error) {
      return;
    }

    if (error === 'google_oauth_not_configured') {
      toast.error('Google login is not configured on the server yet.');
    } else if (error === 'auth_failed') {
      toast.error('Google login failed. Please try again.');
    }

    params.delete('error');
    const nextSearch = params.toString();
    navigate(
      {
        pathname: location.pathname,
        search: nextSearch ? `?${nextSearch}` : '',
      },
      { replace: true }
    );
  }, [location.pathname, location.search, navigate]);

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      {showLogin && !hideLayout && <Login setShowLogin={setShowLogin} />}
      {!hideLayout && <Navbar />}
      
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={
            <PublicRoute>
              {renderAnimatedPage(<Home />)}
            </PublicRoute>
          } />
          <Route path="/about" element={
            <PublicRoute>
              {renderAnimatedPage(<About />)}
            </PublicRoute>
          } />
          <Route path="/auth-success" element={
            <PublicRoute>
              <AuthSuccess />
            </PublicRoute>
          } />
          <Route path='/cars' element={
            <PublicRoute>
              {renderAnimatedPage(<Cars />)}
            </PublicRoute>
          } />
          <Route path='/CarDetails/:id' element={
            <PublicRoute>
              {renderAnimatedPage(<CarDetails />)}
            </PublicRoute>
          } />

          {/* User Protected Routes */}
          <Route path='/my-bookings' element={
            <ProtectedRoute redirectTo="/">
              {renderAnimatedPage(<MyBooking />)}
            </ProtectedRoute>
          } />

          {/* Owner Protected Routes */}
          <Route path='/owner' element={
            <ProtectedRoute allowedRoles={['owner']}>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path='add-car' element={<AddCar />} />
            <Route path='manage-cars' element={<ManageCar />} />
            <Route path='manage-bookings' element={<ManageBooking />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>

      {!hideLayout && <Footer />}
    </>
  );
}
