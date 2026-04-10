import { useState, useEffect } from 'react';
import React from "react";
import logo from '../assets/logo.png';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, LayoutDashboard, Settings, LogOut, Heart } from 'lucide-react';
import { useAppContext } from '../Context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { setShowLogin, user, logout, isOwner, axios } = useAppContext();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuLinks = [
    { name: "Home", path: "/" },
    { name: "Cars", path: "/cars" },
    { name: "My Bookings", path: "/my-bookings" },
  ];

  const changeRole = async () => {
    try {
      const { data } = await axios.post('/api/owner/change-role');
      if (data.status === 'success') {
        window.location.reload();
      }
    } catch (error) {
      console.error("Role change failed", error);
    }
  };

  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <motion.nav 
      initial="hidden"
      animate="visible"
      variants={navVariants}
      className={`w-full px-4 py-4 sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-black/70 backdrop-blur-xl border-b border-white/10 py-3" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center group">
          <motion.img 
            whileHover={{ scale: 1.05 }}
            src={logo} 
            alt="Logo" 
            className="h-10 w-auto" 
          />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-1 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 backdrop-blur-md">
          {menuLinks.map((link, index) => (
            <Link
              key={index}
              to={link.path}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all relative ${
                location.pathname === link.path ? "text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              {link.name}
              {location.pathname === link.path && (
                <motion.div 
                  layoutId="nav-glow"
                  className="absolute inset-0 bg-white/10 rounded-full -z-10"
                />
              )}
            </Link>
          ))}
          {user?.role === 'admin' && (
            <Link 
              to="/admin" 
              className="px-4 py-1.5 rounded-full text-sm font-medium text-amber-400 hover:text-amber-300 transition-all"
            >
              Admin Panel
            </Link>
          )}
        </div>

        {/* Right Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {user && (
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => isOwner ? navigate('/owner') : changeRole()} 
              className="text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-white transition-colors"
            >
              {isOwner ? 'Owner View' : 'Earn with us'}
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { user ? logout() : setShowLogin(true) }}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl font-bold transition-all ${
              user 
                ? "bg-gray-800 text-gray-300 hover:bg-gray-700" 
                : "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-500"
            }`}
          >
            {user ? (
              <><LogOut size={16} /> Logout</>
            ) : (
              'Login'
            )}
          </motion.button>
        </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setOpen(!open)} className="md:hidden text-white p-2">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden absolute top-full left-0 w-full bg-black/95 backdrop-blur-2xl border-b border-white/10 flex flex-col items-center gap-4 py-8 overflow-hidden"
          >
            {menuLinks.map((link, index) => (
              <Link
                key={index}
                to={link.path}
                onClick={() => setOpen(false)}
                className="text-white text-xl font-medium"
              >
                {link.name}
              </Link>
            ))}
            {user?.role === 'admin' && (
              <Link to="/admin" onClick={() => setOpen(false)} className="text-amber-400 text-xl font-medium">
                Admin Panel
              </Link>
            )}
            <hr className="w-1/2 border-white/5 my-2" />
            <button 
              onClick={() => { setOpen(false); setShowLogin(true); }}
              className="bg-indigo-600 text-white px-10 py-3 rounded-2xl font-bold"
            >
              {user ? 'Logout' : 'Access Account'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
