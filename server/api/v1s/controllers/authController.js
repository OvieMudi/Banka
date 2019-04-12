import authHelper from '../../../helpers/authHelper';
import usersModel from '../models/usersModel';

const authController = {
  create(req, res) {
    try {
      const user = usersModel.create(req.body);
      const token = authHelper.generateToken(user);
      res.status(201).json({
        status: 201,
        token,
        data: user,
      });
    } catch (error) {
      console.log(error.message);
      res.status(400).json({
        status: 400,
        error: error.message,
      });
    }
  },
};

export default authController;
