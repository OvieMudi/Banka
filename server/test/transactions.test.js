import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../server';
import {
  sampleClient,
  sampleCashier,
  sampleAccount2,
  sampleTransaction,
} from '../database/sampleData';

const { expect } = chai;

chai.use(chaiHttp);

let clientToken;
let cashierToken;

const { accountNumber, balance: oldBalance } = sampleAccount2;
const transactionAmount = { amount: 12345.0 };

before((done) => {
  chai
    .request(server)
    .post('/api/v1/auth/signin')
    .type('form')
    .send({ email: sampleClient.email, password: 'Password1' })
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
    .send({ email: sampleCashier.email, password: 'Password1' })
    .end((err, res) => {
      cashierToken = res.body.token;
      done(err);
    });
});

/* ============================= GET ALL ============================== */

describe('GET /api/v1/transactions/', () => {
  const path = '/api/v1/transactions/';
  it('should return error if token not provided', (done) => {
    chai
      .request(server)
      .get(path)
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body)
          .to.have.property('error')
          .eql('token not provided');
        done(err);
      });
  });
  it('should return error if not staff', (done) => {
    chai
      .request(server)
      .get(path)
      .set('x-access-token', clientToken)
      .end((err, res) => {
        const { body } = res;
        expect(res).to.have.status(403);
        expect(body)
          .property('error')
          .contains('unauthorized');
        done(err);
      });
  });

  it('should return transactions if owner or admin', (done) => {
    chai
      .request(server)
      .get(path)
      .set('x-access-token', cashierToken)
      .end((err, res) => {
        expect(res).status(200);
        done(err);
      });
  });
});

/* ====================================== GET ONE ============================================ */
describe('GET /api/v1/transactions/:id', () => {
  const path = `/api/v1/transactions/${sampleTransaction.id}`;
  const path404 = '/api/v1/transactions/1234456';
  it('should return error if token not provided', (done) => {
    chai
      .request(server)
      .get(path)
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body)
          .to.have.property('error')
          .eql('token not provided');
        done(err);
      });
  });
  it('should return error if not cashier or onwer', (done) => {
    chai
      .request(server)
      .get(path)
      .set('x-access-token', clientToken)
      .end((err, res) => {
        const { body } = res;
        expect(res).to.have.status(403);
        expect(body)
          .property('error')
          .contains('unauthorized');
        done(err);
      });
  });

  it('should return 404 if not found', (done) => {
    chai
      .request(server)
      .get(path404)
      .set('x-access-token', cashierToken)
      .end((err, res) => {
        expect(res).status(404);
        expect(res.body).property('error');
        done(err);
      });
  });

  it('should return transaction if owner or admin', (done) => {
    chai
      .request(server)
      .get(path)
      .set('x-access-token', cashierToken)
      .end((err, res) => {
        const { data } = res.body;
        expect(res).status(200);
        expect(data)
          .property('id')
          .eql(sampleTransaction.id);
        expect(data)
          .property('type')
          .eql(sampleTransaction.type);
        done(err);
      });
  });
});

/* ============================ POST ==================================== */
describe('POST /api/v1/transactions/:accountNumber/credit', () => {
  const path = `/api/v1/transactions/${accountNumber}/credit`;
  it('should return error if token not provided', (done) => {
    chai
      .request(server)
      .post(path)
      .type('form')
      .send(transactionAmount)
      .end((err, res) => {
        expect(res).to.have.status(401);
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
      .send(transactionAmount)
      .end((err, res) => {
        const { body } = res;
        expect(res).status(403);
        expect(body)
          .property('error')
          .contains('unauthorized');
        done(err);
      });
  });
  it('should perform credit transaction if cashier', (done) => {
    chai
      .request(server)
      .post(path)
      .set('x-access-token', cashierToken)
      .type('form')
      .send(transactionAmount)
      .end((err, res) => {
        const { data } = res.body;
        data.accountBalance = Number(data.accountBalance);
        expect(res).status(201);
        expect(data).property('transactionId');
        expect(data)
          .property('accountBalance')
          .equal(oldBalance + transactionAmount.amount);

        done(err);
      });
  });
});

/* ================================================================================== */
describe('POST /api/v1/transactions/:accountNumber/debit', () => {
  const path = `/api/v1/transactions/${accountNumber}/debit`;
  const inactivePath = '/api/v1/transactions/1002003005';
  it('should return error if token not provided', (done) => {
    chai
      .request(server)
      .post(path)
      .type('form')
      .send(transactionAmount)
      .end((err, res) => {
        expect(res).to.have.status(401);
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
      .send(transactionAmount)
      .end((err, res) => {
        const { body } = res;
        expect(res).to.have.status(403);
        expect(body)
          .property('error')
          .contains('unauthorized');
        done(err);
      });
  });

  it('should perform debit transaction if cashier', (done) => {
    chai
      .request(server)
      .post(path)
      .set('x-access-token', cashierToken)
      .type('form')
      .send(transactionAmount)
      .end((err, res) => {
        const { data } = res.body;
        data.accountBalance = Number(data.accountBalance);
        expect(res).status(201);
        expect(data).property('transactionId');
        expect(data).property('accountBalance');
        done(err);
      });
  });

  it('should not perform credit transactions if not active', (done) => {
    chai
      .request(server)
      .post(`${inactivePath}/credit`)
      .set('x-access-token', cashierToken)
      .type('form')
      .send(transactionAmount)
      .end((err, res) => {
        const { body } = res;
        expect(res).status(400);
        expect(body)
          .property('error')
          .includes('not active');
        done(err);
      });
  });

  it('should not perform debit on invalid account', (done) => {
    chai
      .request(server)
      .post(`${inactivePath}/debit`)
      .set('x-access-token', cashierToken)
      .type('form')
      .send(transactionAmount)
      .end((err, res) => {
        const { body } = res;
        expect(res).status(400);
        expect(body)
          .property('error')
          .includes('not active');
        done(err);
      });
  });

  it('should error if amount lower than balance', (done) => {
    chai
      .request(server)
      .post(path)
      .set('x-access-token', cashierToken)
      .type('form')
      .send({ amount: 999999999 })
      .end((err, res) => {
        expect(res).status(400);
        done(err);
      });
  });
  /* =================== 403 ======================== */
  it('should return 403 for invalid params', (done) => {
    chai
      .request(server)
      .post('/api/v1/transactions/100011/credit')
      .set('x-access-token', cashierToken)
      .type('form')
      .send(transactionAmount)
      .end((err, res) => {
        const { body } = res;

        expect(res).status(400);
        expect(body)
          .property('error')
          .includes('invalid');
        done(err);
      });
  });
  /* =================== 404 ======================== */
  it('should return 404 error if not found', (done) => {
    chai
      .request(server)
      .post('/api/v1/transactions/1002003071/credit')
      .set('x-access-token', cashierToken)
      .type('form')
      .send(transactionAmount)
      .end((err, res) => {
        const { body } = res;

        expect(res).status(404);
        expect(body)
          .property('error')
          .includes('not found');
        done(err);
      });
  });
});
