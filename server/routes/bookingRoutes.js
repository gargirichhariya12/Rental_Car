import express from "express";
import { protect, restrictTo } from '../middleware/auth.js';
import { changeBookingStatus, checkAvailabilityOfCar, createBooking, createCheckoutSession, getCarAvailability, getOwnerBooking, getUserBooking } from "../controllers/BookingController.js";

const bookingRouter = express.Router();

bookingRouter.get('/check-availability', (req, res, next) => {
  req.body = { ...req.query };
  next();
}, checkAvailabilityOfCar);
bookingRouter.post('/check-availability', checkAvailabilityOfCar);
bookingRouter.get('/availability/:carId', getCarAvailability);

// Publicly accessible for logged in users
bookingRouter.use(protect);

bookingRouter.post('/create', createBooking);
bookingRouter.get('/user', getUserBooking);
bookingRouter.post('/checkout/:bookingId', createCheckoutSession);

// Owner specific routes
bookingRouter.get('/owner', restrictTo('owner'), getOwnerBooking);
bookingRouter.post('/change-status', restrictTo('owner'), changeBookingStatus);

export default bookingRouter;
