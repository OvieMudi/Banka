import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../server';
import { sampleAdmin } from '../database/sampleData';

const { expect } = chai;

chai.use(chaiHttp);

let adminToken;

before((done) => {
  chai
    .request(server)
    .post('/api/v1/auth/signin')
    .type('form')
    .send({ email: sampleAdmin.email, password: 'Password1' })
    .end((err, res) => {
      adminToken = res.body.token;
      done(err);
    });
});

const userData = {
  email: 'salymgana@gmail.com',
  firstname: 'Salym',
  lastname: 'Groth',
  othername: 'Ganna',
  password: 'Password1',
  sex: 'male',
  phoneNumber: '070443389496',
  address: '46 Lorem Ipsum close, Sit Amet',
};
const staffData = {
  email: 'gracie@gmail.com',
  firstname: 'Gracie',
  lastname: 'Spencer',
  othername: 'Sheeva',
  password: 'Password1',
  type: 'cashier',
  sex: 'male',
  phoneNumber: '07044338596',
  address: '46 Lorem Ipsum close, Sit Amet',
};

describe('POST /auth/user/signup', () => {
  it('should #create a user and #generate jwt', (done) => {
    chai
      .request(server)
      .post('/api/v1/auth/user/signup')
      .type('form')
      .send(userData)
      .end((err, res) => {
        const user = res.body.data;
        expect(res.body).property('token');
        expect(user).property('id');
        done(err);
      });
  });
  it('should return error on duplicate', (done) => {
    chai
      .request(server)
      .post('/api/v1/auth/user/signup')
      .type('form')
      .send(userData)
      .end((err, res) => {
        expect(res).status(409);
        expect(res.body)
          .property('error')
          .contain('already exists');
        done(err);
      });
  });
});

describe('POST /auth/admin/create', () => {
  it('should return error if no token provided', (done) => {
    chai
      .request(server)
      .post('/api/v1/auth/admin/create')
      .type('form')
      .send(staffData)
      .end((err, res) => {
        expect(res).status(401);
        expect(res.body).to.have.property('error');
        done(err);
      });
  });
  it('should #create staff and #generate jwt', (done) => {
    chai
      .request(server)
      .post('/api/v1/auth/admin/create')
      .set('x-access-token', adminToken)
      .type('form')
      .send(staffData)
      .end((err, res) => {
        const user = res.body.data;
        expect(res).status(201);
        expect(res.body).to.have.property('token');
        expect(user).to.have.property('id');
        expect(user).to.have.property('firstname');
        expect(user).to.have.property('lastname');
        expect(user).to.have.property('email');
        expect(user)
          .to.have.property('isAdmin')
          .that.is.a('boolean');
        done(err);
      });
  });
});

describe('POST /auth/signin', () => {
  it('should not sign in user with wrong password', (done) => {
    chai
      .request(server)
      .post('/api/v1/auth/signin')
      .type('form')
      .send({
        email: userData.email,
        password: 'Password12',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).property('error');
        done(err);
      });
  });

  it('should #sign in a user and #generate jwt', (done) => {
    chai
      .request(server)
      .post('/api/v1/auth/signin')
      .type('form')
      .send({
        email: userData.email,
        password: userData.password,
      })
      .end((err, res) => {
        const user = res.body.data;
        expect(res).to.have.status(200);
        expect(res.body).property('token');
        expect(user).property('id');
        done(err);
      });
  });
});
