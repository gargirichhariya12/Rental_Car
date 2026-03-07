import React, { useEffect, useState } from 'react'
import Title from "../../components/Owner/Title";
import { dummyCarData } from '../../assets/dummyCarData'
import { Eye, EyeOff, Trash2 } from "lucide-react";

const ManageCar = () => {
  const currency = import.meta.env.VITE_CURRENCY
  const [cars, setCars] = useState([])

  const fetchOwnerCars = async () => {
    setCars(dummyCarData)
  }

  useEffect(() => {
    fetchOwnerCars()
  })
  return (
    <div className='px-4 pt-10 md:px-10 w-full'>
      <Title title='Manage Cars' subTitle='View all listed cars, update their details, or remove them from the booking platform' />

      <div className=' w-full rounded-md overflow-hidden border border-gray-300 mt-6'>

        <table className='w-full border border-collapse text-left text-sm text'>
          <thead>
            <tr className='bg-black/40'>
              <th className='p-3 font-medium'>Car</th>
              <th className='p-3 font-medium max-md:hidden'>Category</th>
              <th className='p-3 font-medium'>Price</th>
              <th className='p-3 font-medium max-md:hidden'>Status</th>
              <th className='p-3 font-medium'>Action</th>
            </tr>
          </thead>
          <tbody >
            {cars.map((car, index) => (
              <tr key={index} className='border-t border-gray-300'>
                <td className='p-3 flex items-center gap-3'>
                  <img src={car.image} alt="" className='h-12 w-12 aspect-square rounded-md object-cover' />
                  <div className='max-md:hidden'>
                    <p className='font-medium text'>{car.brand} {car.model}</p>
                    <p className='text-xs text-gray-400'>{car.seating_capacity} {car.transmission}</p>
                  </div>
                </td>
                <td className='p-3 max-md:hidden'>{car.category}</td>
                <td className='p-3 max-md:hidden'>{currency}{car.pricePerDay}/day</td>
                <td className='p-3 max-md:hidden'>
                  <span className={`px-3 py-1 rounded-full text-sx ${car.isAvaliable ? 'bg-green-100/20 text-green-500' : 'bg-red-100/20 text-red-500'}`}>
                    {car.isAvaliable ? 'Available' : 'Unavailable'}
                  </span>
                </td>
                <td className="flex items-center p-3 gap-2">
                  {car.isAvailable ? (
                    <Eye className="cursor-pointer" size={20} />) : (<EyeOff className="cursor-pointer" size={20} />)}
                  <Trash2 className="cursor-pointer" size={20} />
                </td>
              </tr>
            ))}
          </tbody>

        </table>

      </div>

    </div>
  )
}

export default ManageCar
