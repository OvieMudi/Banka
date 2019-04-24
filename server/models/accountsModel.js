import Model from './model';
import UsersModel from './usersModel';

const usersModel = new UsersModel();

/**
 * accounts model
 */
class AccountsModel extends Model {
  /**
   * model constructor
   * @param {String} tableName - database table name
   * @returns {Object} - constructed object
   */
  constructor(tableName = 'accounts') {
    super(tableName);
  }

  /**
   *
   * @param {Object} accountNumber - account number
   * @returns {Object} accountNumber - account details
   */
  async getByAccountNumber(accountNumber) {
    const { rows } = await this.searchDatabase('accountNumber', accountNumber);
    return rows[0];
  }

  /**
   *
   * @param {Object} userEmail - account number
   * @returns {Object} accountNumber - account details
   */
  async getAllByEmail(userEmail) {
    const user = await usersModel.getByEmail(userEmail);
    if (user) {
      const { rows } = await this.searchDatabase('owner', user.id);
      return rows;
    }
    throw new Error('user not found');
  }
}

export default AccountsModel;
