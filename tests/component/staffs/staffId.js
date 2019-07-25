
/* eslint-disable handle-callback-err */
/* eslint-disable no-undef */
/* eslint-disable mocha/valid-suite-description */

// # staffId test
// there is the component test for all possible states that may happen in real call

import chai from 'chai'
import chaiHttp from 'chai-http'
import Mock from '../../services/Staff'
import configs from '../../configs'

chai.use(chaiHttp)
const expect = chai.expect

const mock = new Mock('new')
describe('Staff staffId', () => {
  describe('GET  request with  id as query-string', () => {
    beforeEach(function () {
      return mock.createStaff()
    })
    afterEach(function () {
      return mock.cleanup()
    })
    it('01 when send valid [id] expect return staff object as data ', done => {
      chai
        .request(configs.server.base)
        .get('/v1/staffs/' + mock.ID)
        .set('apikey', configs.apiKey)
        .end((err, res) => {
          expect(res).to.have.header('content-type', 'application/json; charset=utf-8')
          expect(res.body.data).to.have.all.keys('id', 'firstName', 'lastName', 'email', 'gender', 'mobile', 'status', 'updatedAt', 'createdAt')
          expect(res).to.have.status(200)
          expect(res.body.data).to.be.a('object')
          done()
        })
    })
    it('02 when send invalid [id] expect error 404 ', done => {
      chai
        .request(configs.server.base)
        .get('/v1/staffs/' + '26cdd4b8-441f-49e5-a14b-d1bcdab3e391')
        .set('apikey', configs.apiKey)
        .end((err, res) => {
          expect(res).to.have.header('content-type', 'application/json; charset=utf-8')
          expect(res).to.have.status(404)
          expect(res.body).to.have.property('error')
          expect(res.body.error).to.have.all.keys('status', 'statusCode', 'data', 'isBoom', 'isServer', 'output')
          done()
        })
    })
  })
  describe(' PATCH  request with  allowed fileds', () => {
    beforeEach(function () {
      return mock.createStaff()
    })
    afterEach(function () {
      return mock.cleanup()
    })
    it('01 when send all allowed fields expect return object  ', done => {
      var CLIENT = {
        firstName: 'omid',
        lastName: 'shams',
        gender: 1,
        dob: '1987-03-23',
        mobile: '0923458558'
      }
      chai
        .request(configs.server.base)
        .patch('/v1/staffs/' + mock.ID)
        .set('apikey', configs.apiKey)
        .send(CLIENT)
        .end((err, res) => {
          expect(res).to.have.header('content-type', 'application/json; charset=utf-8')
          expect(res).to.have.status(200)
          expect(res.body.data).to.have.all.keys('id', 'firstName', 'lastName', 'email', 'createdAt', 'updatedAt', 'gender', 'mobile', 'dob', 'status')
          expect(res.body).to.be.a('object')
          done()
        })
    })
  })
  describe(' PATCH  request with unallowed fileds', () => {
    beforeEach(function () {
      return mock.createStaff()
    })
    afterEach(function () {
      return mock.cleanup()
    })
    it('01 when send  email filed for change expect error 400 ', done => {
      var CLIENT = {
        email: 'main_test@gmail.com'
      }
      chai
        .request(configs.server.base)
        .patch('/v1/staffs/' + mock.ID)
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
  })
})
