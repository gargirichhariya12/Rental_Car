import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useLocation } from 'react-router-dom';
import { useAppContext } from '../Context/AppContext';
import CarCard from '../components/CarCard.jsx';
import EmptyState from '../components/EmptyState.jsx';
import Input from '../components/Input.jsx';
import Panel from '../components/Panel.jsx';
import Button from '../components/Button.jsx';
import { Filter, Search, RotateCcw, Sparkles, Users, WalletCards, Route } from 'lucide-react';

function Cars() {
  const { cars, fetchCar, isLoading } = useAppContext();
  const location = useLocation();
  const initialSearchLocation = location.state?.searchFilters?.location || '';
  const highlightRecommendations = Boolean(location.state?.highlightRecommendations);
  const [recommendationForm, setRecommendationForm] = useState({
    budget: '',
    passengers: '',
    fuelType: '',
    tripType: '',
    category: '',
    location: initialSearchLocation,
  });
  const [recommendations, setRecommendations] = useState([]);
  const [recommendationsLoading, setRecommendationsLoading] = useState(false);
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
  const tripTypes = ['city', 'family', 'business', 'adventure'];

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleRecommendationChange = (e) => {
    const { name, value } = e.target;
    setRecommendationForm((current) => ({ ...current, [name]: value }));
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

  const fetchRecommendations = async (e) => {
    e.preventDefault();

    try {
      setRecommendationsLoading(true);
      const { data } = await axios.post('/api/user/recommendations', recommendationForm);

      if (data.status === 'success') {
        setRecommendations(data.data.recommendations || []);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch recommendations");
    } finally {
      setRecommendationsLoading(false);
    }
  };

  return (
    <div className='min-h-screen glow-bg pb-20'>
      <div className='max-w-7xl mx-auto px-6 pt-10'>
        <Panel tone='glass' className={`mb-10 overflow-hidden ${highlightRecommendations ? 'border-emerald-500/30 shadow-[0_0_45px_rgba(16,185,129,0.12)]' : 'border-indigo-500/20'}`}>
          <div className='grid gap-8 lg:grid-cols-[1.2fr_0.8fr]'>
            <div>
              <div className='flex items-center gap-3 text-indigo-300'>
                <Sparkles className='h-5 w-5' />
                <span className='text-sm font-semibold uppercase tracking-[0.25em]'>Find My Car</span>
              </div>
              <h2 className='mt-4 text-3xl font-bold text-white'>Get tailored car picks in one step.</h2>
              <p className='mt-3 max-w-2xl text-sm text-gray-400'>
                Tell us about your budget, group size, and trip style. We will rank the best matches from the live inventory.
              </p>

              <form onSubmit={fetchRecommendations} className='mt-6 grid gap-4 md:grid-cols-2'>
                <Input
                  name='budget'
                  type='number'
                  label='Budget per day'
                  placeholder='2500'
                  value={recommendationForm.budget}
                  onChange={handleRecommendationChange}
                  icon={<WalletCards className='h-4 w-4' />}
                />
                <Input
                  name='passengers'
                  type='number'
                  label='Passengers'
                  placeholder='4'
                  value={recommendationForm.passengers}
                  onChange={handleRecommendationChange}
                  icon={<Users className='h-4 w-4' />}
                />
                <Input
                  name='fuelType'
                  label='Fuel preference'
                  value={recommendationForm.fuelType}
                  onChange={handleRecommendationChange}
                  options={[
                    { value: '', label: 'Any fuel type' },
                    ...fuelTypes.map((fuel) => ({ value: fuel, label: fuel })),
                  ]}
                />
                <Input
                  name='tripType'
                  label='Trip type'
                  value={recommendationForm.tripType}
                  onChange={handleRecommendationChange}
                  options={[
                    { value: '', label: 'Any trip type' },
                    ...tripTypes.map((trip) => ({ value: trip, label: trip[0].toUpperCase() + trip.slice(1) })),
                  ]}
                />
                <Input
                  name='category'
                  label='Preferred category'
                  value={recommendationForm.category}
                  onChange={handleRecommendationChange}
                  options={[
                    { value: '', label: 'Any category' },
                    ...categories.filter((category) => category !== 'All').map((category) => ({ value: category, label: category })),
                  ]}
                />
                <Input
                  name='location'
                  label='Location'
                  placeholder='Mumbai'
                  value={recommendationForm.location}
                  onChange={handleRecommendationChange}
                  icon={<Route className='h-4 w-4' />}
                />
                <div className='md:col-span-2 flex flex-wrap gap-3'>
                  <Button type='submit' className='bg-indigo-600 hover:bg-indigo-500' disabled={recommendationsLoading}>
                    {recommendationsLoading ? 'Finding matches...' : 'Show recommendations'}
                  </Button>
                  {recommendations.length > 0 && (
                    <Button
                      type='button'
                      variant='secondary'
                      onClick={() => setRecommendations([])}
                    >
                      Clear results
                    </Button>
                  )}
                </div>
              </form>
            </div>

            <div className='rounded-3xl border border-white/10 bg-black/20 p-6'>
              <h3 className='text-lg font-semibold text-white'>What the matcher considers</h3>
              <div className='mt-5 space-y-3 text-sm text-gray-300'>
                <div className='rounded-2xl border border-white/10 bg-white/[0.03] p-4'>
                  Budget fit and current availability carry the strongest weight.
                </div>
                <div className='rounded-2xl border border-white/10 bg-white/[0.03] p-4'>
                  Passenger capacity, fuel type, category, and trip type refine the ranking.
                </div>
                <div className='rounded-2xl border border-white/10 bg-white/[0.03] p-4'>
                  Ratings and review volume help break ties between similar cars.
                </div>
              </div>
            </div>
          </div>
        </Panel>

        {recommendations.length > 0 && (
          <div className='mb-10'>
            <div className='mb-5 flex items-center justify-between gap-4'>
              <div>
                <h2 className='text-2xl font-bold text-white'>Recommended for your trip</h2>
                <p className='text-sm text-gray-400'>Top ranked cars based on your preferences.</p>
              </div>
              <span className='rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-200'>
                {recommendations.length} tailored matches
              </span>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8'>
              {recommendations.map((car) => (
                <CarCard key={`recommendation-${car._id}`} car={car} />
              ))}
            </div>
          </div>
        )}

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
