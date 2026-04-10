import { Route, Routes, useLocation, Navigate } from 'react-router-dom';
import Home from "./pages/Home";
import About from "./pages/About";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CarDetails from "./pages/CarDetails";
import MyBooking from "./pages/MyBooking";
import React from 'react';
import Cars from './pages/Cars';
import Layout from './pages/Owner/Layout';
import Dashboard from './pages/Owner/Dashboard';
import AddCar from './pages/Owner/AddCar';
import ManageCar from './pages/Owner/ManageCar';
import ManageBooking from './pages/Owner/ManageBooking';

import AdminLayout from './pages/Admin/Layout';
import AdminDashboard from './pages/Admin/Dashboard';

import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import AuthSuccess from './pages/AuthSuccess';
import { Toaster } from 'react-hot-toast';
import { useAppContext } from './Context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function App() {
  void motion;
  const { showLogin, setShowLogin } = useAppContext();
  const location = useLocation();
  const isOwnerPath = location.pathname.startsWith('/owner');
  const isAdminPath = location.pathname.startsWith('/admin');
  const hideLayout = isOwnerPath || isAdminPath;

  const pageVariants = {
    initial: { opacity: 0, x: -10 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 10 },
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      {showLogin && !hideLayout && <Login setShowLogin={setShowLogin} />}
      {!hideLayout && <Navbar />}
      
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={
            <motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants} transition={{ duration: 0.3 }}>
              <Home />
            </motion.div>
          } />
          <Route path="/about" element={
            <motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants} transition={{ duration: 0.3 }}>
              <About />
            </motion.div>
          } />
          <Route path="/auth-success" element={<AuthSuccess />} />
          <Route path='/cars' element={
            <motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants} transition={{ duration: 0.3 }}>
              <Cars />
            </motion.div>
          } />
          <Route path='/CarDetails/:id' element={
            <motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants} transition={{ duration: 0.3 }}>
              <CarDetails />
            </motion.div>
          } />

          {/* User Protected Routes */}
          <Route path='/my-bookings' element={
            <ProtectedRoute>
              <motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants} transition={{ duration: 0.3 }}>
                <MyBooking />
              </motion.div>
            </ProtectedRoute>
          } />

          {/* Owner Protected Routes */}
          <Route path='/owner' element={
            <ProtectedRoute allowedRoles={['owner', 'admin']}>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path='add-car' element={<AddCar />} />
            <Route path='manage-cars' element={<ManageCar />} />
            <Route path='manage-bookings' element={<ManageBooking />} />
          </Route>

          {/* Admin Specific Routes */}
          <Route path='/admin' element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path='users' element={<div className="text-white">User Management</div>} />
            <Route path='cars' element={<div className="text-white">Admin Car Management</div>} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>

      {!hideLayout && <Footer />}
    </>
  );
}
