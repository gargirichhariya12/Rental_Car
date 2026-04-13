import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppContext } from '../Context/AppContext';
import CarCard from '../components/CarCard.jsx';
import EmptyState from '../components/EmptyState.jsx';
import Input from '../components/Input.jsx';
import Panel from '../components/Panel.jsx';
import Button from '../components/Button.jsx';
import { Filter, SlidersHorizontal, Search, RotateCcw } from 'lucide-react';

function Cars() {
  const { cars, fetchCar, isLoading } = useAppContext();
  const location = useLocation();
  const initialSearchLocation = location.state?.searchFilters?.location || '';
  const [filters, setFilters] = useState({
    category: 'All',
    fuel_type: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'newest',
    location: initialSearchLocation
  });

  const categories = ['All', 'Sedan', 'SUV', 'Luxury', 'Hatchback', 'Electric'];
  const fuelTypes = ['Petrol', 'Diesel', 'Electric', 'Hybrid'];

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({
      category: 'All',
      fuel_type: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'newest',
      location: ''
    });
  };

  useEffect(() => {
    fetchCar(filters);
  }, [filters, fetchCar]);

  return (
    <div className='min-h-screen glow-bg pb-20'>
      <div className='max-w-7xl mx-auto px-6 pt-10'>
        <div className='flex flex-col lg:flex-row gap-10'>
          
          {/* Sidebar Filters */}
          <div className='lg:w-1/4'>
            <Panel tone='glass' className='sticky top-24'>
              <div className='flex items-center justify-between mb-8'>
                <h3 className='text-white font-bold flex items-center gap-2'>
                  <Filter className='w-4 h-4 text-indigo-400' /> Filters
                </h3>
                <Button
                  onClick={resetFilters}
                  variant='link'
                  className='text-xs text-gray-500 hover:text-indigo-400'
                  startIcon={<RotateCcw className='w-3 h-3' />}
                >
                  Reset
                </Button>
              </div>

              {/* Search by Location */}
              <div className="mb-6">
                <label className="text-gray-400 text-xs font-semibold uppercase mb-2 block">Location</label>
                <Input
                  name="location"
                  value={filters.location}
                  onChange={handleFilterChange}
                  placeholder="Search city..."
                  className='rounded-xl border-gray-700 bg-gray-800/50 py-2 pl-10 pr-4 text-sm'
                  icon={<Search className="h-4 w-4" />}
                />
              </div>

              {/* Category */}
              <div className='mb-6'>
                <label className='text-gray-400 text-xs font-semibold uppercase mb-2 block'>Category</label>
                <div className='flex flex-wrap gap-2'>
                  {categories.map(cat => (
                    <Button
                      key={cat}
                      onClick={() => setFilters(prev => ({ ...prev, category: cat }))}
                      size='sm'
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                        filters.category === cat ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                      }`}
                    >
                      {cat}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className='mb-6'>
                <label className='text-gray-400 text-xs font-semibold uppercase mb-2 block'>Price per day</label>
                <div className='flex gap-2 items-center'>
                  <Input
                    type='number'
                    name='minPrice'
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                    placeholder='Min'
                    className='rounded-xl border-gray-700 bg-gray-800/50 py-2 px-3 text-sm'
                  />
                  <span className='text-gray-600'>-</span>
                  <Input
                    type='number'
                    name='maxPrice'
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                    placeholder='Max'
                    className='rounded-xl border-gray-700 bg-gray-800/50 py-2 px-3 text-sm'
                  />
                </div>
              </div>

              {/* Fuel Type */}
              <div className='mb-6'>
                <label className='text-gray-400 text-xs font-semibold uppercase mb-2 block'>Fuel Type</label>
                <Input
                  name='fuel_type'
                  value={filters.fuel_type}
                  onChange={handleFilterChange}
                  options={[
                    { value: '', label: 'Any Fuel' },
                    ...fuelTypes.map((fuel) => ({ value: fuel, label: fuel })),
                  ]}
                  className='rounded-xl border-gray-700 bg-gray-800/50 py-2 px-3 text-sm'
                />
              </div>

              {/* Sort By */}
              <div>
                <label className='text-gray-400 text-xs font-semibold uppercase mb-2 block'>Sort By</label>
                <Input
                  name='sortBy'
                  value={filters.sortBy}
                  onChange={handleFilterChange}
                  options={[
                    { value: 'newest', label: 'Newest Arrivals' },
                    { value: 'priceLow', label: 'Price: Low to High' },
                    { value: 'priceHigh', label: 'Price: High to Low' },
                    { value: 'rating', label: 'Top Rated' },
                  ]}
                  className='rounded-xl border-gray-700 bg-gray-800/50 py-2 px-3 text-sm'
                />
              </div>
            </Panel>
          </div>

          {/* Main Content */}
          <div className='lg:w-3/4'>
            <div className='flex items-center justify-between mb-8'>
              <h1 className='text-3xl font-bold text-white'>
                Explore <span className='text-indigo-400'>Cars</span>
              </h1>
              <p className='text-gray-500 text-sm'>
                {cars.length} cars available {filters.location && `in ${filters.location}`}
              </p>
            </div>

            {isLoading ? (
              <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                {[1, 2, 4, 5].map(i => (
                  <div key={i} className='h-80 bg-gray-800/50 animate-pulse rounded-3xl'></div>
                ))}
              </div>
            ) : cars.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {cars.map((car) => (
                  <CarCard key={car._id} car={car} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Search}
                title='No cars found'
                description="Try adjusting your filters to find what you're looking for."
                actionLabel='Clear all filters'
                onAction={resetFilters}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cars;
