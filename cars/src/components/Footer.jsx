import logo from "../assets/logo.png";
const Footer = () => {
  return (
    <footer className="bg-black/95 text-gray-400 px-4 py-6 border-t border-gray-700">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10  ">
        
        {/* Brand Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <img
              src={logo}
              alt="RentalCar Logo"
              className="h-10 w-auto"
            />
          </div>
          <p className="text-sm leading-relaxed text-gray-300">
            Drive beyond expectations with a curated fleet of luxury and everyday
            cars, designed for every kind of journey.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-white transition">Home</li>
            <li className="hover:text-white transition">Cars</li>
            <li className="hover:text-white transition">My Booking</li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="text-white font-semibold mb-4">Resources</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-white transition">Help Center</li>
            <li className="hover:text-white transition">Terms of Service</li>
            <li className="hover:text-white transition">Privacy Policy</li>
            <li className="hover:text-white transition">Insurance</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white font-semibold mb-4">Contact</h3>
          <ul className="space-y-2 text-sm">
            <li>1234 Luxury Drive</li>
            <li>Indore, 452010</li>
            <li>+91 7024756945</li>
            <li className="hover:text-white transition cursor-pointer">
              rentalcar@example.com
            </li>
          </ul>
        </div>

      </div>

      {/* Footer Bottom */}
      <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm text-gray-500">
        © 2026 Gargi Richhariya. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
