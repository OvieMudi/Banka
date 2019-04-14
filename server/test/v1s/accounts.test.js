import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../app';
import { sampleUser } from '../../db/v1s/db';

const { expect } = chai;

chai.use(chaiHttp);

const user = sampleUser;

let token;

before((done) => {
  chai
    .request(app)
    .post('/api/v1/auth/signin')
    .type('form')
    .send({ email: user.email, password: 'password' })
    .end((err, res) => {
      // eslint-disable-next-line prefer-destructuring
      token = res.body.token;
      done(err);
    });
});

describe('POST api/v1/accounts', () => {
  it('should create a new bank account', (done) => {
    chai
      .request(app)
      .post('/api/v1/accounts')
      .set('x-access-token', token)
      .type('form')
      .send({ accType: 'savings' })
      .end((err, res) => {
        const account = res.body.data;
        expect(res).to.have.status(201);
        expect(account).to.have.property('accountNumber');
        expect(account)
          .to.have.property('firstname')
          .eql(user.firstname);
        expect(account)
          .to.have.property('lastname')
          .eql(user.lastname);
        expect(account)
          .to.have.property('email')
          .eql(user.email);
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
