import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Calendar, Car, CircleDollarSign, List, ListCheck, TriangleAlert } from 'lucide-react';
import Title from '../../components/Owner/Title';
import StatCard from '../../components/Owner/StatCard';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';
import { useAppContext } from '../../Context/AppContext';

const initialData = {
  totalCars: 0,
  totalBookings: 0,
  pendingBookings: 0,
  completedBookings: 0,
  confirmedBookings: 0,
  cancelledBookings: 0,
  monthlyRevenueTotal: 0,
  recentBookings: [],
  monthlyRevenue: [],
  monthlyBookings: [],
  topCars: [],
  fleetUtilization: [],
  needsAttention: [],
};

const formatCompactNumber = (value) => Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value || 0);

function TrendChart({ title, subtitle, data = [], accent = 'bg-blue-500' }) {
  const maxValue = Math.max(...data.map((item) => item.value), 1);

  return (
    <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="mt-1 text-sm text-gray-400">{subtitle}</p>

      <div className="mt-6 flex items-end gap-3">
        {data.map((item) => (
          <div key={item.label} className="flex flex-1 flex-col items-center gap-3">
            <div className="flex h-36 w-full items-end rounded-2xl bg-white/[0.03] p-2">
              <div
                className={`w-full rounded-xl ${accent}`}
                style={{ height: `${Math.max(10, (item.value / maxValue) * 100)}%` }}
                title={`${item.label}: ${item.value}`}
              />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-white">{formatCompactNumber(item.value)}</p>
              <p className="text-xs uppercase tracking-[0.18em] text-gray-500">{item.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Dashboard() {
  const { currency } = useAppContext();
  const [data, setData] = useState(initialData);

  const dashboardCards = [
    { title: 'Fleet Live', value: data.totalCars, icon: <Car /> },
    { title: 'Bookings', value: data.totalBookings, icon: <List /> },
    { title: 'Pending', value: data.pendingBookings, icon: <TriangleAlert /> },
    { title: 'Revenue', value: `${currency}${formatCompactNumber(data.monthlyRevenueTotal)}`, icon: <CircleDollarSign /> },
  ];

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data } = await axios.post('/api/owner/dashboard');
        if (data.status === 'success') {
          setData((current) => ({ ...current, ...data.data }));
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load dashboard');
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div className='flex-1 px-4 pt-10 md:px-10'>
      <Title title='Owner Dashboard' subTitle='Monitor your fleet, revenue momentum, and the listings that deserve attention.' />

      <div className="my-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {dashboardCards.map((card) => (
          <StatCard key={card.title} title={card.title} value={card.value} icon={card.icon} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <div className="grid gap-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <TrendChart
              title="Revenue trend"
              subtitle="Paid booking revenue for the last 6 months"
              data={data.monthlyRevenue}
              accent="bg-emerald-500"
            />
            <TrendChart
              title="Booking volume"
              subtitle="How often customers are reserving your fleet"
              data={data.monthlyBookings}
              accent="bg-indigo-500"
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-white">Top-performing cars</h3>
                  <p className="mt-1 text-sm text-gray-400">Cars generating the most repeat demand.</p>
                </div>
                <StatusBadge label={`${data.topCars.length} tracked`} tone="info" />
              </div>

              <div className="mt-5 space-y-4">
                {data.topCars.length ? data.topCars.map((car, index) => (
                  <div key={car.carId} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm text-gray-400">#{index + 1} performer</p>
                        <p className="text-base font-semibold text-white">{car.label}</p>
                      </div>
                      <StatusBadge label={`${car.bookings} bookings`} tone="success" />
                    </div>
                    <p className="mt-3 text-sm text-gray-300">{currency}{formatCompactNumber(car.revenue)} revenue generated.</p>
                  </div>
                )) : (
                  <EmptyState
                    title='No standout cars yet'
                    description='Once bookings begin, your best-performing listings will appear here.'
                    className='border-white/10 bg-black/20 py-10'
                  />
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
              <h3 className="text-lg font-semibold text-white">Needs attention</h3>
              <p className="mt-1 text-sm text-gray-400">Quick operational signals based on your current booking mix.</p>

              <div className="mt-5 space-y-4">
                {data.needsAttention.map((item) => (
                  <div key={item.label} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-white">{item.label}</p>
                      <p className="text-xs text-gray-500">Live dashboard insight</p>
                    </div>
                    <StatusBadge label={String(item.value)} tone={item.tone} />
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-4">
                <p className="text-sm font-semibold text-indigo-100">Booking mix</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <StatusBadge label={`Pending ${data.pendingBookings}`} tone="warning" />
                  <StatusBadge label={`Confirmed ${data.confirmedBookings}`} tone="success" />
                  <StatusBadge label={`Completed ${data.completedBookings}`} tone="info" />
                  <StatusBadge label={`Cancelled ${data.cancelledBookings}`} tone="danger" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-black via-[#0b0f2f] to-black p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-white">Recent bookings</h2>
            <p className="mb-4 text-sm text-gray-400">Latest customer activity across your fleet.</p>

            <div className="space-y-4">
              {data.recentBookings.length > 0 ? data.recentBookings.map((item) => (
                <div key={item._id} className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10">
                      <Calendar className="w-4 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">
                        {item.car?.brand} {item.car?.model}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(item.pickupDate).toLocaleDateString()} to {new Date(item.returnDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-200">{currency}{formatCompactNumber(item.price)}</p>
                    <StatusBadge label={item.status} tone={item.status === 'confirmed' ? 'success' : undefined} className="mt-2 inline-flex" />
                  </div>
                </div>
              )) : (
                <EmptyState
                  title='No recent bookings'
                  description='Fresh reservations will appear here as customers start booking your cars.'
                  className='border-white/10 bg-black/20 py-10'
                />
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-white">Fleet utilization</h3>
                <p className="mt-1 text-sm text-gray-400">Booking share by car across your current fleet.</p>
              </div>
              <ListCheck className="text-emerald-400" />
            </div>

            <div className="mt-5 space-y-4">
              {data.fleetUtilization.length ? data.fleetUtilization.map((car) => (
                <div key={car.carId}>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-white">{car.label}</p>
                      <p className="text-xs text-gray-500">{car.bookedDays} booked days tracked</p>
                    </div>
                    <StatusBadge label={`${car.utilizationRate}%`} tone={car.utilizationRate > 35 ? 'success' : 'warning'} />
                  </div>
                  <div className="h-2 rounded-full bg-white/10">
                    <div
                      className={`h-2 rounded-full ${car.availabilityStatus === 'active' ? 'bg-emerald-500' : 'bg-yellow-500'}`}
                      style={{ width: `${Math.max(8, car.utilizationRate)}%` }}
                    />
                  </div>
                </div>
              )) : (
                <EmptyState
                  title='No utilization data yet'
                  description='Fleet usage will appear once your listings receive bookings.'
                  className='border-white/10 bg-black/20 py-10'
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
