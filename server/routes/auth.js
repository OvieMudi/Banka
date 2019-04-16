import express from 'express';
import authController from '../controllers/authController';

const authRouter = express.Router();

authRouter.route('/signup').post(authController.signUp);
authRouter.route('/signin').post(authController.signIn);

export default authRouter;
