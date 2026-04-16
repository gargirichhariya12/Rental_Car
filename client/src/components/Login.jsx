import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useAppContext } from '../Context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Chrome, ChevronRight, X } from 'lucide-react';
import Button from './Button';
import Input from './Input';
import Modal from './Modal';

const Login = ({ setShowLogin }) => {
  void motion;
  const {
    setToken,
    setUser,
    setIsOwner,
    fetchUser,
    setShowLogin: setShowLoginFromContext,
  } = useAppContext();
  const [state, setState] = useState("login");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const closeModal = () => (setShowLogin || setShowLoginFromContext)(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      const url = state === "login" ? "/api/user/login" : "/api/user/register";
      const payload = {
        ...formData,
        name: formData.name.trim(),
        email: formData.email.trim(),
      };
      const { data } = await axios.post(url, payload);

      if (data.status === 'success') {
        const accessToken = data.accessToken;
        const loggedInUser = data.data?.user;

        localStorage.setItem('token', accessToken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        setToken(accessToken);

        if (loggedInUser) {
          setUser(loggedInUser);
          setIsOwner(loggedInUser.role === 'owner');
        } else {
          await fetchUser();
        }

        closeModal();
        toast.success(state === "login" ? "Welcome back!" : "Account created successfully");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Authentication failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    if (isSubmitting) return;

    const launchGoogleLogin = async () => {
      const backendBaseUrl = import.meta.env.VITE_BASE_URL || window.location.origin;

      try {
        setIsSubmitting(true);

        const response = await fetch(`${backendBaseUrl}/`, {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Backend is unavailable');
        }

        window.location.assign(`${backendBaseUrl}/auth/google`);
      } catch {
        toast.error('Backend server is not running on http://localhost:3000');
      } finally {
        setIsSubmitting(false);
      }
    };

    void launchGoogleLogin();
  };

  return (
    <Modal onClose={closeModal}>
        {/* Background Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-600/20 blur-[80px] rounded-full" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-red-600/10 blur-[80px] rounded-full" />

        <button 
          onClick={closeModal}
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
                <Input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  className="py-3.5 pr-4"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  icon={<User size={18} />}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <Input
            type="email"
            name="email"
            placeholder="Email Address"
            className="py-3.5 pr-4"
            value={formData.email}
            onChange={handleChange}
            required
            icon={<Mail size={18} />}
          />

          <Input
            type="password"
            name="password"
            placeholder="Password"
            className="py-3.5 pr-4"
            value={formData.password}
            onChange={handleChange}
            required
            icon={<Lock size={18} />}
          />

          {state === "login" && (
            <div className="flex justify-end">
              <Button type="button" variant="link" className="text-xs font-semibold">
                Forgot password?
              </Button>
            </div>
          )}

          <Button
            type="submit" 
            disabled={isSubmitting}
            fullWidth
            variant="primary"
            size="lg"
            className="mt-4"
            endIcon={<ChevronRight size={18} />}
          >
            {isSubmitting ? "Please wait..." : state === "login" ? "Sign In" : "Get Started"}
          </Button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-gray-900 px-4 text-gray-500 font-medium">Or continue with</span>
          </div>
        </div>

        <Button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isSubmitting}
          fullWidth
          variant="light"
          size="md"
          startIcon={<Chrome size={20} className="text-red-500" />}
        >
          Continue with Google
        </Button>

        <p className="text-center text-sm text-gray-500 mt-8">
          {state === "login" ? "No account yet?" : "Already a member?"}
          <Button
            type="button"
            onClick={() => {
              setState((prev) => (prev === "login" ? "register" : "login"));
              setFormData({ name: "", email: "", password: "" });
            }}
            variant="link"
            className="ml-1 font-bold hover:underline"
          >
            {state === "login" ? "Create Account" : "Sign In"}
          </Button>
        </p>
    </Modal>
  );
};

export default Login;
