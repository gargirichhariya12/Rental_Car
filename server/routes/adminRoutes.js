import express from 'express';
import { getAllUsers, getStats, updateUserRole } from '../controllers/adminController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

// Protect all routes below
router.use(protect);
router.use(restrictTo('admin'));

router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.patch('/update-role', updateUserRole);

export default router;
