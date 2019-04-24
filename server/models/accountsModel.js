import Model from './model';

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
}

export default AccountsModel;
