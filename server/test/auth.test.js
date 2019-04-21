import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../server';

const { expect } = chai;

chai.use(chaiHttp);

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

describe('POST /auth/signup', () => {
  it('should #create a user and #generate jwt', (done) => {
    chai
      .request(server)
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
          .to.have.property('phoneNumber')
          .eql(userData.phoneNumber);
        expect(user).to.have.property('registered');
        expect(user)
          .to.have.property('isAdmin')
          .that.is.a('boolean');
        done(err);
      });
  });
});

describe('POST /auth/signin', () => {
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
        expect(res.body).to.have.property('token');
        expect(user).to.have.property('id');
        expect(user)
          .to.have.property('email')
          .eql(userData.email);
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
          .to.have.property('phoneNumber')
          .eql(userData.phoneNumber);
        expect(user).to.have.property('registered');
        expect(user)
          .to.have.property('isAdmin')
          .that.is.a('boolean');
        done(err);
      });
  });
});
