/* eslint-disable no-console */
import { Pool } from 'pg';
import authHelper from '../helpers/authHelper';
import { databaseURL } from './database';

const pool = new Pool({
  connectionString: databaseURL,
});
const database = {
  async migrate() {
    console.log(`CONNECTING TO DB: ${databaseURL}`);
    pool.on('connect', () => {
      console.log('CONNECTED TO DATABASE');
    });

    // prettier-ignore
    const queryCommand = `
    -- =============================== TABLES ==================================

    DROP TABLE IF EXISTS users CASCADE;
    DROP TABLE IF EXISTS accounts CASCADE;
    DROP TABLE IF EXISTS transactions CASCADE;

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
        "accountNumber" INTEGER GENERATED ALWAYS AS IDENTITY (START WITH 1002003001) PRIMARY KEY,
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

      -- ================================= VIEWS ====================================
      
      CREATE VIEW users_view 
        AS SELECT  
          "id", "email", "firstname", "lastname", "othername", "type", "sex", "phoneNumber", "address", "registered", "isAdmin"
        FROM users;
      

      -- ============================= FUNCTIONS ========================================
      
      CREATE OR REPLACE FUNCTION credit_account (acct_no int, amnt numeric, cashierId int)
      RETURNS TABLE (
        "transactionId" int, "accountNumber" int, amount numeric, cashier int, "transactionType" varchar(16), "accountBalance" numeric)
      AS $$
        DECLARE
          credit_amount numeric := amnt::numeric;
          old_record accounts % ROWTYPE;
          new_record accounts % ROWTYPE;
          outputs record;
        BEGIN
          IF credit_amount <= 0 THEN
            RAISE EXCEPTION 'Invalid credit transaction of %', credit_amount
            USING ERRCODE = '22000';
          END IF;
          SELECT
            * INTO old_record
          FROM
            accounts a
          WHERE
            a. "accountNumber" = acct_no;
          --  add the amount
          UPDATE
            accounts a
          SET
            balance = balance + credit_amount
          WHERE
            a. "accountNumber" = acct_no
          RETURNING
            * INTO new_record;
          --  create transaction
          INSERT INTO transactions (type, "accountNumber", cashier, amount, "oldBalance", "newBalance")
            VALUES ('credit', acct_no, cashierId, credit_amount, old_record.balance, new_record.balance)
          RETURNING
            * INTO outputs;
          CREATE temp TABLE credit_alert (
            "transactionId" int,
            "accountNumber" int,
            amount numeric,
            cashier int,
            "transactionType" varchar(16 ),
            "accountBalance" numeric
          );
          INSERT INTO credit_alert
            VALUES (outputs.id, acct_no, credit_amount, outputs.cashier, outputs.type, new_record.balance);
          --  return table
          RETURN query
          SELECT
            *
          FROM
            credit_alert;
          DROP TABLE credit_alert;
        END;
      $$
      LANGUAGE plpgsql;


      CREATE OR REPLACE FUNCTION debit_account (acct_no int, amnt numeric, cashierId int)
      RETURNS TABLE (
        "transactionId" int, "accountNumber" int, amount numeric, cashier int, "transactionType" varchar(16), "accountBalance" numeric)
      AS $$
        DECLARE
          debit_amount numeric := amnt::numeric;
          old_record accounts % ROWTYPE;
          new_record accounts % ROWTYPE;
          outputs record;
        BEGIN
          IF debit_amount <= 0 THEN
            RAISE EXCEPTION 'Invalid debit transaction of %', debit_amount
              USING ERRCODE = '22000';
          END IF;
          SELECT
            * INTO old_record
          FROM
            accounts a
          WHERE
            a. "accountNumber" = acct_no;
          --  check for minimum balance
          IF debit_amount > old_record.balance THEN
            RAISE EXCEPTION 'Invalid debit of %. Minimum balance exceeded', debit_amount
              USING ERRCODE = '22000';
          END IF;
            --  subtract the amount
          UPDATE
            accounts a
          SET
            balance = balance - debit_amount
          WHERE
            a. "accountNumber" = acct_no
          RETURNING
            * INTO new_record;
          --  create transaction
          INSERT INTO transactions (type, "accountNumber", cashier, amount, "oldBalance", "newBalance")
            VALUES ('debit', acct_no, cashierId, debit_amount, old_record.balance::numeric, new_record.balance)
          RETURNING
            * INTO outputs;
          CREATE temp TABLE debit_alert (
            "transactionId" int,
            "accountNumber" int,
            amount numeric,
            cashier int,
            "transactionType" varchar(16 ),
            "accountBalance" numeric
          );
          INSERT INTO debit_alert
            VALUES (outputs.id, acct_no, debit_amount, outputs.cashier, outputs.type, new_record.balance);
          --  return table
          RETURN query
          SELECT
            *
          FROM
            debit_alert;
          DROP TABLE debit_alert;
        END;
        $$
        LANGUAGE plpgsql;

      -- ================================ INSERT ==================================

      INSERT INTO users(
      email, firstname, lastname, othername, password, type, sex, "phoneNumber", address, "isAdmin"
      ) VALUES('admin@banka.com', 'Ryan', 'Toddler', 'Crade', '${authHelper.hashPassword(
    'Password1',
  )}', 'admin', 'male', '3368656197', '1 Sage Drive', true); 

      INSERT INTO users(email, firstname, lastname, password, type, sex, "phoneNumber", address
      ) VALUES('cashier@banka.com', 'Ashley', 'Bouman', '${authHelper.hashPassword(
    'Password1',
  )}', 'cashier', 'male', '9045938609', '3731 Stang Plaza'); 

      INSERT INTO users(
      email, firstname, lastname, othername, password, type, sex, "phoneNumber", address
      ) VALUES('sylvia@gmail.com', 'Sylvia', 'Odili', 'Irhi', '${authHelper.hashPassword(
    'Password1',
  )}','client', '070318414898', 'female', '34 Lorem Ipsum close, Sit Amet');

      INSERT INTO users(
      email, firstname, lastname, password, type, sex, "phoneNumber", address
      ) VALUES('jkausche2@diigo.com', 'Jeniece', 'Kausche', '${authHelper.hashPassword(
    'Password1',
  )}', 'client', 'female', '2454035282', '8 Carberry Street');

      INSERT INTO users(
      email, firstname, lastname, othername, password, type, sex, "phoneNumber", address
      ) VALUES('rstaddom3@chicagotribune.com', 'Raquel', 'Staddom', 'Smith', '${authHelper.hashPassword(
    'Password1',
  )}', 'client', 'female', '9023724602', '20 Armistice Drive');

      INSERT INTO users(
      email, firstname, lastname, othername, password, type, sex, "phoneNumber", address
      ) VALUES('creatre@chicagotribune.com', 'Ruby', 'Staddom', 'Smith', '${authHelper.hashPassword(
    'Password1',
  )}', 'client', 'female', '90237246025', '20 Armistice Drive');

      INSERT INTO users(
      email, firstname, lastname, othername, password, type, sex, "phoneNumber", address
      ) VALUES('mayparker@chicagotribune.com', 'Aunt', 'May', 'Parker', '${authHelper.hashPassword(
    'Password1',
  )}', 'client', 'female', '90257226025', '10 Armistice Drive');

      
      -- ====================================================================================
      
      INSERT INTO accounts(
        owner
      ) VALUES(
        3
      );

      INSERT INTO accounts(
        owner, type, balance
      ) VALUES(4, 'savings', 740000.0);

      INSERT INTO accounts(
        owner, type, balance
      ) VALUES(6, 'current', 970000.0);

      INSERT INTO accounts(
        owner, type, balance
      ) VALUES(5, 'current', 90838300.0);

      INSERT INTO accounts(
        owner, type, balance
      ) VALUES(4, 'current', 208300.0);

      INSERT INTO accounts(
        owner, type, balance
      ) VALUES(3, 'savings', 33700.0);

      INSERT INTO accounts(
        owner, type, balance
      ) VALUES(7, 'savings', 2063700.0);

      INSERT INTO accounts(
        owner, type, balance
      ) VALUES(6, 'savings', 274400.0);

      INSERT INTO accounts(
        owner
      ) VALUES(5);

      -- =====================================================================================

      INSERT INTO transactions(type, "accountNumber", cashier, amount, "oldBalance", "newBalance"
      ) VALUES ('credit', 1002003001, 2, 30000, 10000, 40000);
      
      INSERT INTO transactions(type, "accountNumber", cashier, amount, "oldBalance", "newBalance"
      ) VALUES ('credit', 1002003005, 2, 30000, 10000, 40000);

      INSERT INTO transactions(type, "accountNumber", cashier, amount, "oldBalance", "newBalance"
      ) VALUES ('credit', 1002003002, 2, 30000, 10000, 40000);

      INSERT INTO transactions(type, "accountNumber", cashier, amount, "oldBalance", "newBalance"
      ) VALUES ('credit', 1002003004, 2, 30000, 10000, 40000);

      INSERT INTO transactions(type, "accountNumber", cashier, amount, "oldBalance", "newBalance"
      ) VALUES ('credit', 1002003002, 2, 30000, 10000, 40000);

      INSERT INTO transactions(type, "accountNumber", cashier, amount, "oldBalance", "newBalance"
      ) VALUES ('credit', 1002003005, 2, 30000, 10000, 40000);

      INSERT INTO transactions(type, "accountNumber", cashier, amount, "oldBalance", "newBalance"
      ) VALUES ('credit', 1002003004, 2, 30000, 10000, 40000);

      INSERT INTO transactions(type, "accountNumber", cashier, amount, "oldBalance", "newBalance"
      ) VALUES ('credit', 1002003003, 2, 30000, 10000, 40000);

      INSERT INTO transactions(type, "accountNumber", cashier, amount, "oldBalance", "newBalance"
      ) VALUES ('credit', 1002003002, 2, 30000, 10000, 40000);

      INSERT INTO transactions(type, "accountNumber", cashier, amount, "oldBalance", "newBalance"
      ) VALUES ('credit', 1002003004, 2, 30000, 10000, 40000);

      INSERT INTO transactions(type, "accountNumber", cashier, amount, "oldBalance", "newBalance"
      ) VALUES ('credit', 1002003005, 2, 30000, 10000, 40000);

      INSERT INTO transactions(type, "accountNumber", cashier, amount, "oldBalance", "newBalance"
      ) VALUES ('credit', 1002003001, 2, 30000, 10000, 40000);

      INSERT INTO transactions(type, "accountNumber", cashier, amount, "oldBalance", "newBalance"
      ) VALUES ('credit', 1002003004, 2, 30000, 10000, 40000);

      INSERT INTO transactions(type, "accountNumber", cashier, amount, "oldBalance", "newBalance"
      ) VALUES ('credit', 1002003003, 2, 30000, 10000, 40000);

      INSERT INTO transactions(type, "accountNumber", cashier, amount, "oldBalance", "newBalance"
      ) VALUES ('credit', 1002003005, 2, 30000, 10000, 40000);

      INSERT INTO transactions(type, "accountNumber", cashier, amount, "oldBalance", "newBalance"
      ) VALUES ('credit', 1002003004, 2, 30000, 10000, 40000);

      INSERT INTO transactions(type, "accountNumber", cashier, amount, "oldBalance", "newBalance"
      ) VALUES ('credit', 1002003007, 2, 30000, 10000, 40000);

      INSERT INTO transactions(type, "accountNumber", cashier, amount, "oldBalance", "newBalance"
      ) VALUES ('credit', 1002003003, 2, 30000, 10000, 40000);

      INSERT INTO transactions(type, "accountNumber", cashier, amount, "oldBalance", "newBalance"
      ) VALUES ('credit', 1002003005, 2, 30000, 10000, 40000);
`;

    try {
      const res = pool.query(queryCommand);
      await res;
      pool.end().then(() => {
        console.log('POOL TERMINATED SUCCESSFULLY');
      });
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  },
};

database.migrate();
