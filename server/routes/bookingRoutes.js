import express from "express"
import protect from '../middleware/auth.js';
import { changeBookingStatus, checkAvailabilityOfCar, createBooking, getOwnerBooking, getUserBooking } from "../controllers/BookingController.js";


const bookingRouter = express.Router();

bookingRouter.post('/check-availability', checkAvailabilityOfCar)
bookingRouter.post('/create',protect ,createBooking)
bookingRouter.get('/user',protect ,getUserBooking)
bookingRouter.get('/owner',protect ,getOwnerBooking)
bookingRouter.post('/change-status',protect ,changeBookingStatus)

export default bookingRouter