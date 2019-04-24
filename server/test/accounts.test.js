import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../server';
import {
  sampleAccount,
  sampleClient,
  sampleAdmin,
  sampleCashier,
  sampleAccount2,
} from '../database/sampleData';

const { expect } = chai;

chai.use(chaiHttp);

let clientToken;
let cashierToken;
let adminToken;

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

describe('POST api/v1/accounts', () => {
  it('should not create account if no JWT', (done) => {
    chai
      .request(server)
      .post('/api/v1/accounts')
      .type('form')
      .send({ type: 'savings' })
      .end((err, res) => {
        const { body } = res;
        expect(res).to.have.status(401);
        expect(body)
          .to.have.property('error')
          .eql('token not provided');
        done(err);
      });
  });
  it('should not create account if not client', (done) => {
    chai
      .request(server)
      .post('/api/v1/accounts')
      .set('x-access-token', adminToken)
      .type('form')
      .send({ type: 'savings' })
      .end((err, res) => {
        const { body } = res;
        expect(res).to.have.status(403);
        expect(body)
          .to.have.property('error')
          .contains('unauthorized');
        done(err);
      });
  });
  it('should create a new bank account', (done) => {
    chai
      .request(server)
      .post('/api/v1/accounts')
      .set('x-access-token', clientToken)
      .type('form')
      .send({ type: 'savings' })
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

/* =================================================================================== */
describe('GET /api/v1/accounts', () => {
  const path = '/api/v1/accounts';
  it('should return authentication error if no token/invalid', (done) => {
    chai
      .request(server)
      .get(path)
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body)
          .property('error')
          .eql('token not provided');
        done(err);
      });
  });
  it('should return authorization error if user is not staff', (done) => {
    chai
      .request(server)
      .get(path)
      .set('x-access-token', clientToken)
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body)
          .property('error')
          .includes('unauthorized');
        done(err);
      });
  });
  it('should get all accounts if user is staff', (done) => {
    chai
      .request(server)
      .get(path)
      .set('x-access-token', adminToken)
      .end((err, res) => {
        const accounts = res.body.data;
        expect(res).to.have.status(200);
        expect(accounts).to.be.an('array');
        expect(accounts[0]).to.have.property('accountNumber');
        done(err);
      });
  });
  it('should get all active accounts', (done) => {
    chai
      .request(server)
      .get(`${path}?status=active`)
      .set('x-access-token', adminToken)
      .end((err, res) => {
        const accounts = res.body.data;
        expect(res).to.have.status(200);
        expect(accounts).to.be.an('array');
        expect(accounts[0])
          .to.have.property('status')
          .eql('active');
        done(err);
      });
  });
  it('should get all dormant account', (done) => {
    chai
      .request(server)
      .get(`${path}?status=dormant`)
      .set('x-access-token', adminToken)
      .end((err, res) => {
        const accounts = res.body.data;
        expect(res).to.have.status(200);
        expect(accounts).to.be.an('array');
        expect(accounts[0])
          .to.have.property('status')
          .eql('dormant');
        done(err);
      });
  });
});

/* =================================================================================== */
describe('GET /api/v1/accounts/:accountNumber', () => {
  const path = `/api/v1/accounts/${sampleAccount2.accountNumber}`;
  it('should return authentication error if no token/invalid', (done) => {
    chai
      .request(server)
      .get(path)
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body)
          .property('error')
          .eql('token not provided');
        done(err);
      });
  });
  it('should return authorization error if user is not staff', (done) => {
    chai
      .request(server)
      .get(path)
      .set('x-access-token', clientToken)
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body)
          .property('error')
          .includes('unauthorized');
        done(err);
      });
  });
  it('should get all account if user is staff', (done) => {
    chai
      .request(server)
      .get(path)
      .set('x-access-token', adminToken)
      .end((err, res) => {
        const account = res.body.data;
        expect(res).to.have.status(200);
        expect(account)
          .to.have.property('accountNumber')
          .eql(sampleAccount2.accountNumber);
        done(err);
      });
  });
});

/* =================================================================================== */
describe('GET /api/v1/user/:userEmail/accounts', () => {
  const path = `/api/v1/user/${sampleClient.email}/accounts`;
  it('should return authentication error if no token/invalid', (done) => {
    chai
      .request(server)
      .get(path)
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body)
          .property('error')
          .eql('token not provided');
        done(err);
      });
  });
  it('should return authorization error if user is not staff', (done) => {
    chai
      .request(server)
      .get(path)
      .set('x-access-token', clientToken)
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body)
          .property('error')
          .includes('unauthorized');
        done(err);
      });
  });
  it('should get all account if user is staff', (done) => {
    chai
      .request(server)
      .get(path)
      .set('x-access-token', adminToken)
      .end((err, res) => {
        const account = res.body.data;
        expect(res).to.have.status(200);
        expect(account).to.be.a('array');
        expect(account[0])
          .to.have.property('accountNumber')
          .eql(sampleAccount.accountNumber);
        done(err);
      });
  });
});

/* ===================================================================================== */
describe('PATCH /api/v1/accounts/accountNumber', () => {
  const path = `/api/v1/accounts/${sampleAccount.accountNumber}`;
  it('should return error if token not provided', (done) => {
    chai
      .request(server)
      .patch(path)
      .type('form')
      .send({ status: 'dormant' })
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body)
          .to.have.property('error')
          .eql('token not provided');
        done(err);
      });
  });
  it('should return error if not admin', (done) => {
    chai
      .request(server)
      .patch(path)
      .set('x-access-token', clientToken)
      .type('form')
      .send({ status: 'dormant' })
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body)
          .to.have.property('error')
          .includes('unauthorized');
        done(err);
      });
  });
  it('should change status if admin', (done) => {
    chai
      .request(server)
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

/* ===================================================================================== */
describe('PATCH /api/v1/accounts/accountNumber', () => {
  const path = `/api/v1/accounts/${sampleAccount.accountNumber}`;
  it('should return error if token not provided', (done) => {
    chai
      .request(server)
      .patch(path)
      .type('form')
      .send({ status: 'dormant' })
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body)
          .to.have.property('error')
          .eql('token not provided');
        done(err);
      });
  });
  it('should return error if not admin', (done) => {
    chai
      .request(server)
      .patch(path)
      .set('x-access-token', clientToken)
      .type('form')
      .send({ status: 'dormant' })
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body)
          .to.have.property('error')
          .includes('unauthorized');
        done(err);
      });
  });
  it('should change status if admin', (done) => {
    chai
      .request(server)
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

/* ================================================================================== */
describe('GET /api/v1/accounts/:accountNumber/transctions', () => {
  const path = `/api/v1/accounts/${sampleAccount.accountNumber}/transactions`;
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
  it('should return error if user is not owner or cashier', (done) => {
    chai
      .request(server)
      .get(path)
      .set('x-access-token', adminToken)
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body)
          .to.have.property('error')
          .include('unauthorized');
        done(err);
      });
  });
  it('get transaction history if owner or cashier', (done) => {
    chai
      .request(server)
      .get(path)
      .set('x-access-token', cashierToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body)
          .to.have.property('data')
          .is.an('array');
        done(err);
      });
  });
});

/* ================================================================================== */
describe('DELETE /api/v1/accounts/accountNumber', () => {
  const path = `/api/v1/accounts/${sampleAccount.accountNumber}`;
  it('should return error if token not provided', (done) => {
    chai
      .request(server)
      .delete(path)
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body)
          .to.have.property('error')
          .eql('token not provided');
        done(err);
      });
  });
  it('should return error if not admin', (done) => {
    chai
      .request(server)
      .delete(path)
      .set('x-access-token', clientToken)
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body)
          .to.have.property('error')
          .include('unauthorized');
        done(err);
      });
  });
  it('should delete account if admin', (done) => {
    chai
      .request(server)
      .delete(path)
      .set('x-access-token', adminToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body)
          .to.have.property('message')
          .eql('account deleted successfully');
        done(err);
      });
  });
});
