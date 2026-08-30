import express from 'express';
import { getCarDetails, getCars, getRecommendations, getUserData, loginUser, registerUser } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const userRouter = express.Router();

userRouter.get('/cars', getCars);
userRouter.get('/cars/:id', getCarDetails);
userRouter.post('/recommendations', getRecommendations);
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/data', protect, getUserData);

export default userRouter;
