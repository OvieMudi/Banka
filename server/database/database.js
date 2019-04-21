import { Pool } from 'pg';
import { config } from 'dotenv';

config();

const databaseENV = {
  development: process.env.DATABASE_URL,
  test: process.env.DATABASE_TEST_URL,
};

const databaseURL = databaseENV[process.env.NODE_ENV || 'development'];

const pool = new Pool({
  connectionString: databaseURL,
});

const database = {
  query(queryString, params) {
    return pool.query(queryString, params);
  },
};

export { databaseURL };
export default database;
