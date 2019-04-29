import authHelper from '../helpers/authHelper';
import Model from './model';

/**
 * Users model class
 */
class UsersModel extends Model {
  /**
   * model constructor
   * @param {String} tableName - database name
   * @returns {Object} - constructed model object
   */
  constructor(tableName = 'users') {
    super(tableName);
  }

  /**
   * check for valid user credentials
   * @param {Oject} reqBody - request body
   * @returns {Object} - user object on success
   */
  async signIn(reqBody) {
    const { email, password } = reqBody;
    let { rows: user } = await this.searchDatabase('email', email);
    user = user[0];
    if (user) {
      const validPassword = authHelper.comparePassword(password, user.password);
      if (validPassword) return user;
      throw new Error('username or password incorrect');
    } else throw new Error('username or password incorrect');
  }
}

export default UsersModel;
