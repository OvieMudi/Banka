import Model from './model';
import db from '../../../db/v1s/db';
import usersModel from './usersModel';

/**
 * accounts model
 */
class AccountsModel extends Model {
  /**
   * model constructor
   * @param {String} dbName - database name
   * @returns {Object} - constructed model object
   */
  constructor(dbName = 'accountsDB') {
    super(dbName);
    this.accountsDB = db[dbName];
  }

  /**
   * Create account in database
   * Assign a unique id to account
   * @param {Object} reqBody - http request body
   * @param {Object} reqUser - http request user object
   * @returns {Object} - account object if success
   */
  create(reqBody = {}, reqUser = {}) {
    const owner = parseInt(reqUser.id, 10);
    const type = reqBody.accType;

    const account = {
      id: this.accountsDB.length + 1,
      accountNumber: db.createAccNo(),
      createdOn: new Date(),
      owner,
      type,
      status: 'draft',
      balance: 0.0,
    };
    this.accountsDB.push(account);

    const user = usersModel.getOne(owner);
    return {
      accountNumber: account.accountNumber,
      firstname: user.firstname,
      lastname: user.lastname,
      othername: user.othername,
      email: user.email,
      type,
      openingBalance: 0.0,
    };
  }
}

export default new AccountsModel();