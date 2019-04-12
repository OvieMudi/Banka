import authHelper from '../../helpers/authHelper';

const usersDB = [
  {
    id: 1,
    email: 'cm@gmail.com',
    firstname: 'Chris',
    lastname: 'Martin',
    othername: '',
    password: authHelper.hashPassword('password'),
    type: 'client',
    phone: '07044386936',
    address: '46 Lorem Ipsum close, Sit Amet',
    isAdmin: false,
  },
  {
    id: 2,
    email: 'zoulrip@gmail.com',
    firstname: 'Sylvester',
    lastname: 'Ripper',
    othername: 'Drack',
    password: authHelper.hashPassword('password'),
    type: 'client',
    phone: '07044386936',
    address: '46 Lorem Ipsum close, Sit Amet',
    isAdmin: false,
  },
];
export default usersDB;
