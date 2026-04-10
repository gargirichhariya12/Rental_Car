import express from 'express';
import ReviewService from '../services/ReviewService.js';
import { protect } from '../middleware/auth.js';
import catchAsync from '../utils/catchAsync.js';

const router = express.Router({ mergeParams: true });

router.get('/', catchAsync(async (req, res) => {
  const reviews = await ReviewService.getCarReviews(req.params.carId || req.query.carId);
  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: { reviews }
  });
}));

router.use(protect);

router.post('/', catchAsync(async (req, res) => {
  const review = await ReviewService.createReview(req.params.carId || req.body.carId, req.user._id, req.body);
  res.status(201).json({
    status: 'success',
    data: { review }
  });
}));

router.delete('/:id', catchAsync(async (req, res) => {
  await ReviewService.deleteReview(req.params.id, req.user._id);
  res.status(204).json({
    status: 'success',
    data: null
  });
}));

export default router;
