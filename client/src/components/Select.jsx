import { Search } from "lucide-react";
import { useState } from "react";

export default function SearchBar() {
  const cityList = ['New York', 'Los Angeles', 'Houston', 'Chicago'];
  const [pickupLocation, setPickupLocation] = useState('');

  return (
    <div className="flex justify-center items-center pt-6 ">
  <form className="flex flex-col md:flex-row items-center justify-center p-6 rounded-lg md:rounded-full  bg-black/70 border border-[#4C4AE0]">
    <div className="flex flex-col md:flex-row gap-10 items-center">

      <div className="flex flex-col items-start gap-2">
        <select
          required
          value={pickupLocation}
          onChange={(e) => setPickupLocation(e.target.value)}
          className="bg-black/70 text-white"
        >
          <option value="">Pickup Location</option>
          {cityList.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
        <p className="px-1 text-sm text-gray-400">
          {pickupLocation || 'Please select your Location'}
        </p>
      </div>

      <div className="flex flex-col items-start gap-2 text ">
        <label htmlFor="pickup-date">Pickup Date</label>
        <input
          type="date"
          id="pickup-date"
          min={new Date().toISOString().split('T')[0]}
          className="text-gray-300 bg-black/70"
          required
        />
      </div>

      <div className="flex flex-col items-start text gap-2">
        <label htmlFor="return-date">Return Date</label>
        <input
          type="date"
          id="return-date"
          className="text-gray-300 bg-black/70"
          required
        />
      </div>

      <button className="flex items-center rounded-full bg-blue-600 px-3 py-2 text-white gap-2">
        Search <Search />
      </button>

    </div>
  </form>
</div>

  );
}
