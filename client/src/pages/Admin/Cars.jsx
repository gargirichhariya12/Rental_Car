import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { CarFront, MapPin, UserRound } from 'lucide-react';
import { TableSkeleton } from '../../components/Skeleton';
import EmptyState from '../../components/EmptyState';
import Panel from '../../components/Panel';

const AdminCars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const { data } = await axios.get('/api/admin/cars');
        setCars(data.data.cars || []);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load cars');
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  if (loading) {
    return <TableSkeleton rows={6} />;
  }

  if (cars.length === 0) {
    return (
      <EmptyState
        icon={CarFront}
        title='No cars listed yet'
        description='Cars from owners will appear here once they are added to the platform.'
      />
    );
  }

  return (
    <div>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-white mb-2'>Global Car Inventory</h1>
        <p className='text-gray-400'>View all listed cars across the platform.</p>
      </div>

      <div className='grid grid-cols-1 xl:grid-cols-2 gap-6'>
        {cars.map((car) => (
          <Panel key={car._id} className='overflow-hidden' padding='p-0'>
            <img src={car.image} alt={`${car.brand} ${car.model}`} className='h-56 w-full object-cover' />

            <div className='p-6'>
              <div className='flex items-start justify-between gap-4'>
                <div>
                  <h2 className='text-xl font-bold text-white'>{car.brand} {car.model}</h2>
                  <p className='text-gray-400 text-sm'>{car.category} • {car.year}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${car.isAvailable ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                  {car.isAvailable ? 'Available' : 'Unavailable'}
                </span>
              </div>

              <div className='mt-5 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-300'>
                <div className='flex items-center gap-2'>
                  <CarFront size={16} className='text-indigo-400' />
                  <span>{car.transmission} • {car.fuel_type}</span>
                </div>
                <div className='flex items-center gap-2'>
                  <MapPin size={16} className='text-indigo-400' />
                  <span>{car.location}</span>
                </div>
                <div className='flex items-center gap-2'>
                  <UserRound size={16} className='text-indigo-400' />
                  <span>{car.owner?.name || 'Unknown owner'}</span>
                </div>
                <div className='text-gray-400'>
                  ${car.pricePerDay}/day
                </div>
              </div>
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
};

export default AdminCars;
