import express from 'express';
import { addCar, changeRoleToOwner, deleteCar, getDashboardData, getOwnerCar, toggleCarAvailability, updateUserImage } from '../controllers/ownerController.js';
import { protect, restrictTo } from '../middleware/auth.js';
import upload from '../middleware/multer.js';

const ownerRouter = express.Router();

ownerRouter.post('/change-role', protect, changeRoleToOwner);

// Apply protection and owner restriction to all routes below
ownerRouter.use(protect);
ownerRouter.use(restrictTo('owner'));

ownerRouter.post('/add-car', upload.single('image'), addCar);
ownerRouter.get('/cars', getOwnerCar);
ownerRouter.delete('/cars/:carId', deleteCar);
ownerRouter.patch('/cars/:carId/availability', (req, res, next) => {
  req.body.carId = req.params.carId;
  next();
}, toggleCarAvailability);
ownerRouter.post('/toggle-car', toggleCarAvailability);
ownerRouter.post('/delete-car', deleteCar);
ownerRouter.get('/dashboard', getDashboardData);
ownerRouter.post('/dashboard', getDashboardData);
ownerRouter.patch('/update-image', upload.single('image'), updateUserImage);
ownerRouter.post('/update-image', upload.single('image'), updateUserImage);

export default ownerRouter;
