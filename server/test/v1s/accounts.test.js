import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../app';
import { sampleAccount, sampleClient, sampleAdmin } from '../../db/v1s/db';

const { expect } = chai;

chai.use(chaiHttp);

let clientToken;
let adminToken;

before((done) => {
  chai
    .request(app)
    .post('/api/v1/auth/signin')
    .type('form')
    .send({ email: sampleClient.email, password: 'password' })
    .end((err, res) => {
      clientToken = res.body.token;
      done(err);
    });
});
before((done) => {
  chai
    .request(app)
    .post('/api/v1/auth/signin')
    .type('form')
    .send({ email: sampleAdmin.email, password: 'password' })
    .end((err, res) => {
      adminToken = res.body.token;
      done(err);
    });
});

describe('POST api/v1/accounts', () => {
  it('should create a new bank account', (done) => {
    chai
      .request(app)
      .post('/api/v1/accounts')
      .set('x-access-token', clientToken)
      .type('form')
      .send({ accType: 'savings' })
      .end((err, res) => {
        const account = res.body.data;
        expect(res).to.have.status(201);
        expect(account).to.have.property('accountNumber');
        expect(account)
          .to.have.property('firstname')
          .eql(sampleClient.firstname);
        expect(account)
          .to.have.property('lastname')
          .eql(sampleClient.lastname);
        expect(account)
          .to.have.property('email')
          .eql(sampleClient.email);
        expect(account)
          .to.have.property('type')
          .eql('savings');
        expect(account).to.have.property('openingBalance');
        done(err);
      });
  });
});

describe('GET /api/v1/accounts', () => {
  it('should get all bank accounts from db', (done) => {
    chai
      .request(app)
      .get('/api/v1/accounts')
      .end((err, res) => {
        const accounts = res.body.data;
        expect(res).to.have.status(200);
        expect(accounts).to.be.an('array');
        expect(accounts[0]).to.have.property('accountNumber');
        done(err);
      });
  });
});

describe('PATCH /api/v1/accounts/acctNumber', () => {
  const path = `/api/v1/accounts/${sampleAccount.accountNumber}`;
  it('should return error if token not provided', (done) => {
    chai
      .request(app)
      .patch(path)
      .type('form')
      .send({ status: 'dormant' })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body)
          .to.have.property('error')
          .eql('token not provided');
        done(err);
      });
  });
  it('should return error if not admin', (done) => {
    chai
      .request(app)
      .patch(path)
      .set('x-access-token', clientToken)
      .type('form')
      .send({ status: 'dormant' })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body)
          .to.have.property('error')
          .eql('operation restricted to Admin');
        done(err);
      });
  });
  it('should change status if admin', (done) => {
    chai
      .request(app)
      .patch(path)
      .set('x-access-token', adminToken)
      .type('form')
      .send({ status: 'dormant' })
      .end((err, res) => {
        const { data } = res.body;
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('data');
        expect(data)
          .to.have.property('status')
          .eql('dormant');
        done(err);
      });
  });
});
