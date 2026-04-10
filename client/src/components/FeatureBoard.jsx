import React from 'react'

import CarCard from './CarCard';
import Heading from './Heading';
import { useAppContext } from '../Context/AppContext';

const FeatureBoard = () => {
  const { cars } = useAppContext();
  const featuredCars = cars.slice(0, 3);

  return (
    <div className='bg-black '>
        <div className='max-w-7xl mx-auto px-6 py-16 '>
    <Heading heading="Your Trip Begins Here" />
    <div className="grid grid-cols-1 md:grid-cols-3  gap-16">
      {featuredCars.map((car) => (
        <CarCard key={car._id} car={car} />
      ))}
      </div>
    </div>
    </div>
  );
};

export default FeatureBoard
