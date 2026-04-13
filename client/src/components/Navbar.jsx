import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import { LogOut, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { useAppContext } from '../Context/AppContext';

export default function Navbar() {
  void motion;
  const { setShowLogin, user, logout, isOwner, fetchUser } = useAppContext();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isActivePath = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }

    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    handleScroll();
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
        await fetchUser();
        navigate('/owner');
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

  const accentTextClass = "text-indigo-400 hover:text-indigo-300";

  return (
    <motion.nav 
      initial="hidden"
      animate="visible"
      variants={navVariants}
      className={`w-full px-4 py-4 sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-black  backdrop-blur-xl border-b border-zinc-800 py-3" : "bg-black backdrop-blur-md border-b border-zinc-900"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" onClick={() => setOpen(false)} className="flex items-center group">
          <motion.img 
            whileHover={{ scale: 1.05 }}
            src={logo} 
            alt="Logo" 
            className="h-10 w-auto" 
          />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-1 bg-black border border-zinc-800 rounded-full px-4 py-1.5 backdrop-blur-md shadow-lg shadow-black/20">
          {menuLinks.map((link, index) => (
            <Link
              key={index}
              to={link.path}
              onClick={() => setOpen(false)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all relative ${
                isActivePath(link.path) ? "text-white" : "text-gray-400 hover:text-indigo-300"
              }`}
            >
              {link.name}
              {isActivePath(link.path) && (
                <motion.div 
                  layoutId="nav-glow"
                  className="absolute inset-0 rounded-full bg-indigo-500/15 border border-indigo-500/30 -z-10"
                />
              )}
            </Link>
          ))}
          {user?.role === 'admin' && (
            <Link 
              to="/admin" 
              onClick={() => setOpen(false)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${accentTextClass}`}
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
              onClick={() => {
                setOpen(false);
                isOwner ? navigate('/owner') : changeRole();
              }}
              className={`text-xs font-bold uppercase tracking-wider transition-colors ${accentTextClass}`}
            >
              {isOwner ? 'Owner View' : 'Earn with us'}
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setOpen(false);
              user ? logout() : setShowLogin(true);
            }}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl font-bold transition-all ${
              user 
                ? "bg-zinc-900 border border-zinc-800 text-gray-300 hover:bg-zinc-800" 
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
        <button
          type="button"
          aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
          onClick={() => setOpen(!open)}
          className="md:hidden text-white p-2"
        >
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
            className="md:hidden absolute top-full left-0 w-full bg-zinc-950/95 backdrop-blur-2xl border-b border-zinc-800 flex flex-col items-center gap-4 py-8 overflow-hidden"
          >
            {menuLinks.map((link, index) => (
              <Link
                key={index}
                to={link.path}
                onClick={() => setOpen(false)}
                className={`text-xl font-medium ${isActivePath(link.path) ? 'text-white' : 'text-gray-300'}`}
              >
                {link.name}
              </Link>
            ))}
            {user?.role === 'admin' && (
              <Link to="/admin" onClick={() => setOpen(false)} className={`text-xl font-medium ${isActivePath('/admin') ? 'text-indigo-300' : 'text-indigo-400'}`}>
                Admin Panel
              </Link>
            )}
            <hr className="w-1/2 border-zinc-800 my-2" />
            {user && (
              <button
                onClick={() => {
                  setOpen(false);
                  if (isOwner) {
                    navigate('/owner');
                    return;
                  }
                  changeRole();
                }}
                className="text-indigo-400 text-xl font-medium hover:text-indigo-300 transition-colors"
              >
                {isOwner ? 'Owner View' : 'Earn with us'}
              </button>
            )}
            <button 
              onClick={() => {
                setOpen(false);
                if (user) {
                  logout();
                  return;
                }
                setShowLogin(true);
              }}
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
