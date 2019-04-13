import authHelper from '../../../helpers/authHelper';
import usersDB from '../../../db/v1s/usersDB';

const usersModel = {
  /**
   * Create user in database
   * Assign a unique id to user
   * @param {Object} reqBody - http request body
   * @returns {Object} - User object if success
   * @throws {Error} - Error object if object already exists
   */
  create(reqBody = {}) {
    checkDuplicate(reqBody);
    const user = {
      id: usersDB.length + 1,
      email: reqBody.email,
      firstname: reqBody.firstname,
      lastname: reqBody.lastname,
      othername: reqBody.othername,
      password: authHelper.hashPassword(reqBody.password),
      type: 'client',
      phone: reqBody.phone,
      address: reqBody.address,
      registered: new Date(),
      isAdmin: false,
    };
    usersDB.push(user);
    return user;
  },

  signIn(reqBody = {}) {
    const { email, password } = reqBody;
    const user = usersDB.find(usr => usr.email === email);
    if (user) {
      const validPassword = authHelper.comparePassword(password, user.password);
      if (validPassword) return user;
      throw new Error('username or password incorrect');
    } else throw new Error('username or password incorrect');
  },

  /**
   * Get all users in database
   * @returns {Array} - array of user objects
   */
  getUsers() {
    return usersDB;
  },

  /**
   * Get a User in database using a unique id
   * Assign a unique id to user
   * @param {String} idString - http request.params.id
   * @returns {Object} - if User is found
   * @returns {undefined} - if User is not found
   */
  getUser(idString = '') {
    const id = parseInt(idString, 10);
    const user = usersDB.find(usr => usr.id === id);
    return user;
  },

  /**
   * Update an existing user in database using a unique id
   * @param {String} idString - http request.params.id
   * @param {String} reqBody - http request.body
   * @returns {Object} - on success
   * @throws {Error} - on failure
   */
  updateUser(idString = '', reqBody = {}) {
    const id = parseInt(idString, 10);
    const user = usersDB.find(usr => usr.id === id);
    user.phone = reqBody.phone || user.phone;
    user.lastname = reqBody.lastname || user.lastname;
    user.address = reqBody.address || user.address;
    return user;
  },

  /**
   * Delete an existing user in database using a unique id
   * @param {String} idString - http request.params.id
   * @returns {Object} - on success
   * @returns {undefined} - on failure
   */
  deleteUser(idString) {
    const id = parseInt(idString, 10);
    const deleted = usersDB.find((user, index) => {
      if (user.id === id) usersDB.splice(index, 1);
      return user.id === id;
    });
    return deleted;
  },
};

// HELPER FUNCTION
/**
 *
 * @param {Object} reqBody
 * @returns {Object} - throws an error object
 */
function checkDuplicate(reqBody) {
  const userExists = usersDB.find(usr => usr.email === reqBody.email)
    || usersDB.find(usr => usr.phone === reqBody.phone);
  if (userExists) {
    throw new Error('user with credentials already exists');
  }
}

export default usersModel;
