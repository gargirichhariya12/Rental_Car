import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  car: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Car',
    required: [true, 'Review must belong to a car.']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Review must belong to a user.']
  },
  review: {
    type: String,
    required: [true, 'Review can not be empty!']
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Prevent duplicate reviews from the same user for the same car
reviewSchema.index({ car: 1, user: 1 }, { unique: true });

// Static method to calculate average ratings
reviewSchema.statics.calcAverageRatings = async function(carId) {
  const stats = await this.aggregate([
    { $match: { car: carId } },
    {
      $group: {
        _id: '$car',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);

  if (stats.length > 0) {
    await mongoose.model('Car').findByIdAndUpdate(carId, {
      numReviews: stats[0].nRating,
      averageRating: stats[0].avgRating
    });
  } else {
    await mongoose.model('Car').findByIdAndUpdate(carId, {
      numReviews: 0,
      averageRating: 0
    });
  }
};

reviewSchema.post('save', function() {
  this.constructor.calcAverageRatings(this.car);
});

// For update and delete
reviewSchema.pre(/^findOneAnd/, async function(next) {
  this.r = await this.findOne();
  next();
});

reviewSchema.post(/^findOneAnd/, async function() {
  await this.r.constructor.calcAverageRatings(this.r.car);
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;
