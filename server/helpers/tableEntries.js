import authHelper from './authHelper';

const tableEntries = {
  /**
   * creates column names, templates
   * and array inputs for query
   * @param {String} reqBody   - request body
   * @returns {Object} - created table entries
   */
  createTableEntries(reqBody) {
    let columns = '';
    let templates = '';
    const values = [];
    Object.keys(reqBody).forEach((propName, idx) => {
      if (propName === 'password') {
        reqBody.password = authHelper.hashPassword(reqBody.password);
      }
      columns += idx === 0 ? `"${propName}"` : `, "${propName}"`;
      templates += idx === 0 ? `$${idx + 1}` : `, $${idx + 1}`;
      values.push(reqBody[propName].toString());
    });
    return { columns, templates, values };
  },

  /**
   * create table update strings
   * and array inputs for query
   * @param {String} reqBody   - request body
   * @returns {Object} - created table entries
   */
  updateTableEntries(reqBody) {
    let entries = '';
    Object.keys(reqBody).forEach((propName, index) => {
      entries
        += index === 0
          ? `"${propName}" = '${reqBody[propName]}'`
          : `, "${propName}" = '${reqBody[propName]}'`;
    });
    return entries;
  },
};

export default tableEntries;
