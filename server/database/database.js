import authHelper from '../helpers/authHelper';

export const sampleClient = {
  id: 3,
  email: 'sylvia@gmail.com',
  firstname: 'Sylvia',
  lastname: 'Odili',
  othername: 'Irhi',
  password: authHelper.hashPassword('password'),
  type: 'client',
  phone: '070443848023',
  sex: 'female',
  address: '34 Lorem Ipsum close, Sit Amet',
  isAdmin: false,
};

export const sampleCashier = {
  id: 2,
  email: 'a_bowman@banka.com',
  firstname: 'Ashley',
  lastname: 'Bouman',
  othername: '',
  password: authHelper.hashPassword('password'),
  type: 'cashier',
  phone: '070445986589',
  sex: 'male',
  address: '27 Lorem Ipsum close, Sit Amet',
  isAdmin: false,
};

export const sampleAdmin = {
  id: 1,
  email: 'toddler@banka.com',
  firstname: 'Ryan',
  lastname: 'Toddler',
  othername: 'Crade',
  password: authHelper.hashPassword('password'),
  type: 'admin',
  phone: '07047827484',
  sex: 'male',
  address: '46 Lorem Ipsum close, Sit Amet',
  isAdmin: true,
};

export const sampleAccount = {
  id: 1,
  accountNumber: 1002003001,
  createdOn: new Date(),
  owner: 3,
  type: 'savings',
  status: 'active',
  balance: 60134600.65,
};

const db = {
  usersDB: [
    sampleAdmin,
    sampleCashier,
    sampleClient,
    {
      id: 4,
      email: 'cm@gmail.com',
      firstname: 'Chris',
      lastname: 'Martin',
      othername: '',
      password: authHelper.hashPassword('password'),
      type: 'client',
      phone: '07044386936',
      sex: 'male',
      address: '46 Lorem Ipsum close, Sit Amet',
      isAdmin: false,
    },
  ],

  accountsDB: [
    sampleAccount,
    {
      id: 2,
      accountNumber: 1002003002,
      createdOn: new Date(),
      owner: 3,
      type: 'current',
      status: 'active',
      balance: 20134600.65,
    },
    {
      id: 3,
      accountNumber: 1002003003,
      createdOn: new Date(),
      owner: 4,
      type: 'current',
      status: 'dormant',
      balance: 10134600.65,
    },
    {
      id: 4,
      accountNumber: 1002003004,
      createdOn: new Date(),
      owner: 4,
      type: 'current',
      status: 'draft',
      balance: 0.0,
    },
  ],

  transactionsDB: [
    {
      id: 1,
      createdOn: new Date(),
      type: 'credit',
      accountNumber: sampleAccount.accountNumber,
      cashier: sampleCashier.id,
      amount: 300000.0,
      oldBalance: 0.0,
      newBalance: 300000.0,
    },
    {
      id: 2,
      createdOn: new Date(),
      type: 'debit',
      accountNumber: sampleAccount.accountNumber,
      cashier: sampleCashier.id,
      amount: 300000.0,
      oldBalance: 300000.0,
      newBalance: 300000.0 + 300000.0,
    },
  ],
};

/**
 * Function for generating account numbers
 * @returns {Number} - Generated account
 */
db.createAccNo = () => {
  const defaultNum = 1002003000;
  const accountNumber = defaultNum + db.accountsDB.length + 1;
  return accountNumber;
};

db.createTransactionId = () => {
  const transactionId = db.transactionsDB.length + 1;
  return transactionId;
};

export default db;
