import React from 'react'

import CarCard from './CarCard';
import Heading from './Heading';
import { useAppContext } from '../Context/AppContext';

const FeatureBoard = () => {
  const { cars } = useAppContext();
  const featuredCars = cars.slice(0, 3);

  return (
    <div className='bg-black '>
      <div className='mx-auto max-w-7xl px-6 py-16'>
        <Heading heading="Your Trip Begins Here" />
        {featuredCars.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {featuredCars.map((car) => (
              <CarCard key={car._id} car={car} />
            ))}
          </div>
        ) : (
          <div className='rounded-3xl border border-dashed border-white/10 bg-white/[0.03] px-6 py-12 text-center text-gray-400'>
            Featured vehicles will appear here once the fleet is loaded.
          </div>
        )}
      </div>
    </div>
  );
};

export default FeatureBoard
