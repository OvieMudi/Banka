/* eslint-disable no-console */
import { Pool } from 'pg';
import authHelper from '../helpers/authHelper';
import { sampleAccount, sampleCashier } from './sampleData';
import { databaseURL } from './database';

const database = {
  pool: new Pool({
    connectionString: databaseURL,
  }),

  async createAllTables() {
    console.log(`CONNECTING TO DB: ${databaseURL}`);
    this.pool.on('connect', () => {
      console.log('CONNECTED TO DATABASE');
    });

    const queryCommand = `
    DROP TABLE IF EXISTS users, accounts, transactions, rsvps CASCADE;

    CREATE TABLE IF NOT EXISTS
      users(
        "id" SERIAL PRIMARY KEY,
        "email" VARCHAR(64) UNIQUE NOT NULL,
        "firstname" VARCHAR(64) NOT NULL,
        "lastname" VARCHAR(64) NOT NULL,
        "othername" VARCHAR(64),
        "password" VARCHAR(128) NOT NULL,
        "type" VARCHAR(16) DEFAULT 'client' NOT NULL,
        "sex" VARCHAR(16) NOT NULL,
        "phoneNumber" VARCHAR(32) UNIQUE NOT NULL,
        "address" VARCHAR(64),
        "registered" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
        "isAdmin" BOOLEAN DEFAULT false NOT NULL
      );
    
    CREATE TABLE IF NOT EXISTS
      accounts(
        "id" SERIAL,
        "accountNumber" INTEGER UNIQUE PRIMARY KEY,
        "createdOn" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
        "owner" INTEGER REFERENCES users (id) ON DELETE CASCADE,
        "type" VARCHAR(16) DEFAULT 'savings' NOT NULL,
        "status" VARCHAR(16) DEFAULT 'draft' NOT NULL,
        "balance" NUMERIC DEFAULT 0 NOT NULL
      );

      CREATE TABLE IF NOT EXISTS transactions (
        "id" SERIAL PRIMARY KEY,
        "type" VARCHAR(16) NOT NULL,
        "accountNumber" INTEGER REFERENCES accounts ("accountNumber") ON DELETE CASCADE,
        "cashier" INTEGER REFERENCES users (id) ON DELETE CASCADE,
        "amount" NUMERIC NOT NULL,
        "oldBalance" NUMERIC NOT NULL,
        "newBalance" NUMERIC NOT NULL,
        "createdOn" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
      );
      
      CREATE VIEW users_view 
        AS SELECT  
          "id", "email", "firstname", "lastname", "othername", "type", "sex", "phoneNumber", "address", "registered", "isAdmin"
        FROM users;
      `;

    await this.pool
      .query(queryCommand)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.error(err);
      });
  },

  // prettier-ignore
  async seedAllTables() {
    const queryCommand = `

      INSERT INTO users(
      email, firstname, lastname, othername, password, type, sex, "phoneNumber", address, "isAdmin"
      ) VALUES('admin@banka.com', 'Ryan', 'Toddler', 'Crade', '${authHelper.hashPassword('Password1')}', 'admin', 'male', '3368656197', '1 Sage Drive', true); 

      INSERT INTO users(email, firstname, lastname, password, type, sex, "phoneNumber", address
      ) VALUES('cashier@banka.com', 'Ashley', 'Bouman', '${authHelper.hashPassword('Password1')}', 'cashier', 'male', '9045938609', '3731 Stang Plaza'); 

      INSERT INTO users(
      email, firstname, lastname, othername, password, type, sex, "phoneNumber", address
      ) VALUES('sylvia@gmail.com', 'Sylvia', 'Odili', 'Irhi', '${authHelper.hashPassword('Password1')}','client', '070318414898', 'female', '34 Lorem Ipsum close, Sit Amet');

      INSERT INTO users(
      email, firstname, lastname, password, type, sex, "phoneNumber", address
      ) VALUES('jkausche2@diigo.com', 'Jeniece', 'Kausche', '${authHelper.hashPassword('Password1')}', 'client', 'female', '2454035282', '8 Carberry Street');

      INSERT INTO users(
      email, firstname, lastname, othername, password, type, sex, "phoneNumber", address
      ) VALUES('rstaddom3@chicagotribune.com', 'Raquel', 'Staddom', 'Smith', '${authHelper.hashPassword('Password1')}', 'client', 'female', '9023724602', '20 Armistice Drive');

      
      
      
      INSERT INTO accounts(
        "accountNumber", owner
      ) VALUES(
        '1002003001', 3
      );

      INSERT INTO accounts(
        "accountNumber", owner
      ) VALUES(
        '1002003002', 4
      );

      INSERT INTO accounts(
        "accountNumber", owner
      ) VALUES(
        '1002003003', 5
      );
     
      
      INSERT INTO transactions(
        type, "accountNumber", cashier, amount, "oldBalance", "newBalance"
      ) VALUES(
        'credit', '${sampleAccount.accountNumber}', '${sampleCashier.id}', 500000, '${sampleAccount.balance}', '${sampleAccount.balance + 500000}'
      );
    `;

    await this.createAllTables();
    await this.pool
      .query(queryCommand)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.error(err);
      });
    await this.pool.end();
  },
};

database.seedAllTables();
