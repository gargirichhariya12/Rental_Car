import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Users, Car, CalendarCheck, TrendingUp, ArrowUpRight } from 'lucide-react';
import { toast } from 'react-hot-toast';

import { CardSkeleton } from '../../components/Skeleton';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get('/api/admin/stats');
        setStats(data.data);
      } catch (error) {
        toast.error('Failed to load admin stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
      {[1, 2, 3, 4].map(i => <CardSkeleton key={i} />)}
    </div>
  );

  const statCards = [
    { name: 'Total Users', value: stats?.usersCount, icon: <Users className="text-blue-400" />, trend: '+12%' },
    { name: 'Active Cars', value: stats?.carsCount, icon: <Car className="text-emerald-400" />, trend: '+5%' },
    { name: 'Total Bookings', value: stats?.bookingsCount, icon: <CalendarCheck className="text-amber-400" />, trend: '+28%' },
    { name: 'Total Revenue', value: `$${stats?.totalRevenue.toLocaleString()}`, icon: <TrendingUp className="text-indigo-400" />, trend: '+18%' },
  ];

  return (
    <div>
      <div className='mb-10'>
        <h1 className='text-3xl font-bold text-white mb-2'>Platform Overview</h1>
        <p className='text-gray-400'>Real-time analytics across the car rental ecosystem.</p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12'>
        {statCards.map((card) => (
          <div key={card.name} className='bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-xl hover:border-gray-700 transition-colors'>
            <div className='flex items-center justify-between mb-4'>
              <div className='p-3 bg-gray-800 rounded-xl'>{card.icon}</div>
              <span className='text-xs font-semibold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full flex items-center gap-1'>
                <ArrowUpRight size={12} /> {card.trend}
              </span>
            </div>
            <p className='text-gray-400 text-sm font-medium'>{card.name}</p>
            <h2 className='text-2xl font-bold mt-1'>{card.value}</h2>
          </div>
        ))}
      </div>

      <div className='grid grid-cols-1 xl:grid-cols-2 gap-8'>
        {/* Placeholder for charts or recent activity */}
        <div className='bg-gray-900 border border-gray-800 p-8 rounded-3xl h-80 flex items-center justify-center'>
          <p className='text-gray-500 italic'>Revenue Growth Chart (Upcoming)</p>
        </div>
        <div className='bg-gray-900 border border-gray-800 p-8 rounded-3xl h-80 flex items-center justify-center'>
          <p className='text-gray-500 italic'>Recent Platform Activity (Upcoming)</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
