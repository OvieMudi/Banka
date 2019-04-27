import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../server';
import { sampleAdmin, sampleClient, sampleClient2 } from '../database/sampleData';

const { expect } = chai;

chai.use(chaiHttp);

let clientToken;
let clientToken2;
let adminToken;
let { id } = sampleClient2;

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
    .send({ email: sampleClient2.email, password: 'Password1' })
    .end((err, res) => {
      clientToken2 = res.body.token;
      // eslint-disable-next-line prefer-destructuring
      id = res.body.data.id;
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

/* ==================================== GET ALL ============================================== */
describe('GET /api/v1/users/', () => {
  it('should return error #401 if token not provided', (done) => {
    chai
      .request(server)
      .get('/api/v1/users')
      .end((err, res) => {
        const { body } = res;
        expect(res).to.have.status(401);
        expect(body)
          .to.have.property('error')
          .contains('token not provided');
        done(err);
      });
  });
  it('should return error #403 user is not staff or owner', (done) => {
    chai
      .request(server)
      .get('/api/v1/users')
      .set('x-access-token', clientToken)
      .end((err, res) => {
        const { body } = res;
        expect(res).to.have.status(403);
        expect(body)
          .to.have.property('error')
          .contains('unauthorized');
        done(err);
      });
  });
  it('should get resource if user is staff or owner', (done) => {
    chai
      .request(server)
      .get('/api/v1/users')
      .set('x-access-token', adminToken)
      .end((err, res) => {
        const { data } = res.body;
        expect(res).to.have.status(200);
        expect(data).to.be.an('array');
        expect(data[0]).to.have.property('email');
        done(err);
      });
  });
});

/* ============================ GET ONE ====================================== */
describe('GET /api/v1/users/:id', () => {
  const path = `/api/v1/users/${id}`;
  it('should return error #401 if token not provided', (done) => {
    chai
      .request(server)
      .get(path)
      .end((err, res) => {
        const { body } = res;
        expect(res).to.have.status(401);
        expect(body)
          .to.have.property('error')
          .contains('token not provided');
        done(err);
      });
  });
  it('should return error #403 user is not staff', (done) => {
    chai
      .request(server)
      .get(path)
      .set('x-access-token', clientToken)
      .end((err, res) => {
        const { body } = res;
        expect(res).to.have.status(403);
        expect(body)
          .to.have.property('error')
          .contains('unauthorized');
        done(err);
      });
  });

  it('should return 404 if not found', (done) => {
    chai
      .request(server)
      .get('/api/v1/users/999999')
      .set('x-access-token', adminToken)
      .end((err, res) => {
        const { body } = res;
        expect(res).status(404);
        expect(body).property('error');
        done(err);
      });
  });
  it('should return resource if user is owner or staff', (done) => {
    chai
      .request(server)
      .get(`/api/v1/users/${sampleClient2.id}`)
      .set('x-access-token', clientToken2)
      .end((err, res) => {
        const { body } = res;
        expect(res).to.have.status(200);
        expect(body.data).to.have.property('email');
        done(err);
      });
  });
  it('should get resource if user is staff', (done) => {
    chai
      .request(server)
      .get(`/api/v1/users/${1}`)
      .set('x-access-token', adminToken)
      .end((err, res) => {
        const { data } = res.body;
        expect(res).to.have.status(200);
        expect(data).to.have.property('email');
        done(err);
      });
  });
});

/* =========================== PATCH ======================================= */
describe('PATCH /api/v1/users/:id', () => {
  const path = `/api/v1/users/${id}`;
  const updateData = { lastname: 'Zaxxi' };
  it('should return error #401 if token not provided', (done) => {
    chai
      .request(server)
      .patch(path)
      .type('form')
      .send(updateData)
      .end((err, res) => {
        const { body } = res;
        expect(res).to.have.status(401);
        expect(body)
          .to.have.property('error')
          .contains('token not provided');
        done(err);
      });
  });
  it('should return error #403 user is not staff', (done) => {
    chai
      .request(server)
      .patch(path)
      .set('x-access-token', clientToken)
      .type('form')
      .send(updateData)
      .end((err, res) => {
        const { body } = res;
        expect(res).to.have.status(403);
        expect(body)
          .to.have.property('error')
          .contains('unauthorized');
        done(err);
      });
  });

  it('should return 404 if not found', (done) => {
    chai
      .request(server)
      .patch('/api/v1/users/999999')
      .set('x-access-token', adminToken)
      .type('form')
      .send(updateData)
      .end((err, res) => {
        const { body } = res;
        expect(res).status(404);
        expect(body).property('error');
        done(err);
      });
  });
  it('should update resource if user is staff', (done) => {
    chai
      .request(server)
      .patch(path)
      .set('x-access-token', adminToken)
      .type('form')
      .send(updateData)
      .end((err, res) => {
        const { data } = res.body;
        expect(res).to.have.status(200);
        expect(data).to.have.property('email');
        expect(data)
          .to.have.property('lastname')
          .eql(updateData.lastname);
        done(err);
      });
  });
});

/* ================================================================== */
describe('DELETE /api/v1/users/:id', () => {
  const path = `/api/v1/users/${id}`;
  const path404 = '/api/v1/users/9999';

  it('should return error #401 if token not provided', (done) => {
    chai
      .request(server)
      .delete(path)
      .end((err, res) => {
        const { body } = res;
        expect(res).to.have.status(401);
        expect(body)
          .to.have.property('error')
          .contains('token not provided');
        done(err);
      });
  });
  it('should return error #403 user is not staff', (done) => {
    chai
      .request(server)
      .delete(path)
      .set('x-access-token', clientToken)
      .end((err, res) => {
        const { body } = res;
        expect(res).to.have.status(403);
        expect(body)
          .to.have.property('error')
          .contains('unauthorized');
        done(err);
      });
  });

  it('should return 404 if not found', (done) => {
    chai
      .request(server)
      .delete(path404)
      .set('x-access-token', adminToken)
      .end((err, res) => {
        expect(res).to.have.status(404);
        done(err);
      });
  });
  it('should update resource if user is staff', (done) => {
    chai
      .request(server)
      .delete(path)
      .set('x-access-token', adminToken)
      .end((err, res) => {
        const { body } = res;
        expect(res).to.have.status(200);
        expect(body)
          .to.have.property('message')
          .eql('user successfully deleted');
        done(err);
      });
  });
});
