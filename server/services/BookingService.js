import Booking from "../models/Booking.js";
import Car from "../models/Car.js";
import AppError from "../utils/AppError.js";

class BookingService {
  getBlockingStatuses() {
    return ["pending", "confirmed"];
  }

  validateDates(pickupDate, returnDate) {
    const pickup = new Date(pickupDate);
    const dropoff = new Date(returnDate);

    if (Number.isNaN(pickup.getTime()) || Number.isNaN(dropoff.getTime())) {
      throw new AppError("Please provide valid pickup and return dates", 400);
    }

    if (dropoff <= pickup) {
      throw new AppError("Return date must be after pickup date", 400);
    }
  }

  async checkAvailability(carId, pickupDate, returnDate) {
    this.validateDates(pickupDate, returnDate);

    const overlappingBooking = await Booking.findOne({
      car: carId,
      status: { $in: this.getBlockingStatuses() },
      $or: [
        {
          pickupDate: { $lt: new Date(returnDate) },
          returnDate: { $gt: new Date(pickupDate) },
        },
      ],
    });

    return !overlappingBooking;
  }

  async getBlockedRanges(carId) {
    const car = await Car.findById(carId).select("_id isDeleted isAvailable");
    if (!car || car.isDeleted) {
      throw new AppError("Car not found", 404);
    }

    const bookings = await Booking.find({
      car: carId,
      status: { $in: this.getBlockingStatuses() },
    })
      .select("pickupDate returnDate status")
      .sort({ pickupDate: 1 });

    return {
      car: {
        _id: car._id,
        isAvailable: car.isAvailable,
      },
      blockedRanges: bookings.map((booking) => ({
        startDate: booking.pickupDate.toISOString().split("T")[0],
        endDate: booking.returnDate.toISOString().split("T")[0],
        status: booking.status,
      })),
    };
  }

  calculatePrice(pricePerDay, pickupDate, returnDate) {
    const picked = new Date(pickupDate);
    const returned = new Date(returnDate);
    const timeDiff = returned.getTime() - picked.getTime();
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return pricePerDay * (diffDays || 1); // Minimum 1 day
  }

  async createBooking(userId, carId, pickupDate, returnDate) {
    this.validateDates(pickupDate, returnDate);

    const car = await Car.findById(carId);
    if (!car) throw new AppError("Car not found", 404);
    if (car.isDeleted) throw new AppError("This car is no longer available for rent", 404);
    if (!car.isAvailable) throw new AppError("Car is currently not available for rent", 400);
    if (car.owner.toString() === userId.toString()) {
      throw new AppError("You cannot book your own car", 403);
    }

    const isAvailable = await this.checkAvailability(carId, pickupDate, returnDate);
    if (!isAvailable) {
      throw new AppError("This car is already booked for the selected dates", 400);
    }

    const price = this.calculatePrice(car.pricePerDay, pickupDate, returnDate);

    const booking = await Booking.create({
      car: carId,
      owner: car.owner,
      user: userId,
      pickupDate,
      returnDate,
      price,
      status: "pending"
    });

    return booking;
  }
}

export default new BookingService();
