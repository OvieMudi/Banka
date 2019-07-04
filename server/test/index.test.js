import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../server';

const { expect } = chai;

chai.use(chaiHttp);

describe('index page routes', () => {
  it('should return status 200', (done) => {
    chai
      .request(server)
      .get('/')
      .end((err, res) => {
        expect(res).status(200);
        done(err);
      });
  });

  it('should load the docs without errors', (done) => {
    chai
      .request(server)
      .get('/api/v1/docs')
      .end((err, res) => {
        expect(res).status(200);
        done(err);
      });
  });

  it('should return status code 200', (done) => {
    chai
      .request(server)
      .get('/api/v1')
      .end((err, res) => {
        expect(res).status(200);
        done(err);
      });
  });
});

describe('General error handler', () => {
  it('should return status 500', (done) => {
    chai
      .request(server)
      .get('/api/v1/accounts/%%2345')
      .end((err, res) => {
        expect(res).status(500);
        done(err);
      });
  });

  it('should return status 404 if url not found', (done) => {
    chai
      .request(server)
      .get('/api/v1/accountz')
      .end((err, res) => {
        expect(res).status(404);
        done(err);
      });
  });
});
