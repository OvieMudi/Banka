/* eslint-disable class-methods-use-this */
import Model from './model';
import AccountsModel from './accountsModel';
import database from '../database/database';

const accountsModel = new AccountsModel();

/**
 * accounts model
 */
class TransactionsModel extends Model {
  /**
   * model constructor
   * @param {String} tableName - database name
   * @returns {Object} - constructed model object
   */
  constructor(tableName = 'transactions') {
    super(tableName);
  }

  /**
   * Create a new credit transaction
   * Assign a unique id to account
   * @param {Object} accountNumber - account
   * @param {Object} amount - account
   * @param {Object} userId - id of the current user
   * @returns {Object} - account object if success
   */
  async credit(accountNumber, amount, userId) {
    try {
      const { rows: accounts, rowCount: count } = await accountsModel.searchDatabase(
        'accountNumber',
        accountNumber,
      );
      if (count) {
        const account = accounts[0];
        const queryString = `
          SELECT * 
          FROM credit_account(${account.accountNumber}, ${amount}, ${userId});
        `;
        const { rows } = await database.query(queryString);
        return rows[0];
      }
      throw new Error('account not found');
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create a new credit transaction
   * Assign a unique id to account
   * @param {Object} accountNumber - account
   * @param {Object} amount - account
   * @param {Object} userId - id of the current user
   * @returns {Object} - account object if success
   */
  async debit(accountNumber, amount, userId) {
    try {
      const { rows: accounts, rowCount: count } = await accountsModel.searchDatabase(
        'accountNumber',
        accountNumber,
      );
      if (count) {
        const account = accounts[0];
        const queryString = `
          SELECT * 
          FROM debit_account(${account.accountNumber}, ${amount}, ${userId});
        `;
        const { rows } = await database.query(queryString);
        return rows[0];
      }
      throw new Error('account not found');
    } catch (error) {
      throw error;
    }
  }
}

export default TransactionsModel;
