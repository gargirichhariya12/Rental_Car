import express from 'express'
import { addCar, changeRoleToOwner, deleteCar, getDashboardData, getOwnerCar, toggleCarAvailability, updateUserImage } from '../controllers/ownerController.js';
import protect from '../middleware/auth.js';
import upload from '../middleware/multer.js';

const ownerRouter = express.Router();

ownerRouter.post('/change-role', protect, changeRoleToOwner);
ownerRouter.post('/add-car',protect, upload.single('image'), addCar);
ownerRouter.get('/cars',protect, getOwnerCar);
ownerRouter.post('/toggle-car',protect,  toggleCarAvailability);
ownerRouter.post('/delete-car',protect,  deleteCar);
ownerRouter.post('/dashboard',protect,  getDashboardData);
ownerRouter.post('/update-image', upload.single('image'), protect, updateUserImage)

export default ownerRouter