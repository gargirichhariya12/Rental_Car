import { Route, Routes, useLocation } from 'react-router-dom'
import Home from "./pages/Home";
import About from "./pages/About";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CarDetails from "./pages/CarDetails";
import MyBooking from "./pages/MyBooking";
import React, { useState } from 'react'
import Cars from './pages/Cars';
import Layout from './pages/Owner/Layout';
import Dashboard from './pages/Owner/Dashboard';
import AddCar from './pages/Owner/AddCar';
import ManageCar from './pages/Owner/ManageCar';
import ManageBooking from './pages/Owner/ManageBooking';
import Login from './components/Login';

export default function App() {
  const [showLogin, setShowLogin] = useState(false)
  const isOwnerPath = useLocation().pathname.startsWith('/owner')
  return (
    <>
    {showLogin && !isOwnerPath && <Login setShowLogin={setShowLogin} />}
      {!isOwnerPath && <Navbar setShowLogin={setShowLogin} />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path='/my-bookings' element={<MyBooking />} />
        <Route path='/CarDetails/:id' element={<CarDetails />} />
        <Route path='/cars' element={<Cars />} />
        <Route path='/owner' element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path='add-car' element={<AddCar />} />
          <Route path='manage-cars' element={<ManageCar />} />
          <Route path='manage-bookings' element={<ManageBooking />} />
        </Route>
      </Routes>

       <Footer  />
    </>
  )
}
