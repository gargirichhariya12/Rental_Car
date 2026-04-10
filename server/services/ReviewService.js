import Review from '../models/Review.js';
import Booking from '../models/Booking.js';
import AppError from '../utils/AppError.js';

class ReviewService {
  async createReview(carId, userId, reviewData) {
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
      ...reviewData
    });
  }

  async getCarReviews(carId) {
    return await Review.find({ car: carId }).populate('user', 'name image');
  }

  async deleteReview(reviewId, userId) {
    const review = await Review.findById(reviewId);
    if (!review) throw new AppError('Review not found', 404);
    
    // Only user who wrote it can delete it
    if (review.user.toString() !== userId.toString()) {
      throw new AppError('You are not authorized to delete this review', 403);
    }

    await review.deleteOne();
  }
}

export default new ReviewService();
