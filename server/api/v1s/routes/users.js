import express from 'express';
import usersController from '../controllers/usersController';

const usersRouter = express.Router();

usersRouter.route('/').get(usersController.getUsers);

export default usersRouter;
