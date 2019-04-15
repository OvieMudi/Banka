import db from '../../../db/v1s/db';

/**
 * Database model class
 */
class Model {
  /**
   * model constructor
   * @param {String} dbName - database name
   * @returns {Object} - constructed model object
   */
  constructor(dbName = '') {
    this.dbName = dbName;
    this.parseInteger = aString => parseInt(Number(aString), 10);
  }

  /**
   * Get all resource in database
   * @returns {Array} - array of resources
   */
  getAll() {
    return db[`${this.dbName}`];
  }

  /**
   * Get a resource in database using a unique id
   * @param {String} idString - http request.params.id
   * @returns {Object} - if recource is found
   * @returns {undefined} - if resource is not found
   */
  getById(idString = '') {
    const id = parseInt(Number(idString), 10);
    const account = db[`${this.dbName}`].find(acct => acct.id === id);
    return account;
  }

  /**
   * Delete an existing resource in database using a unique id
   * @param {String} idString - http request.params.id
   * @returns {Object} - on success
   * @returns {undefined} - on failure
   */
  delete(idString = '') {
    const id = parseInt(Number(idString), 10);
    const dbArray = db[`${this.dbName}`];
    const deleted = dbArray.find((user, index) => {
      if (user.id === id) dbArray.splice(index, 1);
      return user.id === id;
    });
    return deleted;
  }
}

export default Model;
