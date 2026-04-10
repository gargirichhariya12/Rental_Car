import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useAppContext } from '../Context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Chrome, ChevronRight, X } from 'lucide-react';

const Login = ({ setShowLogin }) => {
  void motion;
  const { setToken, setUser, setIsOwner, fetchUser } = useAppContext();
  const [state, setState] = useState("login");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = state === "login" ? "/api/user/login" : "/api/user/register";
      const { data } = await axios.post(url, formData);

      if (data.status === 'success') {
        const accessToken = data.accessToken;
        const loggedInUser = data.data?.user;

        localStorage.setItem('token', accessToken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        setToken(accessToken);

        if (loggedInUser) {
          setUser(loggedInUser);
          setIsOwner(loggedInUser.role === 'owner' || loggedInUser.role === 'admin');
        } else {
          await fetchUser();
        }

        setShowLogin(false);
        toast.success(state === "login" ? "Welcome back!" : "Account created successfully");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Authentication failed");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_BASE_URL}/auth/google`;
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { type: "spring", damping: 25, stiffness: 300 }
    },
    exit: { opacity: 0, scale: 0.9, y: 20 }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => setShowLogin(false)} 
      className='fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm'
    >
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={(e) => e.stopPropagation()}
        className="sm:w-[450px] w-full bg-gray-900 border border-white/10 rounded-[32px] p-8 md:p-10 shadow-2xl relative overflow-hidden"
      >
        {/* Background Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-600/20 blur-[80px] rounded-full" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-red-600/10 blur-[80px] rounded-full" />

        <button 
          onClick={() => setShowLogin(false)}
          className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-white tracking-tight">
            {state === "login" ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-gray-400 mt-2 text-sm">
            {state === "login" ? "Enter your details to access your account" : "Join our exclusive car rental community"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence mode="wait">
            {state !== "login" && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="relative"
              >
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder-gray-500 outline-none focus:border-indigo-500 transition-all"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
              <Mail size={18} />
            </div>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder-gray-500 outline-none focus:border-indigo-500 transition-all"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
              <Lock size={18} />
            </div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder-gray-500 outline-none focus:border-indigo-500 transition-all"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {state === "login" && (
            <div className="flex justify-end">
              <button type="button" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300">
                Forgot password?
              </button>
            </div>
          )}

          <button 
            type="submit" 
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-2xl shadow-xl shadow-indigo-600/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-4"
          >
            {state === "login" ? "Sign In" : "Get Started"} <ChevronRight size={18} />
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-gray-900 px-4 text-gray-500 font-medium">Or continue with</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full bg-white text-black font-bold py-3.5 rounded-2xl flex items-center justify-center gap-3 hover:bg-gray-100 transition-all active:scale-[0.98] shadow-lg shadow-white/5"
        >
          <Chrome size={20} className="text-red-500" />
          Continue with Google
        </button>

        <p className="text-center text-sm text-gray-500 mt-8">
          {state === "login" ? "No account yet?" : "Already a member?"}
          <button
            onClick={() => setState(prev => (prev === "login" ? "register" : "login"))}
            className="ml-1 text-indigo-400 font-bold hover:underline"
          >
            {state === "login" ? "Create Account" : "Sign In"}
          </button>
        </p>
      </motion.div>
    </motion.div>
  );
};

export default Login;
