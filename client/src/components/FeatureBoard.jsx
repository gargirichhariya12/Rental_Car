import React from 'react'

import CarCard from './CarCard';
import { dummyCarData } from '../assets/dummyCarData';
import Heading from './Heading';

const FeatureBoard = () => {
  return (
    <div className='bg-black '>
        <div className='max-w-7xl mx-auto px-6 py-16 '>
    <Heading heading="Your Trip Begins Here" />
    <div className="grid grid-cols-1 md:grid-cols-3  gap-16">
      {dummyCarData.map((car) => (
        <CarCard key={car._id} car={car} />
      ))}
      </div>
    </div>
    </div>
  );
};

export default FeatureBoard
