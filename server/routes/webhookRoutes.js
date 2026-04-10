import express from 'express';
import PaymentService from '../services/PaymentService.js';
import catchAsync from '../utils/catchAsync.js';

const router = express.Router();

router.post(
  '/stripe',
  express.raw({ type: 'application/json' }),
  catchAsync(async (req, res) => {
    const signature = req.headers['stripe-signature'];
    const result = await PaymentService.handleWebhook(signature, req.body);
    res.status(200).json(result);
  })
);

export default router;
