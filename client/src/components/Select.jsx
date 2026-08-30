import React, { useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAppContext } from "../Context/AppContext";
import DateInput from "./DateInput";
import Button from "./Button";

export default function SearchBar({ className = "", submitLabel = "Search Cars" }) {
  const navigate = useNavigate();
  const { pickUpDate, setPickUpDate, returnDate, setReturnDate } = useAppContext();
  const [pickupLocation, setPickupLocation] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!pickupLocation || !pickUpDate || !returnDate) {
      toast.error("Please select location, pickup date, and return date");
      return;
    }

    if (new Date(returnDate) <= new Date(pickUpDate)) {
      toast.error("Return date must be after pickup date");
      return;
    }

    navigate("/cars", {
      state: {
        searchFilters: {
          location: pickupLocation,
        },
      },
    });
  };

  return (
    <div className={`flex justify-center items-center pt-6 ${className}`.trim()}>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-5xl flex flex-col xl:flex-row items-stretch xl:items-center justify-center gap-4 p-4 md:p-6 rounded-[32px] bg-black/70 border border-[#4C4AE0] backdrop-blur-md"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
          <div className="flex flex-col gap-2">
            <label htmlFor="pickup-location" className="text-sm font-semibold text-white">
              Location
            </label>
            <input
              id="pickup-location"
              type="text"
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              placeholder="Search city"
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-gray-500 focus:border-red-500"
            />
          </div>

          <DateInput
            id="pickup-date"
            label="Pickup Date"
            min={new Date().toISOString().split("T")[0]}
            value={pickUpDate}
            onChange={(e) => setPickUpDate(e.target.value)}
            required
          />

          <DateInput
            id="return-date"
            label="Return Date"
            min={pickUpDate || new Date().toISOString().split("T")[0]}
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
            required
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          className="bg-red-600 font-semibold hover:bg-red-700"
          endIcon={<Search size={18} />}
        >
          {submitLabel}
        </Button>
      </form>
    </div>
  );
}
