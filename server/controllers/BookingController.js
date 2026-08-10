// import Booking from "../models/Booking.js";
// import catchAsync from "../utils/catchAsync.js";
// import AppError from "../utils/AppError.js";
// import BookingService from "../services/BookingService.js";
// import PaymentService from "../services/PaymentService.js";
// import CarService from "../services/CarService.js";

// // Api to create checkout session
// export const createCheckoutSession = catchAsync(async (req, res, next) => {
//   const { bookingId } = req.params;
//   const { _id } = req.user;

//   const session = await PaymentService.createCheckoutSession(bookingId, _id);

//   if (!session?.url) {
//     return next(new AppError("Unable to create payment checkout session", 502));
//   }

//   res.status(200).json({
//     status: "success",
//     sessionUrl: session.url
//   });
// });

// // Api to check availability of cars for the given Date and location
// export const checkAvailabilityOfCar = catchAsync(async (req, res, next) => {
//   const { location, pickupDate, returnDate } = req.body;

//   if (!location || !pickupDate || !returnDate) {
//     return next(new AppError("Please provide location, pickup date, and return date", 400));
//   }

//   // fetch matching cars for the provided filters first, then narrow by availability
//   const cars = await CarService.getAllCars(req.body);

//   // check car available for the given date range
//   const availableCarPromises = cars.map(async (car) => {
//     const isAvailable = await BookingService.checkAvailability(car._id, pickupDate, returnDate);
//     return { ...car._doc, isAvailable };
//   });

//   const allCarsWithStatus = await Promise.all(availableCarPromises);
//   const availableCars = allCarsWithStatus.filter((car) => car.isAvailable);

//   res.status(200).json({
//     status: "success",
//     results: availableCars.length,
//     data: { availableCars }
//   });
// });

// export const getCarAvailability = catchAsync(async (req, res) => {
//   const availability = await BookingService.getBlockedRanges(req.params.carId);

//   res.status(200).json({
//     status: "success",
//     data: availability,
//   });
// });

// // Api to create Booking
// export const createBooking = catchAsync(async (req, res, next) => {
//   const { _id } = req.user;
//   const { car, pickupDate, returnDate } = req.body;

//   if (!car || !pickupDate || !returnDate) {
//     return next(new AppError("Missing booking details", 400));
//   }

//   const booking = await BookingService.createBooking(_id, car, pickupDate, returnDate);

//   res.status(201).json({
//     status: "success",
//     message: "Booking successfully created",
//     data: { booking }
//   });
// });

// // API to list user Booking
// export const getUserBooking = catchAsync(async (req, res, next) => {
//   const { _id } = req.user;
//   const bookings = await Booking.find({ user: _id })
//     .populate("car", "brand model image year fuel_type transmission location pricePerDay category seating_capacity")
//     .sort({ createdAt: -1 });

//   const validBookings = bookings.filter((booking) => booking.car);

//   res.status(200).json({
//     status: "success",
//     results: validBookings.length,
//     data: { bookings: validBookings }
//   });
// });

// // Api to get Owner Booking
// export const getOwnerBooking = catchAsync(async (req, res, next) => {
//   const bookings = await Booking.find({ owner: req.user._id })
//     .populate('car user')
//     .sort({ createdAt: -1 });

//   const validBookings = bookings.filter((booking) => booking.car && booking.user);

//   res.status(200).json({
//     status: "success",
//     results: validBookings.length,
//     data: { bookings: validBookings }
//   });
// });

// // Api to change the booking status
// export const changeBookingStatus = catchAsync(async (req, res, next) => {
//   const { _id } = req.user;
//   const { bookingId, status } = req.body;

//   const allowedStatuses = ["confirmed", "cancelled", "completed"];

//   if (!bookingId || !status) {
//     return next(new AppError("Booking id and status are required", 400));
//   }

//   if (!allowedStatuses.includes(status)) {
//     return next(new AppError("Invalid booking status", 400));
//   }

//   const booking = await Booking.findById(bookingId);
//   if (!booking) return next(new AppError("Booking not found", 404));

//   if (booking.owner.toString() !== _id.toString()) {
//     return next(new AppError("You do not have permission to manage this booking", 403));
//   }

//   if (booking.status === "cancelled") {
//     return next(new AppError("Cancelled bookings cannot be updated", 400));
//   }

//   if (booking.status === "completed" && status !== "completed") {
//     return next(new AppError("Completed bookings cannot be changed", 400));
//   }

//   if (status === "completed" && booking.paymentStatus !== "paid") {
//     return next(new AppError("Only paid bookings can be marked as completed", 400));
//   }

//   booking.status = status;
//   await booking.save();

//   res.status(200).json({
//     status: "success",
//     message: "Booking status updated successfully",
//     data: { booking }
//   });
// });



import Booking from "../models/Booking.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";
import BookingService from "../services/BookingService.js";
import PaymentService from "../services/PaymentService.js";
import CarService from "../services/CarService.js";
import axios from "axios";

const postViaSocketWebhook = async (url, payload, label) => {
  if (!url) {
    const result = {
      sent: false,
      reason: "missing_url",
      message: `viaSocket ${label} webhook is not configured. Check your server/.env file.`,
    };
    console.warn(result.message);
    return result;
  }

  try {
    const response = await axios.post(url, payload, {
      headers: { "Content-Type": "application/json" },
      timeout: 10000
    });

    console.info(`viaSocket ${label} webhook sent: ${response.status}`);
    return {
      sent: true,
      status: response.status,
      data: response.data,
    };
  } catch (err) {
    const status = err.response?.status;
    const responseData = err.response?.data;
    console.error(
      `viaSocket ${label} webhook failed:`,
      status ? `status ${status}` : err.message,
      responseData || ""
    );
    return {
      sent: false,
      status,
      message: err.message,
      data: responseData,
    };
  }
};

// Api to create checkout session
export const createCheckoutSession = catchAsync(async (req, res, next) => {
  const { bookingId } = req.params;
  const { _id } = req.user;

  const session = await PaymentService.createCheckoutSession(bookingId, _id);

  if (!session?.url) {
    return next(new AppError("Unable to create payment checkout session", 502));
  }

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

  const cars = await CarService.getAllCars(req.body);

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

export const getCarAvailability = catchAsync(async (req, res) => {
  const availability = await BookingService.getBlockedRanges(req.params.carId);

  res.status(200).json({
    status: "success",
    data: availability,
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

  // populate to get emails for notification payload
  const populatedBooking = await booking.populate([
    { path: "user", select: "email name" },
    { path: "owner", select: "email name" },
    { path: "car", select: "brand model" }
  ]);

  // fire-and-forget webhook — booking creation should not fail if this fails
  const webhookResult = await postViaSocketWebhook(process.env.VIASOCKET_BOOKING_CREATED_WEBHOOK, {
    bookingId: populatedBooking._id,
    ownerEmail: populatedBooking.owner?.email,
    ownerName: populatedBooking.owner?.name,
    clientEmail: populatedBooking.user?.email,
    clientName: populatedBooking.user?.name,
    carName: `${populatedBooking.car?.brand} ${populatedBooking.car?.model}`,
    createdAt: populatedBooking.createdAt
  }, "booking-created");

  res.status(201).json({
    status: "success",
    message: "Booking successfully created",
    data: {
      booking,
      ...(process.env.NODE_ENV !== "production" ? { webhook: webhookResult } : {})
    }
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

  const booking = await Booking.findById(bookingId).populate("user", "email name");
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

  // fire webhook only when owner confirms
  if (status === "confirmed") {
    postViaSocketWebhook(process.env.VIASOCKET_BOOKING_CONFIRMED_WEBHOOK, {
      bookingId: booking._id,
      clientEmail: booking.user?.email,
      clientName: booking.user?.name
    }, "booking-confirmed");
  }

  res.status(200).json({
    status: "success",
    message: "Booking status updated successfully",
    data: { booking }
  });
});
