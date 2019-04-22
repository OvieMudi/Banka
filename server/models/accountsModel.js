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
}

export default AccountsModel;
