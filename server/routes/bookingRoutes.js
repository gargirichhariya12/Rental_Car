import express from "express";
import { protect, restrictTo } from '../middleware/auth.js';
import { changeBookingStatus, checkAvailabilityOfCar, createBooking, getOwnerBooking, getUserBooking, createCheckoutSession } from "../controllers/BookingController.js";

const bookingRouter = express.Router();

bookingRouter.post('/check-availability', checkAvailabilityOfCar);

// Publicly accessible for logged in users
bookingRouter.use(protect);

bookingRouter.post('/create', createBooking);
bookingRouter.get('/user', getUserBooking);
bookingRouter.post('/checkout/:bookingId', createCheckoutSession);

// Owner specific routes
bookingRouter.get('/owner', restrictTo('owner', 'admin'), getOwnerBooking);
bookingRouter.post('/change-status', restrictTo('owner', 'admin'), changeBookingStatus);

export default bookingRouter;