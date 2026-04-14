import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { Car, List, TriangleAlert, ListCheck , Calendar} from 'lucide-react'
import Title from '../../components/Owner/Title'
import StatCard from '../../components/Owner/StatCard'
import StatusBadge from '../../components/StatusBadge'
import EmptyState from '../../components/EmptyState'
import { useAppContext } from '../../Context/AppContext'

function Dashboard() {
  const { currency } = useAppContext();
  const [data, setData] = useState({
    totalCars: 0,
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    recentBookings: [],
    monthlyRevenue: 0
  })
  const dashboardCards = [
    { title: 'Total Cars', value: data.totalCars, icon: <Car /> },
    { title: 'Total Booking', value: data.totalBookings, icon: <List /> },
    { title: 'Pending ', value: data.pendingBookings, icon: <TriangleAlert /> },
    { title: 'Completed ', value: data.completedBookings, icon: <ListCheck /> }
  ];
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data } = await axios.post('/api/owner/dashboard');
        if (data.status === 'success') {
          setData(data.data);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load dashboard");
      }
    };

    fetchDashboard();
  }, [])

  
  const { recentBookings = [], monthlyRevenue } = data;

  return (
    <div className='px-4 pt-10 md:px-10 flex-1'>
      <Title title='Owner Dashboard' subTitle='Monitor your fleet, bookings, revenue, and recent rental activity.' />

      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-8">
        {dashboardCards.map((card, index) => (
          <StatCard
            key={index}
            title={card.title}
            value={card.value}
            icon={card.icon}
          />
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-6 mt-8">
      
      {/* Recent Bookings */}
      <div className="md:col-span-2 p-6 rounded-2xl 
        bg-gradient-to-br from-black via-[#0b0f2f] to-black 
        border border-white/20 shadow-xl">

        <h2 className="text-white text-lg font-semibold">Recent Bookings</h2>
        <p className="text-gray-400 text-sm mb-4">Latest customer bookings</p>

        <div className="space-y-4">
          {recentBookings.length > 0 ? recentBookings.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Calendar className="text-blue-500 w-4" />
                </div>

                <div>
                  <p className="text-white text-sm font-medium">
                    {item.car?.brand} {item.car?.model}
                  </p>
                  <p className="text-gray-400 text-xs">
                    {new Date(item.pickupDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <p className="text-gray-300">{currency}{item.price}</p>

                <StatusBadge
                  label={item.status}
                  tone={item.status === 'confirmed' ? 'success' : 'warning'}
                />
              </div>
            </div>
          )) : (
            <EmptyState
              title='No recent bookings'
              description='Fresh reservations will appear here as customers book your cars.'
              className='border-white/10 bg-black/20 py-10'
            />
          )}
        </div>
      </div>

      {/* Monthly Revenue */}
      <div className="p-6 rounded-2xl 
        bg-gradient-to-br from-black via-[#0b0f2f] to-black 
        border border-white/20 shadow-xl">

        <h2 className="text-white text-lg font-semibold">Monthly Revenue</h2>
        <p className="text-gray-400 text-sm mb-4">Revenue for current month</p>

        <h1 className="text-4xl font-bold text-blue-500">
          {currency}{monthlyRevenue}
        </h1>
      </div>

    </div>



    </div>
   
  )
}

export default Dashboard
