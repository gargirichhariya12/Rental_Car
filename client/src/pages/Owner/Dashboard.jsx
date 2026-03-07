import React, { useEffect, useState } from 'react'
import { dummyDashboardData } from '../../assets/dummyCarData'
import { Car, List, TriangleAlert, ListCheck , Calendar} from 'lucide-react'
import Title from '../../components/Owner/Title'

function Dashboard() {
  const [data, setData] = useState({
    totalCars: 0,
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    recentBooking: [],
    monthlyRevenue: 0
  })
  const DashBoardCard = [
    { title: 'Total Cars', value: data.totalCars, icon: <Car /> },
    { title: 'Total Booking', value: data.totalBookings, icon: <List /> },
    { title: 'Pending ', value: data.pendingBookings, icon: <TriangleAlert /> },
    { title: 'Completed ', value: data.completedBookings, icon: <ListCheck /> }
  ]
  useEffect(() => {
    setData(dummyDashboardData)
  })

  
  const { recentBookings, monthlyRevenue } = dummyDashboardData;

  return (
    <div className='px-4 pt-10 md:px-10 flex-1'>
      <Title title='Admin Dashboard' subTitle='Monitor overall platform performance including total cars, bookings, revenue, and recent activities' />

      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-8">
        {DashBoardCard.map((card, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-5 rounded-2xl 
                 bg-gradient-to-r from-[#0F0C29] via-[#302B63] to-[#24243E]
                 border border-white/20 shadow-lg"
          >
            <div>
              <h1 className="text-sm text-gray-300">{card.title}</h1>
              <p className="text-2xl font-bold text-white">{card.value}</p>
            </div>

            <div className="flex items-center justify-center w-11 h-11 rounded-full bg-white text-blue-600 shadow">
              {card.icon}
            </div>
          </div>
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
          {recentBookings.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Calendar className="text-blue-500 w-4" />
                </div>

                <div>
                  <p className="text-white text-sm font-medium">
                    {item.car.name}
                  </p>
                  <p className="text-gray-400 text-xs">
                    {new Date(item.pickupDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <p className="text-gray-300">${item.price}</p>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold
                  ${
                    item.status === "confirmed"
                      ? "bg-green-400/20 text-green-400"
                      : "bg-yellow-400/20 text-yellow-400"
                  }`}
                >
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Revenue */}
      <div className="p-6 rounded-2xl 
        bg-gradient-to-br from-black via-[#0b0f2f] to-black 
        border border-white/20 shadow-xl">

        <h2 className="text-white text-lg font-semibold">Monthly Revenue</h2>
        <p className="text-gray-400 text-sm mb-4">Revenue for current month</p>

        <h1 className="text-4xl font-bold text-blue-500">
          ${monthlyRevenue}
        </h1>
      </div>

    </div>



    </div>
   
  )
}

export default Dashboard
