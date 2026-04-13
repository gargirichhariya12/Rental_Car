import express from 'express';
import { getAllCars, getAllUsers, getStats, updateUserRole } from '../controllers/adminController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

// Protect all routes below
router.use(protect);
router.use(restrictTo('admin'));

router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.get('/cars', getAllCars);
router.patch('/update-role', updateUserRole);

export default router;
