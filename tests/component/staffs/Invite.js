
/* eslint-disable handle-callback-err */
/* eslint-disable no-undef */
/* eslint-disable mocha/valid-suite-description */

// # invite test
// there is the component test for all possible states that may happen in real call

import chai from 'chai'
import chaiHttp from 'chai-http'
import Mock from '../../services/Staff'
import configs from '../../configs'

chai.use(chaiHttp)
const expect = chai.expect
const mock = new Mock()

describe('Staff Invite', () => {
  describe(' POST  request have all fields ', () => {
    afterEach(function () {
      return mock.cleanup()
    })
    it('01 when send [ firstName, lastName, email, gender, dob, createdAt, id, mobile, status, updatedAt] fields as valid expect return staff object ', done => {
      var CLIENT = {
        firstName: 'omid',
        lastName: 'shams',
        email: 'main_test@gmail.com',
        gender: 1,
        dob: '1987-03-23',
        mobile: '0923458558'
      }
      chai
        .request(configs.server.base)
        .post('/v1/staffs/invite')
        .set('apikey', configs.apiKey)
        .send(CLIENT)
        .end((err, res) => {
          expect(res).to.have.header('content-type', 'application/json; charset=utf-8')
          expect(res).to.have.status(200)
          expect(res.body.data).to.have.all.keys('id', 'firstName', 'lastName', 'email', 'createdAt', 'updatedAt', 'gender', 'mobile', 'dob', 'status')
          expect(res.body.data).to.have.property('status').eql('invited')
          expect(res.body.data).have.property('email').eql(CLIENT.email)
          expect(res.body).to.be.a('object')
          done()
        })
    })
    it('02 when send email with bad format expect error 400 ', done => {
      var CLIENT = {
        firstName: 'omid',
        lastName: 'shams',
        email: 'main_test',
        gender: 1,
        dob: '1987-03-23',
        mobile: '0923458558'
      }
      chai
        .request(configs.server.base)
        .post('/v1/staffs/invite')
        .set('apikey', configs.apiKey)
        .send(CLIENT)
        .end((err, res) => {
          expect(res).to.have.header('content-type', 'application/json; charset=utf-8')
          expect(res).to.have.status(400)
          expect(res.body).to.have.property('error')
          expect(res.body.error).to.have.all.keys('status', 'statusCode', 'message')
          done()
        })
    })
    it('03 when send gender with number greater than 1  expect error', done => {
      var CLIENT = {
        firstName: 'omid',
        lastName: 'shams',
        email: 'main_test',
        gender: 2,
        dob: '1987-03-23',
        mobile: '0923458558'
      }
      chai
        .request(configs.server.base)
        .post('/v1/staffs/invite')
        .set('apikey', configs.apiKey)
        .send(CLIENT)
        .end((err, res) => {
          expect(res).to.have.header('content-type', 'application/json; charset=utf-8')
          expect(res).to.have.status(400)
          expect(res.body.error).to.have.all.keys('status', 'statusCode', 'message')
          done()
        })
    })
  })
  describe(' POST request with unnecessary aditional field', () => {
    afterEach(function () {
      return mock.cleanup()
    })
    it('01 when send  request with [job] field  expect error 400', done => {
      var CLIENT = {
        firstName: 'omid',
        lastName: 'shams',
        email: 'main_test@gmail.com',
        gender: 1,
        dob: '1987-03-23',
        mobile: '0923458558',
        job: 'co-worker'
      }
      chai
        .request(configs.server.base)
        .post('/v1/staffs/invite')
        .set('apikey', configs.apiKey)
        .send(CLIENT)
        .end((err, res) => {
          expect(res).to.have.header('content-type', 'application/json; charset=utf-8')
          expect(res).to.have.status(400)
          expect(res.body.error).to.have.all.keys('status', 'statusCode', 'message')
          expect(res.body).to.be.a('object')
          done()
        })
    })
  })
  describe(' POST request without optional field and with nessessary fields', () => {
    afterEach(function () {
      return mock.cleanup()
    })
    it('01 when send request with [firstname , lastname , email] expect return staff object ', done => {
      var CLIENT = {
        firstName: 'omid',
        lastName: 'shams',
        email: 'main_test@gmail.com'
      }
      chai
        .request(configs.server.base)
        .post('/v1/staffs/invite')
        .set('apikey', configs.apiKey)
        .send(CLIENT)
        .end((err, res) => {
          expect(res).to.have.header('content-type', 'application/json; charset=utf-8')
          expect(res).to.have.status(200)
          expect(res.body.data).to.have.all.keys('id', 'firstName', 'lastName', 'email', 'status', 'createdAt', 'updatedAt')
          expect(res.body).to.be.a('object')
          done()
        })
    })
  })
  describe(' POST  request without necessary fields', () => {
    afterEach(function () {
      return mock.cleanup()
    })
    it('01 when send request with out [firstname] field expect error 400', done => {
      var CLIENT = {
        lastName: 'shams',
        email: 'main_test@gmail.com',
        gender: 1,
        dob: '1987-03-23',
        mobile: '0923458558',
        job: 'co-worker'
      }
      chai
        .request(configs.server.base)
        .post('/v1/staffs/invite')
        .set('apikey', configs.apiKey)
        .send(CLIENT)
        .end((err, res) => {
          expect(res).to.have.header('content-type', 'application/json; charset=utf-8')
          expect(res).to.have.status(400)
          expect(res.body.error).to.have.all.keys('status', 'statusCode', 'message')
          expect(res.body).to.be.a('object')
          done()
        })
    })
  })
  describe(' POST  user registerd before ', () => {
    beforeEach(function () {
      return mock.createStaff()
    })
    afterEach(function () {
      return mock.cleanup()
    })
    it('01 when email is exist expect error 409 ', done => {
      var CLIENT = {
        firstName: 'omid',
        lastName: 'shams',
        email: mock.email,
        gender: 1,
        dob: '1987-03-23',
        mobile: '0923458558'
      }
      chai
        .request(configs.server.base)
        .post('/v1/staffs/invite')
        .set('apikey', configs.apiKey)
        .send(CLIENT)
        .end((err, res) => {
          expect(res).to.have.header('content-type', 'application/json; charset=utf-8')
          expect(res).to.have.status(409)
          expect(res.body).to.have.property('error')
          expect(res.body.error).to.have.all.keys('status', 'statusCode', 'data', 'isBoom', 'isServer', 'output')
          done()
        })
    })
  })
})
