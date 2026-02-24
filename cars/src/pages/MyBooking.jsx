import Heading from '../components/Heading'
import React, { useEffect } from 'react'
import { useState } from 'react';
import { dummyMyBookingsData } from '../assets/dummyCarData';
import { MapPin } from 'lucide-react';

function MyBooking() {
  const [booking, setBooking] = useState([]);
  const currency = import.meta.env.VITE_CURRENCY;

  const fetchMyBooking = async () => {
    setBooking(dummyMyBookingsData)
  }

  useEffect(() => {
    fetchMyBooking();
  }, [])
  // console.log(booking[0])
  return (
    <div className='px-6 md:px-16 lg:px-32 2xl:px-48 text-sm text glow-bg pb-3' >
      <Heading heading="My Bookings" />
      {/* <p className='text-gray-400 '>View and manage your car rental bookings</p> */}

      <div>
        {booking.map((booking, index) => (
          <div key={booking._id} className='grid grid-cols-1 lg:grid-cols-3 w-full gap-6 gradient-border rounded-lg mt-5 first:mt-12 bg-black/70'>
            <div className='md:col-spn-1 p-4'>
              <div className='rounded-md overflow-hidden md-3'>

                <img src={booking.car.image} alt='' className='w-full h-auto aspect-video object-cover' />
              </div>
            </div>

            {/*Booking Info*/}
            <div className='md:col-span-2 p-3'>
              <div className='flex items-center gap-2'>
                <p className='px-3 py-1.5 bg-light rounded'>Booking #{index + 1} </p>
                <p className={`px-3 py-1.5 bg-light rounded-lg ${booking.status === 'confirmed' ? 'bg-green-400/15 text-green-600' : 'bg-red-400/15 text-red-600'} `}>{booking.status}</p>
              </div>
              <div className=' '>
                <p className='text-lg font-medium text-[#4C4AE0] '> {booking.car.brand} {booking.car.model}</p>
                <p className='text-gray-500'>{booking.car.year} ● {booking.car.category}  ●{booking.car.location}</p>
              </div>

              <div className=' flex flex-col md:flex-row md:justify-between gap-6 mt-4'>
                <div>

                  <div className='flex items-start gap-2 '>
                    <MapPin className='w-4 h-4' />
                    <div>
                      <p className='text-gray-500'>Pick-up Location</p>
                      <p>{booking.car.location}</p>
                    </div>
                  </div>
                  <div className='flex items-start gap-2 mt-3'>

                    <div>
                      <p>Rental Period</p>
                      <p>{booking.pickupDate.split('T')[0]} To {booking.returnDate.split('T')[0]}</p>
                    </div>
                  </div>
                </div>

                 <div className='md:col-span-1 flex flex-col justify-between gap-6'>
                  <div className='text-sm text-gray-500 text-right'>
                    <p >Total Price</p>
                    <h1 className='text-2xl font-semibold text-blue-700'> {currency}{booking.price}</h1>
                    <p> Booked on {booking.createdAt.split('T')[0]}</p>
                  </div>

                </div>

              </div>

            </div>


          </div>
        ))}
      </div>

    </div>
  )
}

export default MyBooking
