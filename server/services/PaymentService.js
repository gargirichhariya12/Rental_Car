import Stripe from 'stripe';
import Booking from '../models/Booking.js';
import AppError from '../utils/AppError.js';
import EmailService from './EmailService.js';

const getStripeClient = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new AppError('Stripe payment gateway is not configured. Add STRIPE_SECRET_KEY in server/.env.', 503);
  }

  return new Stripe(process.env.STRIPE_SECRET_KEY);
};

class PaymentService {
  async createCheckoutSession(bookingId, userId) {
    const booking = await Booking.findById(bookingId).populate('car user');
    if (!booking) throw new AppError('Booking not found', 404);
    if (booking.user._id.toString() !== userId.toString()) throw new AppError('Unauthorized', 403);
    if (!booking.car) throw new AppError('Car not found for this booking', 404);
    if (booking.paymentStatus === 'paid') throw new AppError('This booking has already been paid', 400);
    if (booking.status === 'cancelled') throw new AppError('Cancelled bookings cannot be paid', 400);

    const stripe = getStripeClient();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL || "http://localhost:5173"}/my-bookings?status=success`,
      cancel_url: `${process.env.CLIENT_URL || "http://localhost:5173"}/my-bookings?status=cancel`,
      customer_email: booking.user.email, // This might need a populate on user too
      client_reference_id: bookingId.toString(),
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Rental: ${booking.car.brand} ${booking.car.model}`,
              description: `From ${booking.pickupDate.toDateString()} to ${booking.returnDate.toDateString()}`,
              images: [booking.car.image],
            },
            unit_amount: Math.round(booking.price * 100), // Stripe expects cents
          },
          quantity: 1,
        },
      ],
    });

    return session;
  }

  async handleWebhook(signature, payload) {
    let event;
    try {
      if (!process.env.STRIPE_WEBHOOK_SECRET) {
        throw new AppError('Stripe webhook is not configured. Add STRIPE_WEBHOOK_SECRET in server/.env.', 503);
      }

      const stripe = getStripeClient();
      event = stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      throw new AppError(`Webhook Error: ${err.message}`, 400);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const bookingId = session.client_reference_id;

      const updatedBooking = await Booking.findByIdAndUpdate(bookingId, {
        paymentStatus: 'paid',
        status: 'confirmed',
        paymentId: session.payment_intent
      }, { new: true })
        .populate('car', 'brand model')
        .populate('user', 'name email');

      if (updatedBooking) {
        await EmailService.sendBookingConfirmation(updatedBooking).catch((error) => {
          console.error('Booking confirmation email failed:', error.message);
        });
      }
    }

    return { received: true };
  }
}

export default new PaymentService();
