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
    const owner = this.parseInteger(reqUser.id);
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

    const user = usersModel.getById(owner);
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

  /**
   * Find account by account number
   * @param {Number} acctNo - account number
   * @returns {Object} - account object if success
   */
  getByAccountNo(acctNo = null) {
    const account = this.accountsDB.find(acct => acct.accountNumber === acctNo);
    return account;
  }

  /**
   * Activate or deactivate account
   * @param {String} acctNo - http request body
   * @param {Object} reqBody - http request body
   * @param {Object} reqUser - http request user object
   * @returns {Object} - account object if success
   * @throws {Error} - on failure
   */
  changeStatus(acctNo = '', reqBody = {}, reqUser = {}) {
    if (reqUser.isAdmin) {
      const acctNumber = this.parseInteger(acctNo);
      const account = this.getByAccountNo(acctNumber);
      if (account) {
        account.status = reqBody.status;
        return account;
      }
      throw new Error('account not found');
    } else throw new Error('operation restricted to Admin');
  }

  /**
   * Activate or deactivate account
   * @param {String} acctNo - http request body
   * @param {Object} reqUser - http request user object
   * @returns {Object} - account object if success
   * @throws {Error} - on failure
   */
  deleteByAcctNo(acctNo = '', reqUser = {}) {
    if (reqUser.isAdmin) {
      const acctNumber = this.parseInteger(acctNo);
      if (acctNumber) {
        this.accountsDB.find((acct, idx) => {
          const match = acct.accountNumber === acctNumber;
          if (match) this.accountsDB.splice(idx, 1);
          return match;
        });
        return 'Account deleted successfully';
      }
      throw new Error('account not found');
    } else throw new Error('operation restricted to Admin');
  }
}

export default new AccountsModel();
