/* eslint-disable class-methods-use-this */
import database from '../database/database';
import tableEntries from '../helpers/tableEntries';

/**
 * Database model class
 */
class Model {
  /**
   * model constructor
   * @param {String} tableName - database name
   * @returns {Object} - constructed model object
   */
  constructor(tableName) {
    this.tableName = tableName;
  }

  /**
   * Creates new database entry
   * @param {Object} reqBody - http request body
   * @returns {Object} - created resource if success
   * @throws {Error} - Error object if fail or already exists
   */
  async create(reqBody) {
    const { columns, templates, values } = tableEntries.createTableEntries(reqBody);
    const queryString = `
      INSERT INTO ${this.tableName} (${columns})
      VALUES (${templates})
      RETURNING *;`;
    const { rows } = await database.query(queryString, values);
    return rows[0];
  }

  /**
   * Get all resource in database
   * @returns {Array} - array of resources
   */
  async getAll() {
    const querString = `SELECT * FROM ${this.tableName}`;
    const { rows } = await database.query(querString);
    return rows;
  }

  /**
   * Get a resource in database using a unique id
   * @param {String} idString - http request.params.id
   * @returns {Object} - if recource is found
   */
  async getById(idString) {
    const queryString = `SELECT * FROM ${this.tableName} 
      WHERE id='${idString}'`;
    const { rows } = await database.query(queryString);
    return rows[0];
  }

  /**
   * Get a resource in database using specified params
   * @param {String} search - Item to search for
   * @param {String} value - value of search item
   * @returns {Object} - if recource is found
   */
  async searchDatabase(search, value) {
    const queryString = `SELECT * FROM ${this.tableName} 
      WHERE ${search}='${value}'`;
    const { rows } = await database.query(queryString);
    return rows;
  }

  /**
   * Update an existing resource in database using a unique id
   * @param {String} idString - http request.params.id
   * @param {String} reqBody - http request.body
   * @returns {Object} - on success
   */
  async update(idString, reqBody) {
    const entries = tableEntries.updateTableEntries(reqBody);
    const queryString = `
      UPDATE ${this.tableName} 
      SET ${entries}
      WHERE id = ${idString}
      RETURNING *;
    `;
    const { rows, rowCount } = await database.query(queryString);
    if (rowCount) {
      return rows[0];
    }
    throw new Error(`${this.tableName} not found`);
  }

  /**
   * Find and Update existing resources in database
   * @param {String} property - table column property
   * @param {String} value - property value
   * @param {String} reqBody - http request.body
   * @returns {Object} - on success
   */
  async findAndUpdate(property, value, reqBody) {
    const entries = tableEntries.updateTableEntries(reqBody);
    const queryString = `
      UPDATE ${this.tableName} 
      SET ${entries}
      WHERE ${property} = '${value}'
      RETURNING *;
    `;
    const { rows, rowCount } = await database.query(queryString);
    if (rowCount) {
      return rows[0];
    }
    throw new Error(`${this.tableName} not found`);
  }

  /**
   * Delete an existing resource in database using a unique id
   * @param {String} idString - http request.params.id
   * @returns {Object} - on success
   * @returns {undefined} - on failure
   */
  async delete(idString) {
    const queryString = `
      DELETE FROM ${this.tableName}
      WHERE id = '${idString}'
      RETURNING *;
    `;
    const { rowCount } = await database.query(queryString);
    if (rowCount) {
      return rowCount;
    }
    throw new Error(`${this.tableName} not found`);
  }

  /**
   * Find and Update existing resources in database
   * @param {String} property - property - table column property
   * @param {String} value - property value
   * @returns {Object} - on success
   */
  async findAndDelete(property, value) {
    const queryString = `
      DELETE FROM ${this.tableName}
      WHERE ${property} = '${value}'
      RETURNING *;
    `;
    const { rowCount } = await database.query(queryString);
    if (rowCount) {
      return rowCount;
    }
    throw new Error(`${this.tableName} not found`);
  }
}

export default Model;
