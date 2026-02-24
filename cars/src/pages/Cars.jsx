import { dummyCarData } from '../assets/dummyCarData.jsx'
import CarCard from '../components/CarCard.jsx'
import Select from '../components/Select.jsx'
// import {dummyCarsData } from '../assets/dummyCarData'

function Cars(car) {
  return (
    <div className='glow-bg'>
      <Select />
      
 <div className="grid grid-cols-1 md:grid-cols-3  gap-16 p-8 mx-8 mt-6 ">
      {dummyCarData.map((car) => (
        <CarCard key={car._id} car={car} />
      ))}
      </div>
    </div>
  )
}

export default Cars
