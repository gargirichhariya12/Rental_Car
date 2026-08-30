import Review from '../models/Review.js';
import Booking from '../models/Booking.js';
import Car from '../models/Car.js';
import AppError from '../utils/AppError.js';

class ReviewService {
  async createReview(carId, userId, reviewData) {
    if (!carId) {
      throw new AppError('Car id is required', 400);
    }

    const normalizedReview = reviewData.review?.trim();
    const rating = Number(reviewData.rating);

    if (!normalizedReview) {
      throw new AppError('Review can not be empty!', 400);
    }

    if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
      throw new AppError('Rating must be between 1 and 5', 400);
    }

    const car = await Car.findById(carId);
    if (!car || car.isDeleted) {
      throw new AppError('Car not found', 404);
    }

    // Check if user actually booked this car and it's completed
    const booking = await Booking.findOne({
      car: carId,
      user: userId,
      status: 'completed'
    });

    if (!booking) {
      throw new AppError('You can only review cars you have rented and completed the trip for.', 400);
    }

    return await Review.create({
      car: carId,
      user: userId,
      review: normalizedReview,
      rating
    });
  }

  async getCarReviews(carId) {
    if (!carId) {
      throw new AppError('Car id is required', 400);
    }

    return await Review.find({ car: carId }).populate('user', 'name image');
  }

  async deleteReview(reviewId, userId) {
    const review = await Review.findById(reviewId);
    if (!review) throw new AppError('Review not found', 404);

    if (review.user.toString() !== userId.toString()) {
      throw new AppError('You are not authorized to delete this review', 403);
    }

    await Review.findOneAndDelete({ _id: reviewId, user: userId });
  }
}

export default new ReviewService();
