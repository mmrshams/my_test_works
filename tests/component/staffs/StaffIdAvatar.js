
/* eslint-disable handle-callback-err */
/* eslint-disable no-undef */
/* eslint-disable mocha/valid-suite-description */

// # staffId/avatar test
// there is the component test for all possible states that may happen in real call

import chai from 'chai'
import chaiHttp from 'chai-http'
import Mock from '../../services/Staff'
import configs from '../../configs'
import Path from 'path'
import fs from 'fs'

let smallImageAddress = { path: Path.join(__dirname, '../../statics/8kb-image.jpeg') }
let largeImageAddress = { path: Path.join(__dirname, '../../statics/10MB.jpg') }
let doc = { path: Path.join(__dirname, '../../statics/test.doc') }

chai.use(chaiHttp)

const expect = chai.expect
const mock = new Mock('new')

describe('Staff staffId/Avatar', () => {
  describe(' PATCH  request with  image file', () => {
    beforeEach(function () {
      return mock.createStaff()
    })
    afterEach(function () {
      return mock.cleanup()
    })
    it('01 when send image with less than 1mb expect return staff object as data ', done => {
      chai
        .request(configs.server.base)
        .patch('/v1/staffs/' + mock.ID + '/avatar')
        .attach('avatar', fs.readFileSync(smallImageAddress.path), 'avatar.jpeg')
        .set('apikey', configs.apiKey)
        .end((err, res) => {
          expect(res).to.have.header('content-type', 'application/json; charset=utf-8')
          expect(res).to.have.status(200)
          expect(res.body.data).to.have.all.keys('id', 'firstName', 'lastName', 'email', 'createdAt', 'updatedAt', 'gender', 'mobile', 'dob', 'status', 'mavatar', 'savatar')
          expect(res.body).to.be.a('object')
          done()
        })
    })
    it('01 when send image with greater than 1mb expect send error ???? ', done => {
      chai
        .request(configs.server.base)
        .patch('/v1/staffs/' + mock.ID + '/avatar')
        .attach('avatar', fs.readFileSync(largeImageAddress.path), 'avatar.jpg')
        .set('apikey', configs.apiKey)
        .end((err, res) => {
          expect(res).to.have.header('content-type', 'application/json; charset=utf-8')
          // expect(res).to.have.status(200)
          // expect(res.body.data).to.have.all.keys('id', 'firstName', 'lastName', 'email', 'createdAt', 'updatedAt', 'gender', 'mobile', 'dob', 'status', 'mavatar', 'savatar')
          // expect(res.body).to.be.a('object')
          done()
        })
    })
  })
  describe(' PATCH  request with another files type exepct ....? ', () => {
    beforeEach(function () {
      return mock.createStaff()
    })
    afterEach(function () {
      return mock.cleanup()
    })
    it('01 send document file ', done => {
      chai
        .request(configs.server.base)
        .patch('/v1/staffs/' + mock.ID + '/avatar')
        .attach('avatar', fs.readFileSync(doc.path), 'avatar.doc')
        .set('apikey', configs.apiKey)
        .end((err, res) => {
          expect(res).to.have.header('content-type', 'application/json; charset=utf-8')
          // expect(res).to.have.status(200)
          // expect(res.body.data).to.have.all.keys('id', 'firstName', 'lastName', 'email', 'createdAt', 'updatedAt', 'gender', 'mobile', 'dob', 'status', 'mavatar', 'savatar')
          // expect(res.body).to.be.a('object')
          done()
        })
    })
  })
})
