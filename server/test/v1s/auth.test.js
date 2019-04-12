import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../app';

const { expect } = chai;

chai.use(chaiHttp);

const userData = {
  email: 'sylviagana@gmail.com',
  firstname: 'Sylvia',
  lastname: 'Groth',
  othername: 'Anna',
  password: 'password',
  phone: '070443389496',
  address: '46 Lorem Ipsum close, Sit Amet',
  isAdmin: false,
};

describe('POST api/v1/auth/signup', () => {
  it('should #create a user and #generate jwt', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/signup')
      .type('form')
      .send(userData)
      .end((err, res) => {
        const user = res.body.data;
        expect(res.body).to.have.property('token');
        expect(user).to.have.property('id');
        expect(user)
          .to.have.property('firstname')
          .eql(userData.firstname);
        expect(user)
          .to.have.property('lastname')
          .eql(userData.lastname);
        expect(user)
          .to.have.property('othername')
          .eql(userData.othername);
        expect(user)
          .to.have.property('email')
          .eql(userData.email);
        expect(user)
          .to.have.property('phone')
          .eql(userData.phone);
        expect(user).to.have.property('registered');
        expect(user)
          .to.have.property('isAdmin')
          .that.is.a('boolean');
        done(err);
      });
  });
});