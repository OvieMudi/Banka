import authHelper from '../helpers/authHelper';
import db from '../database/database';
import Model from './model';

/**
 * Users model class
 */
class UsersModel extends Model {
  /**
   * model constructor
   * @param {String} dbName - database name
   * @returns {Object} - constructed model object
   */
  constructor(dbName = 'usersDB') {
    super(dbName);
    this.usersDB = db[dbName];
  }

  /**
   * Create user in database
   * Assign a unique id to user
   * @param {Object} reqBody - http request body
   * @returns {Object} - User object if success
   * @throws {Error} - Error object if object already exists
   */
  create(reqBody) {
    this.checkDuplicate(reqBody);
    const user = {
      id: this.usersDB.length + 1,
      email: reqBody.email,
      firstname: reqBody.firstname,
      lastname: reqBody.lastname,
      othername: reqBody.othername,
      password: authHelper.hashPassword(reqBody.password),
      type: 'client',
      phone: reqBody.phone,
      sex: reqBody.sex,
      address: reqBody.address,
      registered: new Date(),
      isAdmin: false,
    };
    this.usersDB.push(user);
    return user;
  }

  /**
   * check for valid user credentials
   * @param {Oject} reqBody - request body
   * @returns {Object} - user object on success
   * @throws {Error} - error on failure
   */
  signIn(reqBody) {
    const { email, password } = reqBody;
    const user = this.usersDB.find(usr => usr.email === email);
    if (user) {
      const validPassword = authHelper.comparePassword(password, user.password);
      if (validPassword) return user;
      throw new Error('username or password incorrect');
    } else throw new Error('username or password incorrect');
  }

  /**
   * Update an existing user in database using a unique id
   * @param {String} idString - http request.params.id
   * @param {String} reqBody - http request.body
   * @returns {Object} - on success
   * @throws {Error} - on failure
   */
  updateUser(idString, reqBody) {
    const id = parseInt(Number(idString), 10);
    const user = this.usersDB.find(usr => usr.id === id);
    user.phone = reqBody.phone || user.phone;
    user.lastname = reqBody.lastname || user.lastname;
    user.address = reqBody.address || user.address;
    return user;
  }

  /**
   *
   * @param {Object} reqBody
   * @returns {Object} - throws an error object
   */
  checkDuplicate(reqBody) {
    const userExists = this.usersDB.find(usr => usr.email === reqBody.email)
      || this.usersDB.find(usr => usr.phone === reqBody.phone);
    if (userExists) {
      throw new Error('user with credentials already exists');
    }
  }
}

export default UsersModel;
