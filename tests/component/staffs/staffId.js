
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
  describe('GET  sending id as query-string', () => {
    beforeEach(function () {
      return mock.createStaff()
    })
    afterEach(function () {
      return mock.cleanup()
    })
    it('01 sending valid [id] ', done => {
      chai
        .request(configs.server.base)
        .get('/v1/staffs/' + mock.ID)
        .set('apikey', configs.apiKey)
        .end((err, res) => {
          expect(res.body.data).to.have.all.keys('id', 'firstName', 'lastName', 'email', 'gender', 'mobile', 'status', 'updatedAt', 'createdAt')
          expect(res).to.have.status(200)
          expect(res.body.data).to.be.a('object')
          done()
        })
    })
    it('02 sending invalid [id] ', done => {
      chai
        .request(configs.server.base)
        .get('/v1/staffs/' + '26cdd4b8-441f-49e5-a14b-d1bcdab3e391')
        .set('apikey', configs.apiKey)
        .end((err, res) => {
          expect(res).to.have.status(404)
          expect(res.body).to.have.property('error')
          expect(res.body.error).to.have.all.keys('status', 'statusCode', 'data', 'isBoom', 'isServer', 'output')
          done()
        })
    })
  })
  describe(' PATCH when request have optional allowed fileds', () => {
    beforeEach(function () {
      return mock.createStaff()
    })
    afterEach(function () {
      return mock.cleanup()
    })
    it('01 send all fields that can change ', done => {
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
          console.log(res, err)
          expect(res).to.have.status(200)
          expect(res.body.data).to.have.all.keys('id', 'firstName', 'lastName', 'email', 'createdAt', 'updatedAt', 'gender', 'mobile', 'dob', 'status')
          expect(res.body).to.be.a('object')
          done()
        })
    })
  })
  describe(' PATCH  when request have optional unallowed fileds', () => {
    beforeEach(function () {
      return mock.createStaff()
    })
    afterEach(function () {
      return mock.cleanup()
    })
    it('01 changing email filed ', done => {
      var CLIENT = {
        email: 'main_test@gmail.com'
      }
      chai
        .request(configs.server.base)
        .patch('/v1/staffs/' + mock.ID)
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
