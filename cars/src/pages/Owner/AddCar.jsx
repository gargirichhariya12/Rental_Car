// import { useState } from "react";
// import { UploadCloud } from "lucide-react";
// import Title from "../../components/Owner/Title";

// const AddCar = () => {
//   const [image, setImage] = useState(null);
//   const [preview, setPreview] = useState(null);

//   const handleDrop = (e) => {
//     e.preventDefault();
//     const file = e.dataTransfer.files[0];
//     handleFile(file);
//   };

//   const handleFile = (file) => {
//     if (!file) return;
//     if (file.size > 20 * 1024 * 1024) {
//       alert("File must be less than 20MB");
//       return;
//     }
//     setImage(file);
//     setPreview(URL.createObjectURL(file));
//   };

//   return (
//     <div className="min-h-screen p-10  text-white w-full">
//       <Title title = 'Add Your car' subTitle='Fill in details to list a new car for booking, including pricing, availability, and car specifications.'/>

//       <div className="grid md:grid-cols-2 gap-6 w-full">
//         {["Brand", "Model", "Year", "Daily Price ($)", "Category", "Transmission", "Fuel Type", "Seating Capacity"].map((label, i) => (
//           <div key={i}>
//             <label className="text-sm text-gray-300">{label}</label>
//             <input
//               className="w-full mt-1 p-3 rounded-lg bg-black/40  gradient-border focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder={`Enter ${label}`}
//             />
//           </div>
//         ))}
//       </div>

//       <div className="mt-6">
//         <label className="text-sm text-gray-300">Location</label>
//         <input className="w-full mt-1 p-3 rounded-lg bg-black/40 border border-blue-500/30" placeholder="City, Country" />
//       </div>

//       <div className="mt-6">
//         <label className="text-sm text-gray-300">Description</label>
//         <textarea
//           rows="4"
//           className="w-full gradient-border mt-1 p-3 rounded-lg bg-black/40 border border-blue-500/30"
//           placeholder="Describe your car..."
//         />
//       </div>

//       {/* Upload Section */}
//       <div className="mt-8 grid md:grid-cols-2 gap-6 items-center">
//         <div
//           onDrop={handleDrop}
//           onDragOver={(e) => e.preventDefault()}
//           className="border-2 border-dashed border-blue-500/50 rounded-xl p-8 text-center cursor-pointer hover:bg-white/5"
//         >
//           <input
//             type="file"
//             className="hidden"
//             id="fileUpload"
//             onChange={(e) => handleFile(e.target.files[0])}
//           />
//           <label htmlFor="fileUpload" className="cursor-pointer flex flex-col items-center">
//             <UploadCloud size={40} className="text-blue-500 mb-2" />
//             <p className="text-gray-300">Drag & Drop or Click to Upload</p>
//             <p className="text-xs text-gray-500">(Max 20MB)</p>
//           </label>
//         </div>

//         {preview && (
//           <div className="flex justify-center">
//             <img src={preview} alt="Preview" className="h-40 rounded-lg shadow-lg" />
//           </div>
//         )}
//       </div>

//       <button className="mt-8 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold">
//         Save & List Your Car
//       </button>
//     </div>
//   );
// };

// export default AddCar;


import React, { useState } from 'react'
import Title from "../../components/Owner/Title";
import { Upload, Check} from 'lucide-react'

const currency = import.meta.env.VITE_CURRENCY

const AddCar = () => {

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
  }
  return (
    <div className='px-4 py-10 md:px-10 flex-1 w-full'>

      <Title title='Add New Car' subTitle='Fill in details to list a new car for booking, including pricing, availability, and car specifications.' />

      <form onSubmit={onSubmitHandler} className='flex flex-col gap-5 text-gray-500 text-sm mt-6 '>



        {/* car brand and modal */}
        <div className='grid grid-cols-2 gap-3'>
          <div className='flex flex-col w-full'>
            <label className='text text-lg'>Brand</label>
            <div className='gradient-border '>
              <input type='text' placeholder='eg- BMW, Mercedes, Audi...' value={car.brand} className=' relative z-10 px-3 py-2 mt-1   text-gray-400 bg-black/40 rounded-lg focus:outline-none w-full ' onChange={e => setCar({ ...car, brand: e.target.value })} />
            </div>
          </div>

          <div className='flex flex-col w-full'>
            <label className='text text-lg'>Model</label>
            <div className='gradient-border'>
              <input type='text' placeholder='e.g. X5, E-Class, M4....' value={car.model} className='relative z-10 px-3 py-2 mt-1 bg-black/40 rounded-md  text-gray-400 focus:outline-none w-full ' onChange={e => setCar({ ...car, modal: e.target.value })} />
            </div>
          </div>
        </div>

        {/* year, daily prize, category */}
        <div className='grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 gap-3'>
          <div className='flex flex-col w-full'>
            <label className='text text-lg'>Year</label>
            <div className='gradient-border'>
              <input type='number' placeholder='2025' value={car.year} className=' relative z-10 px-3 py-2 mt-1 bg-black/40  text-gray-400 focus:outline-none w-full rounded-lg' onChange={e => setCar({ ...car, year: e.target.value })} />
            </div>
          </div>
          <div className='flex flex-col w-full'>
            <label className='text text-lg'>Daily price({currency})</label>
            <div className='gradient-border'>
              <input type='number' placeholder='100' value={car.pricePerDay} className='relative z-10 px-3 py-2 mt-1 bg-black/40  text-gray-400 focus:outline-none w-full rounded-lg' onChange={e => setCar({ ...car, pricePerDay: e.target.value })} />
            </div>
          </div>


          <div className='flex flex-col w-full'>
            <label className='text-lg'>Category</label>

            <div className='gradient-border mt-1'>
              <select
                className='relative z-10 px-3 py-2 bg-black/40 text-gray-400 focus:outline-none w-full rounded-[10px]'
                value={car.category}
                onChange={e => setCar({ ...car, category: e.target.value })}
              >
                <option value='' className='bg-black/40 text-white' >Select a Category</option>
                <option value='Sedan' className='bg-black/40 text-white'>Sedan</option>
                <option value='SUV' className='bg-black/40 text-white' >SUV</option>
                <option value='Van' className='bg-black/40 text-white' >Van</option>
              </select>
            </div>
          </div>
        </div>

        {/* transmision, fuel type, Seating Capacity*/}
        <div className='grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 gap-3'>
          <div className='flex flex-col w-full'>
            <label className='text text-lg'>Transmission</label>
            <div className='gradient-border'>
              <input type='text' placeholder='Automatic' value={car.transmission} className='relative z-10 px-3 py-2 mt-1 bg-black/40  text-gray-400 focus:outline-none w-full rounded-lg' onChange={e => setCar({ ...car, transmission: e.target.value })} />
            </div>
          </div>
          <div className='flex flex-col w-full'>
            <label className='text text-lg'>Fuel Type</label>
            <div className='gradient-border'>
              <input type='text' placeholder='petrol' value={car.fuel_type} className='relative z-10 px-3 py-2 mt-1 bg-black/40  text-gray-400 focus:outline-none w-full rounded-lg' onChange={e => setCar({ ...car, fuel_type: e.target.value })} />
            </div>
          </div>
          <div className='flex flex-col w-full'>
            <label className='text-lg'>Seating Capacity</label>
            <div className='gradient-border mt-1'>
              <input type='number' placeholder='5' value={car.seating_capacity} className='relative z-10 px-3 py-2 mt-1 bg-black/40  text-gray-400 focus:outline-none w-full rounded-lg' onChange={e => setCar({ ...car, seating_capacity: e.target.value })} />
            </div>
          </div>
        </div>

        <div className='flex flex-col w-full'>
          <label className='text-lg'>Location</label>
          <div className='gradient-border mt-1'>
            <select
              className='relative z-10 px-3 py-2 bg-black/40 text-gray-400 focus:outline-none w-full rounded-[10px]'
              value={car.location}
              onChange={e => setCar({ ...car, location: e.target.value })}>
              <option value='' className='bg-black/40 text-white' >Select a location</option>
              <option value='Vijay Nagar' className='bg-black/40 text-white'>Vijay Nagar</option>
              <option value='Mahalaxmi Nagar' className='bg-black/40 text-white' >Mahalaxmi Nagar</option>
              <option value='C21' className='bg-black/40 text-white' >C21</option>
            </select>
          </div>
        </div>
        {/* Car Description  */}
        <div className='flex flex-col w-full'>
          <label className='text text-lg'>Description </label>
          <div className='gradient-border '>
            <textarea placeholder='e.g' value={car.description} className='relative z-10 px-3 py-2 mt-1 bg-black/40  text-gray-400 focus:outline-none w-full rounded-lg' onChange={e => setCar({ ...car, description: e.target.value })} />
          </div>

        </div>

        {/* Car Image Upload */}
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


            <button className='flex items-center gap-2 px-4 py-2.5 mt-4 bg-blue-500 text-white rounded-md font-medium w-max cursor-pointer'>
              <Check/> List Your Car
            </button>



      </form>

    </div>
  )
}

export default AddCar

