import Booking from "../models/Booking.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";
import BookingService from "../services/BookingService.js";
import PaymentService from "../services/PaymentService.js";
import CarService from "../services/CarService.js";

// Api to create checkout session
export const createCheckoutSession = catchAsync(async (req, res, next) => {
  const { bookingId } = req.params;
  const { _id } = req.user;

  const session = await PaymentService.createCheckoutSession(bookingId, _id);

  res.status(200).json({
    status: "success",
    sessionUrl: session.url
  });
});

// Api to check availability of cars for the given Date and location
export const checkAvailabilityOfCar = catchAsync(async (req, res, next) => {
  const { location, pickupDate, returnDate } = req.body;

  if (!location || !pickupDate || !returnDate) {
    return next(new AppError("Please provide location, pickup date, and return date", 400));
  }

  // fetch matching cars for the provided filters first, then narrow by availability
  const cars = await CarService.getAllCars(req.body);

  // check car available for the given date range
  const availableCarPromises = cars.map(async (car) => {
    const isAvailable = await BookingService.checkAvailability(car._id, pickupDate, returnDate);
    return { ...car._doc, isAvailable };
  });

  const allCarsWithStatus = await Promise.all(availableCarPromises);
  const availableCars = allCarsWithStatus.filter((car) => car.isAvailable);

  res.status(200).json({
    status: "success",
    results: availableCars.length,
    data: { availableCars }
  });
});

// Api to create Booking
export const createBooking = catchAsync(async (req, res, next) => {
  const { _id } = req.user;
  const { car, pickupDate, returnDate } = req.body;

  if (!car || !pickupDate || !returnDate) {
    return next(new AppError("Missing booking details", 400));
  }

  const booking = await BookingService.createBooking(_id, car, pickupDate, returnDate);

  res.status(201).json({
    status: "success",
    message: "Booking successfully created",
    data: { booking }
  });
});

// API to list user Booking
export const getUserBooking = catchAsync(async (req, res, next) => {
  const { _id } = req.user;
  const bookings = await Booking.find({ user: _id })
    .populate("car", "brand model image year fuel_type transmission location pricePerDay category seating_capacity")
    .sort({ createdAt: -1 });

  const validBookings = bookings.filter((booking) => booking.car);

  res.status(200).json({
    status: "success",
    results: validBookings.length,
    data: { bookings: validBookings }
  });
});

// Api to get Owner Booking
export const getOwnerBooking = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find({ owner: req.user._id })
    .populate('car user')
    .sort({ createdAt: -1 });

  const validBookings = bookings.filter((booking) => booking.car && booking.user);

  res.status(200).json({
    status: "success",
    results: validBookings.length,
    data: { bookings: validBookings }
  });
});

// Api to change the booking status
export const changeBookingStatus = catchAsync(async (req, res, next) => {
  const { _id } = req.user;
  const { bookingId, status } = req.body;

  const allowedStatuses = ["confirmed", "cancelled", "completed"];

  if (!bookingId || !status) {
    return next(new AppError("Booking id and status are required", 400));
  }

  if (!allowedStatuses.includes(status)) {
    return next(new AppError("Invalid booking status", 400));
  }

  const booking = await Booking.findById(bookingId);
  if (!booking) return next(new AppError("Booking not found", 404));

  if (booking.owner.toString() !== _id.toString()) {
    return next(new AppError("You do not have permission to manage this booking", 403));
  }

  if (booking.status === "cancelled") {
    return next(new AppError("Cancelled bookings cannot be updated", 400));
  }

  if (booking.status === "completed" && status !== "completed") {
    return next(new AppError("Completed bookings cannot be changed", 400));
  }

  if (status === "completed" && booking.paymentStatus !== "paid") {
    return next(new AppError("Only paid bookings can be marked as completed", 400));
  }

  booking.status = status;
  await booking.save();

  res.status(200).json({
    status: "success",
    message: "Booking status updated successfully",
    data: { booking }
  });
});
