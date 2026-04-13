import express from 'express';
import { getAllCars, getAllUsers, getStats, updateUserRole } from '../controllers/adminController.js';
import { protect, restrictTo } from '../middleware/auth.js';
import { updateUserImage } from '../controllers/ownerController.js';
import upload from '../middleware/multer.js';

const router = express.Router();

// Protect all routes below
router.use(protect);
router.use(restrictTo('admin'));

router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.get('/cars', getAllCars);
router.patch('/update-role', updateUserRole);
router.patch('/update-image', upload.single('image'), updateUserImage);
router.post('/update-image', upload.single('image'), updateUserImage);

export default router;
