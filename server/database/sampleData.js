export const sampleClient = {
  id: 3,
  email: 'sylvia@gmail.com',
  firstname: 'Sylvia',
  lastname: 'Odili',
  othername: 'Irhi',
  password: 'Password1',
  type: 'client',
  phone: '070443848023',
  sex: 'female',
  address: '34 Lorem Ipsum close, Sit Amet',
  isAdmin: false,
};

export const sampleCashier = {
  id: 2,
  email: 'cashier@banka.com',
  firstname: 'Ashley',
  lastname: 'Bouman',
  othername: '',
  password: 'Password1',
  type: 'cashier',
  phone: '070445986589',
  sex: 'male',
  address: '27 Lorem Ipsum close, Sit Amet',
  isAdmin: false,
};

export const sampleAdmin = {
  id: 1,
  email: 'admin@banka.com',
  firstname: 'Ryan',
  lastname: 'Toddler',
  othername: 'Crade',
  password: 'Password1',
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
  balance: 60134600,
};

export const sampleAccount2 = {
  id: 1,
  accountNumber: 1002003002,
  createdOn: new Date(),
  owner: 3,
  type: 'savings',
  status: 'active',
  balance: 740000.0,
};

export const sampleTransaction = {
  id: 3,
  createdOn: new Date(),
  type: 'credit',
  accountNumber: sampleAccount2.accountNumber,
  cashier: sampleCashier.id,
  amount: 30000,
  oldBalance: 10000,
  newBalance: 40000,
};
