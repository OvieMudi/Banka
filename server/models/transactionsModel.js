import Model from './model';
import AccountsModel from './accountsModel';
import db from '../database/database';

const accountsModel = new AccountsModel();

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
   * @param {Object} acctNumber - account
   * @param {Object} reqBody - account
   * @param {Object} reqUser - http request user object
   * @returns {Object} - account object if success
   */
  credit(acctNumber, reqBody, reqUser) {
    const accountNumber = this.parseInteger(acctNumber);
    const amount = this.parseToFloat(reqBody.amount);
    if (reqUser.userType === 'cashier') {
      const account = accountsModel.getByAccountNumber(accountNumber);
      if (account) {
        const transaction = {
          id: this.transactionDB.length + 1,
          createdOn: new Date(),
          type: 'credit',
          accountNumber,
          cashier: reqUser.id,
          amount,
          oldBalance: account.balance,
          newBalance: account.balance + amount,
        };
        account.balance += amount;
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

export default TransactionsModel;
