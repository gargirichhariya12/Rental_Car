import logo from "../assets/logo.png";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "./Button";

const Footer = () => {
  const navLinks = [
    { label: "Home", to: "/" },
    { label: "Fleet", to: "/cars" },
    { label: "Reservations", to: "/my-bookings" },
  ];
  const socialIcons = [
    { label: "Facebook", Icon: Facebook },
    { label: "Twitter", Icon: Twitter },
    { label: "Instagram", Icon: Instagram },
    { label: "LinkedIn", Icon: Linkedin },
  ];
  const supportLinks = ['Help Center', 'Terms of Use', 'Privacy Policy', 'Insurance'];

  return (
    <footer className="bg-black border-t border-white/5 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          
          {/* Brand & Mission */}
          <div className="lg:col-span-4">
            <Link to="/" className="inline-block mb-6">
              <img src={logo} alt="RentalCar Logo" className="h-10 w-auto" />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-sm">
              Experience the pinnacle of automotive excellence. We provide a curated collection of world-class vehicles for discerning drivers who value precision, luxury, and unmatched performance.
            </p>
            <div className="flex gap-4">
              {socialIcons.map((item) => {
                const IconComponent = item.Icon;

                return (
                <button
                  key={item.label}
                  type="button"
                  aria-label={item.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-400 transition-all hover:border-red-600 hover:bg-red-600 hover:text-white"
                >
                  <IconComponent size={18} />
                </button>
                );
              })}
            </div>
          </div>

          {/* Navigation */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-bold mb-6 tracking-wide uppercase text-xs">Navigation</h3>
            <ul className="space-y-4">
              {navLinks.map((item) => (
                <li key={item.label}>
                  <Link to={item.to} className="text-gray-500 hover:text-white text-sm transition-colors flex items-center gap-2 group">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-bold mb-6 tracking-wide uppercase text-xs">Support</h3>
            <ul className="space-y-4">
              {supportLinks.map((item) => (
                <li key={item} className="text-gray-500 text-sm transition-colors hover:text-white">
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-4">
            <h3 className="text-white font-bold mb-6 tracking-wide uppercase text-xs">Newsletter</h3>
            <p className="text-gray-500 text-sm mb-6">Subscribe to receive exclusive offers and early access to our newest fleet additions.</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Email address" 
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-red-600 outline-none transition-all"
              />
              <Button variant="primary" size="md" className="bg-red-600 text-sm hover:bg-red-700">
                Join
              </Button>
            </div>
          </div>
        </div>

        {/* Lower Footer */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-wrap justify-center gap-8 text-[11px] font-medium text-gray-600 uppercase tracking-widest">
            <div className="flex items-center gap-2"><MapPin size={12} /> Indore, India</div>
            <div className="flex items-center gap-2"><Phone size={12} /> +91 702 475 6945</div>
            <div className="flex items-center gap-2"><Mail size={12} /> prestige@rentals.com</div>
          </div>
          <p className="text-gray-600 text-[11px] uppercase tracking-widest font-medium">
            © 2026 PRESTIGE RENTALS. DESIGNED FOR EXCELLENCE.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
