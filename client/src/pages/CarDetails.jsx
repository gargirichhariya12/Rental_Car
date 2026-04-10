import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import Loader from '../components/Loader';
import { useAppContext } from '../Context/AppContext';
import { ArrowLeft, Fuel, Car, User, MapPin, BadgeCheck } from 'lucide-react';

function CarDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, setShowLogin } = useAppContext();
  const [car, setCar] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingDates, setBookingDates] = useState({
    pickupDate: '',
    returnDate: '',
  });

  const currency = import.meta.env.VITE_CURRENCY || '$';

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const { data } = await axios.get(`/api/user/cars/${id}`);
        if (data.status === 'success') {
          setCar(data.data.car);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load car details');
        navigate('/cars');
      }
    };

    fetchCarDetails();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setShowLogin(true);
      return;
    }

    try {
      setIsSubmitting(true);
      const { data } = await axios.post('/api/bookings/create', {
        car: id,
        pickupDate: bookingDates.pickupDate,
        returnDate: bookingDates.returnDate,
      });

      if (data.status === 'success') {
        toast.success('Booking created successfully');
        navigate('/my-bookings');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!car) return <Loader />;

  return (
    <div className='glow-bg min-h-screen p-6 md:p-10'>
      <div className='max-w-7xl mx-auto'>
        <button onClick={() => navigate(-1)} className='flex items-center gap-2 mb-6 text cursor-pointer gradient-border px-4 py-3 bg-black/40 rounded-xl'>
          <ArrowLeft />
          Back to all cars
        </button>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12'>
          <div className='lg:col-span-2'>
            <img src={car.image} alt={`${car.brand} ${car.model}`} className='w-full h-auto object-cover rounded-2xl mb-6 border border-gray-800' />
            <div className='space-y-6'>
              <div>
                <h1 className='text-3xl font-bold text'>{car.brand} {car.model}</h1>
                <p className='text-gray-500 text-lg'>{car.category} ● {car.year}</p>
              </div>
              <hr className="border border-gray-800 my-6" />

              <div className='grid grid-col-2 sm:grid-cols-4 gap-4'>
                {[
                  { icon: <User />, text: `${car.seating_capacity} Seats` },
                  { icon: <Fuel />, text: car.fuel_type },
                  { icon: <Car />, text: car.transmission },
                  { icon: <MapPin />, text: car.location }
                ].map(({ icon, text }) => (
                  <div
                    key={text}
                    className="flex flex-col items-center text justify-center bg-[#100C0C] p-3 rounded-lg border border-[#4C4AE0]"
                  >
                    {icon}
                    {text}
                  </div>
                ))}
              </div>

              <div>
                <h1 className='text-xl text font-medium mb-3'>Description</h1>
                <p className='text-gray-500'>{car.description}</p>
              </div>

              <div>
                <h1 className='text-xl text font-medium mb-3'>Features</h1>
                <ul className='grid grid-cols-2 sm:grid-cols-2 gap-2'>
                  {["360 Camera", "Bluetooth", "GPS", "Heated Seats", "Rear View Mirror"].map((item) => (
                    <li key={item} className='flex items-center text-gray-500 gap-2'>
                      <BadgeCheck />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className='shadow-lg h-max bg-gray-900/90 border border-gray-800 sticky top-24 rounded-2xl p-6 space-y-6 text-gray-300'>
            <p className='flex items-center text justify-between text-2xl text-white font-semibold'>
              {currency} {car.pricePerDay}
              <span className='text-base text-gray-400 font-normal'> Per day</span>
            </p>
            <hr className='border-borderColor my-6' />

            <div className='flex flex-col gap-2 text'>
              <label htmlFor='pickup-date'>Pickup Date</label>
              <input
                type="date"
                className='border border-gray-700 bg-black/40 px-3 py-2 rounded-lg text-white'
                required
                id='pickup-date'
                min={new Date().toISOString().split('T')[0]}
                value={bookingDates.pickupDate}
                onChange={(e) => setBookingDates((currentDates) => ({ ...currentDates, pickupDate: e.target.value }))}
              />
            </div>

            <div className='flex flex-col gap-2 text'>
              <label htmlFor='return-date'>Return Date</label>
              <input
                type="date"
                className='border border-gray-700 bg-black/40 px-3 py-2 rounded-lg text-white'
                required
                id='return-date'
                min={bookingDates.pickupDate || new Date().toISOString().split('T')[0]}
                value={bookingDates.returnDate}
                onChange={(e) => setBookingDates((currentDates) => ({ ...currentDates, returnDate: e.target.value }))}
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className='w-full bg-blue-600 hover:bg-blue-700 py-3 transition-all font-medium text-white rounded-xl cursor-pointer disabled:opacity-60'
            >
              {isSubmitting ? 'Booking...' : 'Book Now'}
            </button>
            <p className='text-center text text-sm'>No credit card required to reserve</p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CarDetails;
