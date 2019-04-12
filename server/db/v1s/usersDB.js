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
    firstname: 'Grim',
    lastname: 'Ripper',
    othername: 'Dark',
    password: authHelper.hashPassword('password'),
    type: 'client',
    phone: '07044386936',
    address: '46 Lorem Ipsum close, Sit Amet',
    isAdmin: false,
  },
];
export default usersDB;
