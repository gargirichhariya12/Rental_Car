import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppContext } from '../Context/AppContext';
import CarCard from '../components/CarCard.jsx';
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
            <div className='bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl p-6 sticky top-24'>
              <div className='flex items-center justify-between mb-8'>
                <h3 className='text-white font-bold flex items-center gap-2'>
                  <Filter className='w-4 h-4 text-indigo-400' /> Filters
                </h3>
                <button 
                  onClick={resetFilters}
                  className='text-xs text-gray-500 hover:text-indigo-400 flex items-center gap-1 transition-colors'
                >
                  <RotateCcw className='w-3 h-3' /> Reset
                </button>
              </div>

              {/* Search by Location */}
              <div className="mb-6">
                <label className="text-gray-400 text-xs font-semibold uppercase mb-2 block">Location</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input 
                    name="location"
                    value={filters.location}
                    onChange={handleFilterChange}
                    placeholder="Search city..."
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-xl py-2 pl-10 pr-4 text-white text-sm focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              {/* Category */}
              <div className='mb-6'>
                <label className='text-gray-400 text-xs font-semibold uppercase mb-2 block'>Category</label>
                <div className='flex flex-wrap gap-2'>
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setFilters(prev => ({ ...prev, category: cat }))}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        filters.category === cat ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className='mb-6'>
                <label className='text-gray-400 text-xs font-semibold uppercase mb-2 block'>Price per day</label>
                <div className='flex gap-2 items-center'>
                  <input
                    type='number'
                    name='minPrice'
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                    placeholder='Min'
                    className='w-full bg-gray-800/50 border border-gray-700 rounded-xl py-2 px-3 text-white text-sm focus:border-indigo-500 outline-none'
                  />
                  <span className='text-gray-600'>-</span>
                  <input
                    type='number'
                    name='maxPrice'
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                    placeholder='Max'
                    className='w-full bg-gray-800/50 border border-gray-700 rounded-xl py-2 px-3 text-white text-sm focus:border-indigo-500 outline-none'
                  />
                </div>
              </div>

              {/* Fuel Type */}
              <div className='mb-6'>
                <label className='text-gray-400 text-xs font-semibold uppercase mb-2 block'>Fuel Type</label>
                <select
                  name='fuel_type'
                  value={filters.fuel_type}
                  onChange={handleFilterChange}
                  className='w-full bg-gray-800/50 border border-gray-700 rounded-xl py-2 px-3 text-white text-sm focus:border-indigo-500 outline-none'
                >
                  <option value=''>Any Fuel</option>
                  {fuelTypes.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className='text-gray-400 text-xs font-semibold uppercase mb-2 block'>Sort By</label>
                <select
                  name='sortBy'
                  value={filters.sortBy}
                  onChange={handleFilterChange}
                  className='w-full bg-gray-800/50 border border-gray-700 rounded-xl py-2 px-3 text-white text-sm focus:border-indigo-500 outline-none'
                >
                  <option value='newest'>Newest Arrivals</option>
                  <option value='priceLow'>Price: Low to High</option>
                  <option value='priceHigh'>Price: High to Low</option>
                  <option value='rating'>Top Rated</option>
                </select>
              </div>
            </div>
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
              <div className='text-center py-20 bg-gray-900/30 rounded-3xl border border-dashed border-gray-800'>
                <div className='mb-4 flex justify-center'>
                  <Search className='w-12 h-12 text-gray-700' />
                </div>
                <h3 className='text-white text-lg font-medium'>No cars found</h3>
                <p className='text-gray-500 text-sm mt-1'>Try adjusting your filters to find what you're looking for.</p>
                <button 
                  onClick={resetFilters}
                  className='mt-6 text-indigo-400 hover:text-indigo-300 font-semibold'
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cars;
