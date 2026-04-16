import Car from "../models/Car.js";
import User from "../models/User.js";
import Booking from "../models/Booking.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";
import CarService from "../services/CarService.js";
import imageKit from "../configs/imagekit.js";
import fs from "fs";

export const changeRoleToOwner = catchAsync(async (req, res, next) => {
  const { _id } = req.user;
  const user = await User.findByIdAndUpdate(_id, { role: "owner" }, {
    new: true,
    runValidators: true
  }).select("-password");

  res.status(200).json({
    status: "success",
    message: "Now you can list cars",
    data: { user }
  });
});

// API to add car
export const addCar = catchAsync(async (req, res, next) => {
  const { _id } = req.user;

  if (!req.body.carData) {
    return next(new AppError("Car data is required", 400));
  }

  let carData;

  try {
    carData = JSON.parse(req.body.carData);
  } catch {
    return next(new AppError("Car data must be valid JSON", 400));
  }

  const car = await CarService.addCar(_id, carData, req.file);

  res.status(201).json({
    status: "success",
    message: "Car added successfully",
    data: { car }
  });
});

//API to list Owner Cars
export const getOwnerCar = catchAsync(async (req, res, next) => {
  const { _id } = req.user;
  const cars = await CarService.getOwnerCars(_id);

  res.status(200).json({
    status: "success",
    data: { cars }
  });
});

//API to toggle Car Availability
export const toggleCarAvailability = catchAsync(async (req, res, next) => {
  const { _id } = req.user;
  const { carId } = req.body;

  if (!carId) {
    return next(new AppError("Car id is required", 400));
  }

  const car = await Car.findOne({ _id: carId, isDeleted: false });
  if (!car) return next(new AppError("Car not found", 404));

  if (car.owner.toString() !== _id.toString()) {
    return next(new AppError("Unauthorized", 403));
  }

  car.isAvailable = !car.isAvailable;
  await car.save();

  res.status(200).json({
    status: "success",
    message: "Availability toggled successfully",
    data: { isAvailable: car.isAvailable }
  });
});

//Api to delete a car
export const deleteCar = catchAsync(async (req, res, next) => {
  const { _id } = req.user;
  const carId = req.params.carId || req.body.carId;

  if (!carId) {
    return next(new AppError("Car id is required", 400));
  }

  const car = await Car.findOne({ _id: carId, isDeleted: false });
  if (!car) return next(new AppError("Car not found", 404));

  if (car.owner.toString() !== _id.toString()) {
    return next(new AppError("Unauthorized", 403));
  }

  const hasUpcomingBookings = await Booking.exists({
    car: carId,
    status: { $in: ["pending", "confirmed"] },
    returnDate: { $gte: new Date() }
  });

  if (hasUpcomingBookings) {
    return next(new AppError("This car has active bookings and cannot be deleted yet", 400));
  }

  car.isAvailable = false;
  car.isDeleted = true;
  await car.save();

  res.status(200).json({
    status: "success",
    message: "Car deleted successfully"
  });
});

//Api to get dashboard data
export const getDashboardData = catchAsync(async (req, res, next) => {
  const { _id } = req.user;

  const cars = await Car.find({ owner: _id, isDeleted: false });
  const bookings = await Booking.find({ owner: _id })
    .populate("car user")
    .sort({ createdAt: -1 });

  const summary = bookings.reduce((acc, booking) => {
    if (booking.status === "pending") acc.pendingBookings += 1;
    if (booking.status === "confirmed") acc.confirmedBookings += 1;
    if (booking.status === "completed") acc.completedBookings += 1;
    if (booking.status === "cancelled") acc.cancelledBookings += 1;
    if (booking.paymentStatus === "paid") acc.totalRevenue += booking.price;
    return acc;
  }, {
    totalCars: cars.length,
    totalBookings: bookings.length,
    pendingBookings: 0,
    confirmedBookings: 0,
    completedBookings: 0,
    cancelledBookings: 0,
    totalRevenue: 0,
  });

  const months = Array.from({ length: 6 }, (_, index) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - index));
    return {
      key: `${date.getFullYear()}-${date.getMonth()}`,
      label: date.toLocaleString("en-US", { month: "short" }),
      revenue: 0,
      bookings: 0,
    };
  });

  const monthMap = new Map(months.map((month) => [month.key, month]));

  const topCarsMap = new Map();
  const activeCars = cars.length || 1;

  bookings.forEach((booking) => {
    const createdAt = new Date(booking.createdAt);
    const monthKey = `${createdAt.getFullYear()}-${createdAt.getMonth()}`;
    const monthBucket = monthMap.get(monthKey);
    if (monthBucket) {
      monthBucket.bookings += 1;
      if (booking.paymentStatus === "paid") {
        monthBucket.revenue += booking.price;
      }
    }

    if (booking.car) {
      const existing = topCarsMap.get(booking.car._id.toString()) || {
        carId: booking.car._id,
        label: `${booking.car.brand} ${booking.car.model}`,
        bookings: 0,
        revenue: 0,
      };

      existing.bookings += 1;
      if (booking.paymentStatus === "paid") {
        existing.revenue += booking.price;
      }

      topCarsMap.set(booking.car._id.toString(), existing);
    }
  });

  const topCars = Array.from(topCarsMap.values())
    .sort((a, b) => {
      if (b.bookings !== a.bookings) return b.bookings - a.bookings;
      return b.revenue - a.revenue;
    })
    .slice(0, 5);

  const fleetUtilization = cars
    .map((car) => {
      const carBookings = bookings.filter((booking) => booking.car?._id.toString() === car._id.toString());
      const bookedDays = carBookings.reduce((total, booking) => {
        const durationInMs = new Date(booking.returnDate).getTime() - new Date(booking.pickupDate).getTime();
        const days = Math.max(1, Math.ceil(durationInMs / (1000 * 60 * 60 * 24)));
        return total + days;
      }, 0);

      return {
        carId: car._id,
        label: `${car.brand} ${car.model}`,
        bookedDays,
        utilizationRate: Math.min(100, Number(((carBookings.length / Math.max(1, bookings.length)) * 100).toFixed(1))),
        availabilityStatus: car.isAvailable ? "active" : "paused",
      };
    })
    .sort((a, b) => b.utilizationRate - a.utilizationRate);

  const monthlyRevenue = months.map((month) => ({
    label: month.label,
    value: month.revenue,
  }));

  const monthlyBookings = months.map((month) => ({
    label: month.label,
    value: month.bookings,
  }));

  const needsAttention = [
    {
      label: "Pending bookings",
      value: summary.pendingBookings,
      tone: summary.pendingBookings > 0 ? "warning" : "success",
    },
    {
      label: "Cancelled bookings",
      value: summary.cancelledBookings,
      tone: summary.cancelledBookings > 0 ? "warning" : "neutral",
    },
    {
      label: "Fleet coverage",
      value: `${cars.filter((car) => car.isAvailable).length}/${activeCars} live`,
      tone: cars.some((car) => !car.isAvailable) ? "warning" : "success",
    },
  ];

  res.status(200).json({
    status: "success",
    data: {
      ...summary,
      monthlyRevenueTotal: summary.totalRevenue,
      recentBookings: bookings.slice(0, 5),
      summary,
      monthlyRevenue,
      monthlyBookings,
      topCars,
      fleetUtilization,
      needsAttention,
      bookingMix: {
        pending: summary.pendingBookings,
        confirmed: summary.confirmedBookings,
        completed: summary.completedBookings,
        cancelled: summary.cancelledBookings,
      },
    }
  });
});

// API to update user image
export const updateUserImage = catchAsync(async (req, res, next) => {
  const { _id } = req.user;

  if (!req.file) {
    return next(new AppError("Image file is required", 400));
  }

  const fileBuffer = fs.readFileSync(req.file.path);
  const uploadResponse = await imageKit.upload({
    file: fileBuffer,
    fileName: `user-${_id}-${Date.now()}`,
    folder: "/users",
  });

  fs.unlinkSync(req.file.path);

  const imageUrl = imageKit.url({
    path: uploadResponse.filePath,
    transformation: [{ width: 400, quality: "auto", format: "webp" }],
  });

  const user = await User.findByIdAndUpdate(
    _id,
    { image: imageUrl },
    { new: true, runValidators: true }
  ).select("-password");

  res.status(200).json({
    status: "success",
    message: "Profile image updated successfully",
    data: { user },
  });
});
