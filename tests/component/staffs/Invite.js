
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
// status filed must be [new]  not [invited ] couse we need to create user that registerd before for test
const mock = new Mock('new')

describe('Staff Invite', () => {
  describe(' POST when request have correct fields [ firstName, lastName, email, gender, dob, createdAt, id, mobile, status, updatedAt]', () => {
    afterEach(function () {
      return mock.cleanup()
    })
    it('01 all fields are valid ', done => {
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
          expect(res).to.have.status(200)
          expect(res.body.data).to.have.all.keys('id', 'firstName', 'lastName', 'email', 'createdAt', 'updatedAt', 'gender', 'mobile', 'dob', 'status')
          expect(res.body.data).to.have.property('status').eql('invited')
          expect(res.body.data).have.property('email').eql(CLIENT.email)
          expect(res.body).to.be.a('object')
          done()
        })
    })
    it('02 sending email with bad format ', done => {
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
          expect(res).to.have.status(400)
          expect(res.body).to.have.property('error')
          expect(res.body.error).to.have.all.keys('status', 'statusCode', 'message')
          done()
        })
    })
    it('04 sending gender with number greater than 1 ', done => {
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
          expect(res).to.have.status(400)
          expect(res.body.error).to.have.all.keys('status', 'statusCode', 'message')
          done()
        })
    })
  })
  describe(' POST when request have unnecessary aditional field', () => {
    afterEach(function () {
      return mock.cleanup()
    })
    it('01 send request + [job] field ', done => {
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
          expect(res).to.have.status(400)
          expect(res.body.error).to.have.all.keys('status', 'statusCode', 'message')
          expect(res.body).to.be.a('object')
          done()
        })
    })
  })
  describe(' POST when request with out optional field and with nessessary fields => [firstname , lastname , email]', () => {
    afterEach(function () {
      return mock.cleanup()
    })
    it('01 remove all optional fields ', done => {
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
          expect(res).to.have.status(200)
          expect(res.body.data).to.have.all.keys('id', 'firstName', 'lastName', 'email', 'status', 'createdAt', 'updatedAt')
          expect(res.body).to.be.a('object')
          done()
        })
    })
  })
  describe(' POST when send request without necessary fields', () => {
    afterEach(function () {
      return mock.cleanup()
    })
    it('01 send request with out [firstname] field ', done => {
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
          expect(res).to.have.status(400)
          expect(res.body.error).to.have.all.keys('status', 'statusCode', 'message')
          expect(res.body).to.be.a('object')
          done()
        })
    })
  })
  describe(' POST when user registerd before ', () => {
    beforeEach(function () {
      return mock.createStaff()
    })
    afterEach(function () {
      return mock.cleanup()
    })
    it('01 when email is exist ', done => {
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
          expect(res).to.have.status(409)
          expect(res.body).to.have.property('error')
          expect(res.body.error).to.have.all.keys('status', 'statusCode', 'data', 'isBoom', 'isServer', 'output')
          done()
        })
    })
  })
})
