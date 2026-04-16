import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import Loader from '../components/Loader';
import DateInput from '../components/DateInput';
import Button from '../components/Button';
import AvailabilityCalendar from '../components/AvailabilityCalendar';
import { useAppContext } from '../Context/AppContext';
import { ArrowLeft, Fuel, Car, User, MapPin, BadgeCheck } from 'lucide-react';

const todayKey = new Date().toISOString().split('T')[0];

const datesOverlap = (pickupDate, returnDate, blockedRanges) => {
  if (!pickupDate || !returnDate) {
    return false;
  }

  return blockedRanges.some((range) => pickupDate < range.endDate && returnDate > range.startDate);
};

function CarDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, user, setShowLogin } = useAppContext();
  const [car, setCar] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [availabilityLoading, setAvailabilityLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingDates, setBookingDates] = useState({
    pickupDate: '',
    returnDate: '',
  });

  const currency = import.meta.env.VITE_CURRENCY || '₹';
  const ownerId = typeof car?.owner === 'object' ? car.owner?._id : car?.owner;
  const isOwnedByCurrentUser = Boolean(user?._id && ownerId && user._id === ownerId);

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        setAvailabilityLoading(true);
        const [carResponse, availabilityResponse] = await Promise.all([
          axios.get(`/api/user/cars/${id}`),
          axios.get(`/api/bookings/availability/${id}`),
        ]);

        if (carResponse.data.status === 'success') {
          setCar(carResponse.data.data.car);
        }

        if (availabilityResponse.data.status === 'success') {
          setAvailability(availabilityResponse.data.data.blockedRanges || []);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load car details');
        navigate('/cars');
      } finally {
        setAvailabilityLoading(false);
      }
    };

    fetchPageData();
  }, [id, navigate]);

  const dateConflict = datesOverlap(bookingDates.pickupDate, bookingDates.returnDate, availability);
  const invalidDateOrder = Boolean(
    bookingDates.pickupDate &&
    bookingDates.returnDate &&
    bookingDates.returnDate <= bookingDates.pickupDate
  );
  const bookingError = invalidDateOrder
    ? 'Return date must be after pickup date.'
    : dateConflict
      ? 'Those dates overlap with an existing booking. Please choose another range.'
      : '';

  const updateBookingDate = (field, value) => {
    setBookingDates((currentDates) => {
      const nextDates = { ...currentDates, [field]: value };

      if (field === 'pickupDate' && nextDates.returnDate && nextDates.returnDate <= value) {
        nextDates.returnDate = '';
      }

      return nextDates;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setShowLogin(true);
      return;
    }

    if (isOwnedByCurrentUser) {
      toast.error('You cannot book your own car');
      return;
    }

    if (bookingError) {
      toast.error(bookingError);
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
        <Button
          onClick={() => navigate(-1)}
          variant='secondary'
          className='mb-6 gradient-border bg-black/40 text'
          startIcon={<ArrowLeft />}
        >
          Back to all cars
        </Button>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12'>
          <div className='lg:col-span-2'>
            <img src={car.image} alt={`${car.brand} ${car.model}`} className='w-full h-auto object-cover rounded-2xl mb-6 border border-gray-800' />
            <div className='space-y-6'>
              <div>
                <h1 className='text-3xl font-bold text'>{car.brand} {car.model}</h1>
                <p className='text-gray-500 text-lg'>{car.category} • {car.year}</p>
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

              <AvailabilityCalendar
                blockedRanges={availability}
                selection={bookingDates}
              />

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

            {isOwnedByCurrentUser ? (
              <>
                <div className='rounded-2xl border border-indigo-500/30 bg-indigo-500/10 px-4 py-4 text-sm text-indigo-200'>
                  This car belongs to you, so it cannot be booked from this account.
                </div>
                <Button
                  type="button"
                  fullWidth
                  variant='secondary'
                  className='font-medium'
                  onClick={() => navigate('/owner/manage-cars')}
                >
                  Manage Listing
                </Button>
              </>
            ) : (
              <>
                <DateInput
                  id='pickup-date'
                  label='Pickup Date'
                  min={todayKey}
                  value={bookingDates.pickupDate}
                  onChange={(e) => updateBookingDate('pickupDate', e.target.value)}
                  required
                  className='text'
                />

                <DateInput
                  id='return-date'
                  label='Return Date'
                  min={bookingDates.pickupDate || todayKey}
                  value={bookingDates.returnDate}
                  onChange={(e) => updateBookingDate('returnDate', e.target.value)}
                  required
                  className='text'
                />
                {availabilityLoading ? (
                  <p className='text-sm text-gray-400'>Checking live availability...</p>
                ) : bookingError ? (
                  <p className='rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-200'>
                    {bookingError}
                  </p>
                ) : bookingDates.pickupDate && bookingDates.returnDate ? (
                  <p className='rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200'>
                    Your dates are open based on the latest booking calendar.
                  </p>
                ) : (
                  <p className='rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-gray-300'>
                    Select pickup and return dates to validate them against the live booking calendar.
                  </p>
                )}
                <Button
                  type="submit"
                  disabled={isSubmitting || availabilityLoading || Boolean(bookingError)}
                  fullWidth
                  variant='primary'
                  className='bg-blue-600 font-medium hover:bg-blue-700'
                >
                  {isSubmitting ? 'Booking...' : 'Book Now'}
                </Button>
                <p className='text-center text text-sm'>No credit card required to reserve</p>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default CarDetails;
