import User from '../models/User.js';
import Car from '../models/Car.js';
import Booking from '../models/Booking.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';

export const getStats = catchAsync(async (req, res, next) => {
  const usersCount = await User.countDocuments();
  const carsCount = await Car.countDocuments({ isDeleted: false });
  const bookingsCount = await Booking.countDocuments();
  
  // Calculate total revenue
  const revenue = await Booking.aggregate([
    { $match: { paymentStatus: 'paid' } },
    { $group: { _id: null, total: { $sum: '$price' } } }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      usersCount,
      carsCount,
      bookingsCount,
      totalRevenue: revenue.length > 0 ? revenue[0].total : 0
    }
  });
});

export const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find().select('-password');
  
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: { users }
  });
});

export const getAllCars = catchAsync(async (req, res, next) => {
  const cars = await Car.find({ isDeleted: false })
    .populate('owner', 'name email')
    .sort({ createdAt: -1 });

  res.status(200).json({
    status: 'success',
    results: cars.length,
    data: { cars }
  });
});

export const updateUserRole = catchAsync(async (req, res, next) => {
  const { userId, role } = req.body;

  if (!userId || !role) {
    return next(new AppError('User id and role are required', 400));
  }

  if (!['admin', 'owner', 'user'].includes(role)) {
    return next(new AppError('Invalid role', 400));
  }

  const user = await User.findByIdAndUpdate(userId, { role }, {
    new: true,
    runValidators: true
  });

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { user }
  });
});
