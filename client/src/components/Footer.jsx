import logo from "../assets/logo.png";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
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
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-bold mb-6 tracking-wide uppercase text-xs">Navigation</h3>
            <ul className="space-y-4">
              {['Home', 'Fleet', 'Special Offers', 'Reservations'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-500 hover:text-white text-sm transition-colors flex items-center gap-2 group">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-bold mb-6 tracking-wide uppercase text-xs">Support</h3>
            <ul className="space-y-4">
              {['Help Center', 'Terms of Use', 'Privacy Policy', 'Insurance'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-500 hover:text-white text-sm transition-colors">{item}</a>
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
              <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all active:scale-95">
                Join
              </button>
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
