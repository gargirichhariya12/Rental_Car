import React from 'react';
import { User, MapPin, Car, Fuel, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const CarCard = ({ car }) => {
  void motion;
  const navigate = useNavigate();
  const currency = import.meta.env.VITE_CURRENCY || '$';
  const ratingLabel = typeof car.averageRating === 'number' && car.averageRating > 0
    ? car.averageRating.toFixed(1)
    : 'New';

  return (
    <motion.div
      whileHover={{ y: -10, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onClick={() => { navigate(`/CarDetails/${car._id}`); window.scrollTo(0, 0); }}
      className="group cursor-pointer bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300"
    >
      {/* Image Container */}
      <div className="relative h-56 overflow-hidden">
        <motion.img
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.6 }}
          src={car.image}
          alt={`${car.brand} ${car.model}`}
          className="w-full h-full object-cover"
        />

        {/* Status Badge */}
        {car.isAvailable && (
          <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-green-500 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            Available
          </div>
        )}

        {/* Price Badge */}
        <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-md border border-white/10 text-white px-4 py-2 rounded-2xl shadow-xl">
          <span className="text-xs text-gray-400 font-medium">From </span>
          <span className="text-lg font-bold">{currency}{car.pricePerDay}</span>
          <span className="text-xs text-gray-400">/day</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">
              {car.brand} {car.model}
            </h3>
            <p className="text-sm text-gray-500">
              {car.category} • {car.year}
            </p>
          </div>
          <div className="flex items-center gap-1 text-amber-400 bg-amber-400/10 px-2 py-1 rounded-lg">
            <Star size={14} fill="currentColor" />
            <span className="text-sm font-bold">{ratingLabel}</span>
          </div>
        </div>

        <div className='mt-6 grid grid-cols-2 gap-4'>
          <div className='flex items-center gap-2 text-gray-400 text-sm'>
            <div className="p-1.5 bg-gray-800 rounded-lg"><User size={14} /></div>
            <span>{car.seating_capacity} Seats</span>
          </div>
          <div className='flex items-center gap-2 text-gray-400 text-sm'>
            <div className="p-1.5 bg-gray-800 rounded-lg"><Fuel size={14} /></div>
            <span>{car.fuel_type}</span>
          </div>
          <div className='flex items-center gap-2 text-gray-400 text-sm'>
            <div className="p-1.5 bg-gray-800 rounded-lg"><Car size={14} /></div>
            <span>{car.transmission}</span>
          </div>
          <div className='flex items-center gap-2 text-gray-400 text-sm'>
            <div className="p-1.5 bg-gray-800 rounded-lg"><MapPin size={14} /></div>
            <span className="truncate">{car.location}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CarCard;
