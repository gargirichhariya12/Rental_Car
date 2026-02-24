import React from 'react'
import banner01 from '../assets/banner01.png'
import Heading from './Heading';

function Banner() {
  return (
    <div className='flex flex-row bg-black px-16 py-8 pb-16  h-80'>
        <div className='w-1/2 h-full relative pl-4'>
            <img src={banner01} alt="Banner" className="w-full h-full object-cover" />
        </div>
        <div className='w-1/2 flex flex-col justify-center items-center text-white  p-4'>
            <Heading heading="Unmatched Performance" className="mb-4" />

           <div className = "text-[#AEB7ED] gradient-border p-4  w-1/2  items-center justify-center rounded-lg">
            <ul className='list-disc px-4'>
                <li>0–100 km/h in ~3s</li>
                <li>Dual-Motor AWD</li>
                <li>Instant Electric Torque</li>
                <li>Precision Handling</li>
            </ul>
           </div>
                                                                          
        </div>
      
    </div>
  )
}

export default Banner
