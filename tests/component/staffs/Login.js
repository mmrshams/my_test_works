
/* eslint-disable handle-callback-err */
/* eslint-disable no-undef */
/* eslint-disable mocha/valid-suite-description */

// # login test
// there is the component test for all possible states that may happen in real call

import chai from 'chai'
import chaiHttp from 'chai-http'
import Mock from '../../services/Staff'
import configs from '../../configs'

chai.use(chaiHttp)
const expect = chai.expect
const mock = new Mock('new')
describe('Staff login', () => {
  describe(' POST With email and password and extra field - [optional]', () => {
    beforeEach(function () {
      return mock.createStaff()
    })
    afterEach(function () {
      return mock.cleanup()
    })
    // sending name field for testing  with extra field
    it('01 sending extra field - > [ name ] ', done => {
      var CLIENT = {
        email: mock.email,
        password: mock.password,
        name: 'omid'
      }
      chai
        .request(configs.server.base)
        .post('/v1/staffs/login')
        .set('apikey', configs.apiKey)
        .send(CLIENT)
        .end((err, res) => {
          expect(res).to.have.status(400)
          expect(res.body).to.have.property('error')
          expect(res.body.error).to.have.all.keys('status', 'statusCode', 'message')
          expect(res.body).to.be.a('object')
          done()
        })
    })
  })
  describe(' POST With email and password', () => {
    beforeEach(function () {
      return mock.createStaff()
    })
    afterEach(function () {
      return mock.cleanup()
    })
    // this test send valid email and password so we use [ mock.email , mock.password ] that generated with facker
    it('01 When both of them are correct it should return staff', done => {
      var CLIENT = {
        email: mock.email,
        password: mock.password
      }
      chai
        .request(configs.server.base)
        .post('/v1/staffs/login')
        .set('apikey', configs.apiKey)
        .send(CLIENT)
        .end((err, res) => {
          expect(res.body.data.staff).to.have.all.keys('id', 'firstName', 'lastName', 'email', 'lastLogin', 'updatedAt', 'gender', 'mobile', 'status')
          expect(res).to.have.status(200)
          expect(res.body.data).have.property('email').eql(CLIENT.email)
          expect(res.body.data.staff).to.be.a('object')
          done()
        })
    })
    // check state that sending correct email and incorrect password
    it('02 when email is correct and password is incorrect ', done => {
      var CLIENT = {
        email: mock.email,
        password: '2312312312'
      }
      chai
        .request(configs.server.base)
        .post('/v1/staffs/login')
        .set('apikey', configs.apiKey)
        .send(CLIENT)
        .end((err, res) => {
          expect(res).to.have.status(401)
          expect(res.body).to.have.property('error')
          expect(res.body.error).to.have.all.keys('status', 'statusCode', 'data', 'isBoom', 'isServer', 'output')
          done()
        })
    })
    // check state that sending incorrect email and incorrect password
    it('03 when email is incorrect ', done => {
      var CLIENT = {
        email: 'mrshams@tainja.com',
        password: '2312312312'
      }
      chai
        .request(configs.server.base)
        .post('/v1/staffs/login')
        .set('apikey', configs.apiKey)
        .send(CLIENT)
        .end((err, res) => {
          expect(res).to.have.status(404)
          expect(res.body).to.have.property('error')
          done()
        })
    })
  })
  describe(' POST With email and without password', () => {
    beforeEach(function () {
      return mock.createStaff()
    })
    afterEach(function () {
      return mock.cleanup()
    })
    // send correct email without password
    it('01 when email is correct ', done => {
      var CLIENT = {
        email: mock.email
      }
      chai
        .request(configs.server.base)
        .post('/v1/staffs/login')
        .set('apikey', configs.apiKey)
        .send(CLIENT)
        .end((err, res) => {
          expect(res).to.have.status(400)
          expect(res.body).to.have.property('error')
          done()
        })
    })
    // send incorrect email without password
    it('02 when email is incorrect ', done => {
      var CLIENT = {
        email: 'mrshamstainja@gmail.com'
      }
      chai
        .request(configs.server.base)
        .post('/v1/staffs/login')
        .set('apikey', configs.apiKey)
        .send(CLIENT)
        .end((err, res) => {
          expect(res).to.have.status(400)
          expect(res.body).to.have.property('error')
          expect(res.body.error).to.have.all.keys('status', 'statusCode', 'message')
          done()
        })
    })
  })
  describe(' POST null request', () => {
    beforeEach(function () {
      return mock.createStaff()
    })
    afterEach(function () {
      return mock.cleanup()
    })
    // send null request
    it('01  ', done => {
      var CLIENT = {
      }
      chai
        .request(configs.server.base)
        .post('/v1/staffs/login')
        .set('apikey', configs.apiKey)
        .send(CLIENT)
        .end((err, res) => {
          expect(res).to.have.status(400)
          expect(res.body).to.have.property('error')
          expect(res.body.error).to.have.all.keys('status', 'statusCode', 'message')
          done()
        })
    })
  })
})
