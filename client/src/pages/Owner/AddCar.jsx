import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import Title from "../../components/Owner/Title";
import FormField from '../../components/Owner/FormField';
import { Upload, Check} from 'lucide-react'

const currency = import.meta.env.VITE_CURRENCY
const categoryOptions = [
  { value: '', label: 'Select a Category' },
  { value: 'Sedan', label: 'Sedan' },
  { value: 'SUV', label: 'SUV' },
  { value: 'Van', label: 'Van' },
];
const locationOptions = [
  { value: '', label: 'Select a location' },
  { value: 'Vijay Nagar', label: 'Vijay Nagar' },
  { value: 'Mahalaxmi Nagar', label: 'Mahalaxmi Nagar' },
  { value: 'C21', label: 'C21' },
];

const AddCar = () => {
  const navigate = useNavigate();

  const [image, setImage] = useState()
  const [car, setCar] = useState({
    brand: '',
    model: '',
    year: 0,
    pricePerDay: 0,
    category: '',
    fuel_type: '',
    seating_capacity: 0,
    location: '',
    description: '',
    transmission: ''
  })

  const onSubmitHandler = async (e) => {
    e.preventDefault()

    if (!image) {
      toast.error("Please upload a car image");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("carData", JSON.stringify({
        ...car,
        year: Number(car.year),
        pricePerDay: Number(car.pricePerDay),
        seating_capacity: Number(car.seating_capacity),
      }));

      const { data } = await axios.post('/api/owner/add-car', formData);
      if (data.status === 'success') {
        toast.success("Car listed successfully");
        navigate('/owner/manage-cars');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add car");
    }
  }
  return (
    <div className='px-4 py-10 md:px-10 flex-1 w-full'>
      <Title title='Add New Car' subTitle='Fill in details to list a new car for booking, including pricing, availability, and car specifications.' />

      <form onSubmit={onSubmitHandler} className='flex flex-col gap-5 text-gray-500 text-sm mt-6 '>
        <div className='grid grid-cols-2 gap-3'>
          <FormField
            label='Brand'
            value={car.brand}
            placeholder='eg- BMW, Mercedes, Audi...'
            onChange={(e) => setCar({ ...car, brand: e.target.value })}
          />
          <FormField
            label='Model'
            value={car.model}
            placeholder='e.g. X5, E-Class, M4....'
            onChange={(e) => setCar({ ...car, model: e.target.value })}
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 gap-3'>
          <FormField
            label='Year'
            type='number'
            value={car.year}
            placeholder='2025'
            onChange={(e) => setCar({ ...car, year: e.target.value })}
          />
          <FormField
            label={`Daily price(${currency})`}
            type='number'
            value={car.pricePerDay}
            placeholder='100'
            onChange={(e) => setCar({ ...car, pricePerDay: e.target.value })}
          />
          <FormField
            label='Category'
            value={car.category}
            options={categoryOptions}
            onChange={(e) => setCar({ ...car, category: e.target.value })}
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 gap-3'>
          <FormField
            label='Transmission'
            value={car.transmission}
            placeholder='Automatic'
            onChange={(e) => setCar({ ...car, transmission: e.target.value })}
          />
          <FormField
            label='Fuel Type'
            value={car.fuel_type}
            placeholder='Petrol'
            onChange={(e) => setCar({ ...car, fuel_type: e.target.value })}
          />
          <FormField
            label='Seating Capacity'
            type='number'
            value={car.seating_capacity}
            placeholder='5'
            onChange={(e) => setCar({ ...car, seating_capacity: e.target.value })}
          />
        </div>

        <FormField
          label='Location'
          value={car.location}
          options={locationOptions}
          onChange={(e) => setCar({ ...car, location: e.target.value })}
        />
        <FormField
          label='Description'
          value={car.description}
          placeholder='Tell renters what makes this car special'
          textarea
          onChange={(e) => setCar({ ...car, description: e.target.value })}
        />

        <div className="flex items-center gap-4">
          <label
            htmlFor="car-image"
            className="border-2 border-dashed border-gray-500 rounded-xl flex flex-col items-center justify-center h-[8rem] w-1/2 cursor-pointer hover:border-purple-500 transition"
          >
            {image ? (
              <img src={URL.createObjectURL(image)} alt="car" className="h-full w-full object-cover rounded-2xl"
              />
            ) : (
              <>
                <Upload className="h-8 w-8 text-gray-400" />
                <span className="text-xs text-gray-400 mt-1">Upload</span>
              </>
            )}
            <input type="file"  id="car-image" accept="image/*"  hidden onChange={(e) => setImage(e.target.files[0])}/>
          </label>
          <p className="text-sm text-gray-400">
            Upload a picture of your car (maximum 20 MB)
          </p>
        </div>

        <button type="submit" className='flex items-center gap-2 px-4 py-2.5 mt-4 bg-blue-500 text-white rounded-md font-medium w-max cursor-pointer'>
          <Check/> List Your Car
        </button>
      </form>
    </div>
  )
}

export default AddCar
