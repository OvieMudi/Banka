import express from 'express';
import authController from '../controllers/authController';
import validator from '../middleware/requestValidator';

const authRouter = express.Router();

authRouter.route('/signup').post(validator.validateSignUp, authController.signUp);
authRouter.route('/signin').post(validator.validateSignIn, authController.signIn);

export default authRouter;
