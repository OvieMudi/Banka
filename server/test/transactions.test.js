import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../server';
import { sampleClient, sampleCashier } from '../database/database';

const { expect } = chai;

chai.use(chaiHttp);

let clientToken;
let cashierToken;

before((done) => {
  chai
    .request(server)
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
    .request(server)
    .post('/api/v1/auth/signin')
    .type('form')
    .send({ email: sampleCashier.email, password: 'password' })
    .end((err, res) => {
      cashierToken = res.body.token;
      done(err);
    });
});


const accountNumber = 1002003002;

describe('POST /api/v1/transactions/:accountNumber/credit', () => {
  const path = `/api/v1/transactions/${accountNumber}/credit`;
  it('should return error if token not provided', (done) => {
    chai
      .request(server)
      .post(path)
      .type('form')
      .send({ amount: 300000 })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body)
          .to.have.property('error')
          .eql('token not provided');
        done(err);
      });
  });
  it('should return error if not cashier', (done) => {
    chai
      .request(server)
      .post(path)
      .set('x-access-token', clientToken)
      .type('form')
      .send({ amount: 10000001.23 })
      .end((err, res) => {
        const { body } = res;
        expect(res).status(400);
        expect(body)
          .property('error')
          .eql('operation restricted to Cashier');
        done(err);
      });
  });
  it('should perform credit transaction if cashier', (done) => {
    chai
      .request(server)
      .post(path)
      .set('x-access-token', cashierToken)
      .type('form')
      .send({ amount: 10000001.23 })
      .end((err, res) => {
        const { data } = res.body;
        expect(res).status(201);
        expect(data).property('transactionId');
        done(err);
      });
  });
});
