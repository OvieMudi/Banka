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
