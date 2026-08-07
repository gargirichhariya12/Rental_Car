import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import Title from '../../components/Owner/Title'
import StatusBadge from '../../components/StatusBadge'
import EmptyState from '../../components/EmptyState'

const ManageBooking = () => {
  const currency = import.meta.env.VITE_CURRENCY || '₹'
  const [bookings, setBookings] = useState([])
  const fetchOwnerBooking = async () => {
    try {
      const { data } = await axios.get('/api/bookings/owner');
      if (data.status === 'success') {
        setBookings(data.data.bookings);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch bookings");
    }
  }

  const updateBookingStatus = async (bookingId, status) => {
    try {
      const { data } = await axios.post('/api/bookings/change-status', { bookingId, status });
      if (data.status === 'success') {
        toast.success("Booking status updated");
        setBookings((currentBookings) => currentBookings.map((booking) => (
          booking._id === bookingId ? { ...booking, status: data.data.booking.status } : booking
        )));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update booking");
    }
  };

  useEffect(() => {
    const loadBookings = async () => {
      await fetchOwnerBooking();
    };

    loadBookings();
  }, [])
  return (
    <div className='px-4 pt-10 md:px-10 w-full'>
      <Title title='Manage Booking' subTitle='Track all customer bookings, approve or cancel requests, and manage booking statuses' />

      {bookings.length === 0 ? (
        <div className='mt-6'>
          <EmptyState
            title='No bookings to manage'
            description='Customer reservations will show up here once renters start booking your cars.'
          />
        </div>
      ) : (
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
            {bookings.map((booking) => (
              <tr key={booking._id} className='border-t border-gray-300 text'>
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
                  <StatusBadge
                    label={booking.paymentStatus || 'unpaid'}
                    tone={booking.paymentStatus === 'paid' ? 'info' : 'neutral'}
                  />
                </td>

                <td className='p-3 '>
                  {booking.status === 'pending' ? (<select
                    value={booking.status}
                    onChange={(e) => updateBookingStatus(booking._id, e.target.value)}
                    className='bg-black/40 border border-gray-500 rounded-md px-2 py-1 text-white'
                  >
                    <option value="pending">Pending</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="confirmed">Confirmed</option>
                  </select>) : (
                    <StatusBadge
                      label={booking.status}
                      tone={booking.status === 'confirmed' ? 'success' : 'danger'}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>

        </table>

      </div>
      )}

    </div>
  )
}

export default ManageBooking
