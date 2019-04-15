import { userInfo } from 'os';
import Model from './model';
import accountsModel from './accountsModel';
import db from '../../../db/v1s/db';

/**
 * accounts model
 */
class TransactionsModel extends Model {
  /**
   * model constructor
   * @param {String} dbName - database name
   * @returns {Object} - constructed model object
   */
  constructor(dbName = 'transactionsDB') {
    super(dbName);
    this.transactionDB = db[dbName];
  }

  /**
   * Create a new credit transaction
   * Assign a unique id to account
   * @param {Object} acctNo - account
   * @param {Object} reqBody - account
   * @param {Object} reqUser - http request user object
   * @returns {Object} - account object if success
   */
  credit(acctNo = '', reqBody = {}, reqUser = {}) {
    const accountNumber = this.parseInteger(acctNo);
    const amount = this.parseToFloat(reqBody.amount);
    if (reqUser.userType === 'cashier') {
      const account = accountsModel.getByAccountNo(accountNumber);
      if (account) {
        const accountCopy = { ...account };
        const oldBalance = accountCopy.balance;
        account.balance += amount;
        const newBalance = account.balance + amount;
        const transaction = {
          id: this.transactionDB.length,
          createdOn: new Date(),
          type: 'credit',
          accountNumber,
          cashier: reqUser.id,
          amount,
          oldBalance,
          newBalance,
        };
        this.transactionDB.push(transaction);
        return {
          transactionId: transaction.id,
          accountNumber,
          amount,
          cashier: reqUser.id,
          transactionType: transaction.type,
          accountBalance: transaction.newBalance,
        };
      }
      throw new Error('account not found');
    }
    throw new Error('operation restricted to Cashier');
  }
}

export default new TransactionsModel();
