import React, { useEffect, useState } from 'react'
import { dummyMyBookingsData } from '../../assets/dummyCarData'
import Title from '../../components/Owner/Title'

const ManageBooking = () => {
  const currency = import.meta.env.VITE_CURRENCY
  const [cars, setCars] = useState([])

  const [bookings, setBookings] = useState([])
  const fetchOwnerBooking = async () => {
    setBookings(dummyMyBookingsData)
  }

  useEffect(() => {
    fetchOwnerBooking()
  })
  return (
    <div className='px-4 pt-10 md:px-10 w-full'>
      <Title title='Manage Booking' subTitle='Track all customer bookings, approve or cancel requests, and manage booking statuses' />

      <div className=' w-full rounded-md overflow-hidden border border-gray-300 mt-6'>

        <table className='w-full border border-collapse text-left text-sm text'>
          <thead>
            <tr className='bg-black/40'>
              <th className='p-3 font-medium'>Car</th>
              <th className='p-3 font-medium max-md:hidden'>Date Range</th>
              <th className='p-3 font-medium'>Total</th>
              <th className='p-3 font-medium max-md:hidden'>Payment</th>
              <th className='p-3 font-medium'>Action</th>
            </tr>
          </thead>
          <tbody >
            {bookings.map((booking, index) => (
              <tr key={index} className='border-t border-gray-300 text'>
                <td className='p-3 flex items-center gap-3'>
                  <img src={booking.car.image} alt="" className='h-12 w-12 aspect-square rounded-md max-md:hidden' />
                  <p className='font-medium max-md:hidden'>{booking.car.brand} {booking.car.model}</p>
                </td>
                <td className='p-3 max-md:hidden'>
                  {booking.pickupDate.split('T')[0]} to {booking.returnDate.split('T')[0]}
                </td>
                <td className='p-3'>
                  {currency} {booking.price}
                </td>
                <td className='p-3 max-md:hidden'>
                  <span className='bg-gray-100/10 px-3 py-1 rounded-full text-xs'>
                    Offline
                  </span>
                </td>

                <td className='p-3 '>
                  {booking.status === 'pending' ? (<select>
                    <option value="pending">pending </option>
                    <option value="pending">Cancelled </option>
                    <option value="pending">Confirmed </option>
                  </select>) : (
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${booking.status === 'confirmed' ? 'bg-green-100/10 text-green-500' : 'bg-red-100/10 text-red-500'}`}>{booking.status}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>

        </table>

      </div>

    </div>
  )
}

export default ManageBooking
