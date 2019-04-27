import express from 'express';
import authController from '../controllers/authController';
import validator from '../middleware/requestValidator';
import auth from '../middleware/authenticator';

const authRouter = express.Router();

authRouter.route('/signin').post(validator.validateSignIn, authController.signIn);
authRouter.route('/user/signup').post(validator.validateSignUp, authController.signUp);
authRouter
  .route('/admin/create')
  .post(
    auth.verifyAuth,
    auth.verifyAdmin,
    validator.validateCreateStaff,
    authController.createStaff,
  );

export default authRouter;
