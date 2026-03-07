import { useState } from 'react';
import React from "react";
import logo from '../assets/logo.png';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function Navbar({ setShowLogin }) {
  const menuLinks = [
    { name: "Home", path: "/" },
    { name: "Cars", path: "/cars" },
    { name: "My Bookings", path: "/my-bookings" },
  ];

  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="w-full bg-black px-4 py-3 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src={logo} alt="Logo" className="h-10 w-auto" />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 border border-white rounded-full px-6 py-2">
          {menuLinks.map((link, index) => (
            <Link
              key={index}
              to={link.path}
              className="text-white hover:text-gray-300 transition"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <button className="text-white px-5 py-2 rounded-full border border-dashed border-white hover:bg-white hover:text-black transition">
            Book Now
          </button>

          <button onClick={() => navigate('/owner')} className="text-white">
            Dashboard
          </button>

          <button
            onClick={() => setShowLogin(true)}
            className="bg-blue-400 hover:bg-[var(--color-secondary)] text-white px-6 py-2 rounded-lg transition"
          >
            Log In
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setOpen(!open)} className="md:hidden text-white">
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed top-16 right-0 w-full h-screen bg-black flex flex-col items-center gap-6 pt-10 transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {menuLinks.map((link, index) => (
          <Link
            key={index}
            to={link.path}
            onClick={() => setOpen(false)}
            className="text-white text-lg"
          >
            {link.name}
          </Link>
        ))}

        <button className="text-white px-6 py-2 rounded-full border border-dashed border-white">
          Book Now
        </button>

        <button onClick={() => navigate('/owner')} className="text-white">
          Dashboard
        </button>

        <button
          onClick={() => setShowLogin(true)}
          className="bg-blue-400 text-white px-6 py-2 rounded-lg"
        >
          Log In
        </button>
      </div>
    </nav>
  );
}
