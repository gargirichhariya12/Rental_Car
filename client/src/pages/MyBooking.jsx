import Heading from '../components/Heading';
import React, { useEffect, useState } from 'react';
import { MapPin, CreditCard, ChevronRight } from 'lucide-react';
import { useAppContext } from '../Context/AppContext';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import StatusBadge from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';
import Loader from '../components/Loader';

function MyBooking() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currency, token } = useAppContext();

  const fetchMyBookings = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/bookings/user');
      if (data.status === 'success') {
        setBookings(data.data.bookings);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (bookingId) => {
    try {
      const { data } = await axios.post(`/api/bookings/checkout/${bookingId}`);
      if (data.status === 'success' && data.sessionUrl) {
        window.location.href = data.sessionUrl;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to initiate payment");
    }
  };

  useEffect(() => {
    if (token) fetchMyBookings();
  }, [token]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className='px-6 md:px-16 lg:px-32 2xl:px-48 text-sm glow-bg pb-20' >
      <Heading heading="My Bookings" />
      
      {bookings.length === 0 ? (
        <EmptyState
          title='You have no bookings yet'
          description='Once you reserve a car, your trips and payments will appear here.'
        />
      ) : (
        <div className="space-y-6 mt-10">
          {bookings.map((booking, index) => (
            <div key={booking._id} className='grid grid-cols-1 lg:grid-cols-3 w-full gap-6 gradient-border rounded-2xl overflow-hidden bg-gray-900/80 backdrop-blur-md shadow-xl'>
              <div className='p-4'>
                <div className='rounded-xl overflow-hidden shadow-2xl'>
                  <img src={booking.car.image} alt='' className='w-full h-auto aspect-video object-cover hover:scale-105 transition-transform duration-500' />
                </div>
              </div>

              {/* Booking Info */}
              <div className='lg:col-span-2 p-6 flex flex-col justify-between'>
                <div>
                  <div className='flex items-center justify-between mb-2'>
                    <div className='flex gap-2'>
                      <StatusBadge label={`Booking #${index + 1}`} tone='neutral' className='font-medium' />
                      <StatusBadge
                        label={booking.status}
                        tone={booking.status === 'confirmed' ? 'success' : booking.status === 'pending' ? 'warning' : 'danger'}
                        className='font-bold uppercase'
                      />
                      {booking.paymentStatus === 'paid' && (
                        <StatusBadge label='Paid' tone='info' className='font-bold uppercase' />
                      )}
                    </div>
                  </div>

                  <h3 className='text-2xl font-bold text-white mb-1'>
                    {booking.car.brand} <span className="text-indigo-400">{booking.car.model}</span>
                  </h3>
                  <p className='text-gray-400 mb-6'>
                    {booking.car.year} • {booking.car.fuel_type} • {booking.car.transmission}
                  </p>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='flex items-start gap-3'>
                      <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                        <MapPin className='w-5 h-5' />
                      </div>
                      <div>
                        <p className='text-gray-500 text-xs font-medium uppercase tracking-wider'>Location</p>
                        <p className="text-gray-200">{booking.car.location}</p>
                      </div>
                    </div>
                    <div className='flex items-start gap-3'>
                      <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                        <CreditCard className='w-5 h-5' />
                      </div>
                      <div>
                        <p className='text-gray-500 text-xs font-medium uppercase tracking-wider'>Rental Period</p>
                        <p className="text-gray-200">
                          {new Date(booking.pickupDate).toLocaleDateString()} → {new Date(booking.returnDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='mt-8 pt-6 border-t border-gray-800 flex items-center justify-between'>
                  <div className='text-left'>
                    <p className='text-gray-500 text-xs mb-1'>Total Price</p>
                    <h2 className='text-3xl font-extrabold text-white'>
                      {currency}{booking.price.toLocaleString()}
                    </h2>
                  </div>

                  {booking.paymentStatus === 'unpaid' && booking.status !== 'cancelled' && (
                    <button 
                      onClick={() => handlePayment(booking._id)}
                      className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
                    >
                      Pay Now <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyBooking;
