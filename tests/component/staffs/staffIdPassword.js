
/* eslint-disable handle-callback-err */
/* eslint-disable no-undef */
/* eslint-disable mocha/valid-suite-description */

// # staffId/password test
// there is the component test for all possible states that may happen in real call

import chai from 'chai'
import chaiHttp from 'chai-http'
import Mock from '../../services/Staff'
import configs from '../../configs'

chai.use(chaiHttp)
const expect = chai.expect

const mock = new Mock('new')
describe('Staff staffId/Password', () => {
  describe('request with currenct-password and new-password ', () => {
    beforeEach(function () {
      return mock.createStaff()
    })
    afterEach(function () {
      return mock.cleanup()
    })
    it('01 when current password in valid and new password is valid expect return success massage as true ', done => {
      let CLIENT = {
        currentPassword: mock.password,
        newPassword: '123123123'
      }
      chai
        .request(configs.server.base)
        .patch('/v1/staffs/' + mock.ID + '/password')
        .set('apikey', configs.apiKey)
        .send(CLIENT)
        .end((err, res) => {
          expect(res).to.have.header('content-type', 'application/json; charset=utf-8')
          expect(res.body.data).to.have.keys('success')
          expect(res.body.data).to.have.property('success').eql(true)
          expect(res).to.have.status(200)
          expect(res.body.data).to.be.a('object')
          done()
        })
    })
    it('02 when current password in valid and new password is unvalid expect return error 400 ', done => {
      let CLIENT = {
        currentPassword: mock.password,
        newPassword: '123'
      }
      chai
        .request(configs.server.base)
        .patch('/v1/staffs/' + mock.ID + '/password')
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
    it('03 when current password in wrong and new password is valid  expect error 401', done => {
      let CLIENT = {
        currentPassword: '12354335435345',
        newPassword: '123123123'
      }
      chai
        .request(configs.server.base)
        .patch('/v1/staffs/' + mock.ID + '/password')
        .set('apikey', configs.apiKey)
        .send(CLIENT)
        .end((err, res) => {
          expect(res).to.have.header('content-type', 'application/json; charset=utf-8')
          expect(res).to.have.status(401)
          expect(res.body).to.have.property('error')
          expect(res.body.error).to.have.all.keys('status', 'statusCode', 'data', 'isBoom', 'isServer', 'output')
          done()
        })
    })
    it('04 when id is invalid  expect error 404', done => {
      let CLIENT = {
        currentPassword: '12354335435345',
        newPassword: '123123123'
      }
      chai
        .request(configs.server.base)
        .patch('/v1/staffs/' + '31283912083129038190238' + '/password')
        .set('apikey', configs.apiKey)
        .send(CLIENT)
        .end((err, res) => {
          expect(res).to.have.header('content-type', 'application/json; charset=utf-8')
          expect(res).to.have.status(404)
          expect(res.body).to.have.property('error')
          expect(res.body.error).to.have.all.keys('status', 'statusCode', 'data', 'isBoom', 'isServer', 'output')
          done()
        })
    })
  })
  describe('request with  one filed ', () => {
    beforeEach(function () {
      return mock.createStaff()
    })
    afterEach(function () {
      return mock.cleanup()
    })
    it('01 when send current password with out new password expect error 400', done => {
      let CLIENT = {
        currentPassword: mock.password
      }
      chai
        .request(configs.server.base)
        .patch('/v1/staffs/' + mock.ID + '/password')
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
