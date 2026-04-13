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

  const stats = bookings.reduce((acc, b) => {
    if (b.status === 'pending') acc.pending++;
    if (b.status === 'confirmed') {
      acc.completed++;
      acc.revenue += b.price;
    }
    return acc;
  }, { pending: 0, completed: 0, revenue: 0 });

  res.status(200).json({
    status: "success",
    data: {
      totalCars: cars.length,
      totalBookings: bookings.length,
      pendingBookings: stats.pending,
      completedBookings: stats.completed,
      monthlyRevenue: stats.revenue,
      recentBookings: bookings.slice(0, 5)
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
