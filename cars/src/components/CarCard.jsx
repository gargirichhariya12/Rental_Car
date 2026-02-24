import React from 'react'
import { User, MapPin, Car, Fuel } from 'lucide-react'
import { useNavigate } from 'react-router-dom';

const CarCard = ({ car }) => {
  
  const navigate = useNavigate()
  return (
    <div onClick={() => {navigate(`/CarDetails/${car._id}`); scrollTo(0, 0); }} className="bg-[#0b0b0b] rounded-xl overflow-hidden  gradient-border  transition  gap-10 ">

      {/* Image */}
      <div className="relative overflow-hidden">
        <img
          src={car.image}
          alt={`${car.brand} ${car.model}`}
          className="w-full h-48 transition-transform duration-500 group-hover:scale-110 object-cover"
        />

        {car.isAvailable && (
          <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs px-3 py-1 rounded-full">
            Available Now
          </span>
        )}

        <span className="absolute bottom-3 right-3 bg-black/70 text-white text-sm px-3 py-1 rounded-md">
          ${car.pricePerDay}/day
        </span>
      </div>

      {/* Content */}
      <div className="p-5 text-white item-center">
        <h3 className="text-lg font-semibold">
          {car.brand} {car.model}
        </h3>
        <p className="text-sm text-gray-400">
          {car.category} • {car.year}
        </p>

        <div className='mt-4 grid grid-cols-2 gap-y-2 text-gray-600'>
                    <div className='flex items-center text-sm gap-2text-muted-foreground'>
                        <User />
                        <span>{car.seating_capacity} seats</span>
                    </div>
                    <div className='flex items-center text-sm text-muted-foreground'>
                        <Fuel />
                        <span> {car.fuel_type} </span>
                    </div>
                    <div className='flex items-center text-sm text-muted-foreground'>
                        <Car />
                        <span>{car.transmission} </span>
                    </div>
                    <div className='flex items-center text-sm text-muted-foreground'>
                        <MapPin />
                        <span>{car.location} </span>
                    </div>
                </div>

      </div>
    </div>
  );
};

export default CarCard;
